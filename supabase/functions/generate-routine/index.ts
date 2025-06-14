import { corsHeaders } from '../_shared/cors.ts';

interface UserProfile {
  ageRange: string;
  skinType: string;
  concerns: string[];
  budget: number;
  productPreference: string;
}

interface ScanResults {
  skinType: string;
  concerns: string[];
  confidence: number;
}

interface RoutineRequest {
  userProfile: UserProfile;
  scanResults?: ScanResults;
}

interface RoutineProduct {
  step: string;
  product: string;
  brand: string;
  price: number;
  reasoning: string;
}

interface RoutineResponse {
  success: boolean;
  morning_routine?: RoutineProduct[];
  evening_routine?: RoutineProduct[];
  total_cost?: number;
  confidence_score?: number;
  ai_reasoning?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body: RoutineRequest = await req.json();
    
    // Validate required fields
    if (!body.userProfile) {
      return new Response(
        JSON.stringify({ success: false, error: 'User profile is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { userProfile, scanResults } = body;

    // Validate user profile fields
    const requiredFields = ['ageRange', 'skinType', 'concerns', 'budget', 'productPreference'];
    for (const field of requiredFields) {
      if (!userProfile[field as keyof UserProfile]) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const effectiveSkinType = scanResults?.skinType || userProfile.skinType;
    const effectiveConcerns = scanResults?.concerns || userProfile.concerns;

    // Prepare the prompt for OpenAI
    const prompt = `
You are a skincare expert specializing in Indian skincare brands and products. Create a personalized skincare routine.

User Profile:
- Age: ${userProfile.ageRange}
- Skin Type: ${effectiveSkinType}
- Concerns: ${effectiveConcerns.join(', ')}
- Budget: ₹${userProfile.budget} per month
- Preference: ${userProfile.productPreference}
${scanResults ? `- AI Scan Results: ${scanResults.skinType} skin with ${scanResults.concerns.join(', ')} (${scanResults.confidence}% confidence)` : ''}

Create a routine with:
1. Morning routine (4-5 steps): Cleanser, Toner/Serum, Moisturizer, Sunscreen
2. Evening routine (4-5 steps): Cleanser, Toner/Serum, Treatment, Moisturizer

Focus on:
- Indian brands (Himalaya, Biotique, Mamaearth, Plum, Minimalist, Dot & Key) if preference is Ayurvedic/Natural
- International brands (Cetaphil, Neutrogena, Olay, The Ordinary) if preference is Premium
- Stay within budget
- Address specific skin concerns
- Age-appropriate ingredients

Respond in JSON format only:
{
  "morning": [
    {
      "step": "1. Cleanser",
      "product": "Product Name",
      "brand": "Brand Name",
      "price": 299,
      "reasoning": "Why this product"
    }
  ],
  "evening": [
    {
      "step": "1. Cleanser",
      "product": "Product Name",
      "brand": "Brand Name", 
      "price": 299,
      "reasoning": "Why this product"
    }
  ],
  "totalCost": 1200,
  "confidence": 85,
  "reasoning": "Overall explanation of routine choices"
}
`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert skincare consultant with deep knowledge of Indian skincare brands, climate considerations, and budget-conscious recommendations for Indian women aged 18-45.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.3
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response from OpenAI
    let routine;
    try {
      routine = JSON.parse(content);
    } catch (parseError) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and sanitize the response
    const response: RoutineResponse = {
      success: true,
      morning_routine: Array.isArray(routine.morning) ? routine.morning : [],
      evening_routine: Array.isArray(routine.evening) ? routine.evening : [],
      total_cost: Math.max(0, routine.totalCost || 0),
      confidence_score: Math.min(100, Math.max(0, routine.confidence || 75)),
      ai_reasoning: routine.reasoning || 'Personalized routine based on your skin type and concerns'
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Routine generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
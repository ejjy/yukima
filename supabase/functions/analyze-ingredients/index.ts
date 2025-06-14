import { corsHeaders } from '../_shared/cors.ts';

interface IngredientAnalysisRequest {
  ingredients: string[];
  userProfile: {
    skinType: string;
    concerns: string[];
  };
}

interface IngredientResult {
  ingredient: string;
  safety_score: number;
  compatibility: 'excellent' | 'good' | 'caution' | 'avoid';
  benefits: string[];
  warnings: string[];
  alternatives?: string[];
}

interface IngredientAnalysisResponse {
  success: boolean;
  results?: IngredientResult[];
  overall_safety?: number;
  recommendations?: string[];
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
    const body: IngredientAnalysisRequest = await req.json();
    
    // Validate required fields
    if (!body.ingredients || !Array.isArray(body.ingredients) || body.ingredients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ingredients array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Limit number of ingredients
    if (body.ingredients.length > 20) {
      return new Response(
        JSON.stringify({ success: false, error: 'Maximum 20 ingredients allowed per request' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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

    // Prepare the prompt for OpenAI
    const prompt = `
You are a cosmetic chemist and dermatologist. Analyze these skincare ingredients for safety and compatibility.

Ingredients to analyze: ${body.ingredients.join(', ')}

User Profile:
- Skin type: ${body.userProfile.skinType}
- Concerns: ${body.userProfile.concerns.join(', ')}

For each ingredient, provide:
1. Safety score (0-100)
2. Compatibility level (excellent/good/caution/avoid) for this user's skin type
3. Benefits for this skin type
4. Warnings or side effects
5. Alternative ingredients if needed

Respond in JSON format only:
[
  {
    "ingredient": "ingredient_name",
    "safety_score": 85,
    "compatibility": "good",
    "benefits": ["benefit1", "benefit2"],
    "warnings": ["warning1", "warning2"],
    "alternatives": ["alternative1", "alternative2"]
  }
]
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
            content: 'You are an expert cosmetic chemist and dermatologist specializing in ingredient analysis for Indian skin types and climate conditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.2
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
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and sanitize the response
    const results: IngredientResult[] = analysis.map((item: any) => ({
      ingredient: item.ingredient || 'Unknown',
      safety_score: Math.min(100, Math.max(0, item.safety_score || 70)),
      compatibility: ['excellent', 'good', 'caution', 'avoid'].includes(item.compatibility) 
        ? item.compatibility 
        : 'good',
      benefits: Array.isArray(item.benefits) ? item.benefits : ['General skincare benefits'],
      warnings: Array.isArray(item.warnings) ? item.warnings : ['Patch test recommended'],
      alternatives: Array.isArray(item.alternatives) ? item.alternatives : []
    }));

    // Calculate overall safety score
    const overallSafety = Math.round(
      results.reduce((sum, result) => sum + result.safety_score, 0) / results.length
    );

    // Generate recommendations
    const recommendations: string[] = [];
    const cautionIngredients = results.filter(r => r.compatibility === 'caution' || r.compatibility === 'avoid');
    const excellentIngredients = results.filter(r => r.compatibility === 'excellent');

    if (cautionIngredients.length > 0) {
      recommendations.push(`Consider patch testing products with: ${cautionIngredients.map(r => r.ingredient).join(', ')}`);
    }

    if (excellentIngredients.length > 0) {
      recommendations.push(`Great ingredients for your skin: ${excellentIngredients.map(r => r.ingredient).join(', ')}`);
    }

    if (overallSafety >= 85) {
      recommendations.push('This ingredient combination looks safe for your skin type');
    } else if (overallSafety >= 70) {
      recommendations.push('This combination is generally safe but monitor for any reactions');
    } else {
      recommendations.push('This combination may not be ideal for your skin - consider alternatives');
    }

    const response: IngredientAnalysisResponse = {
      success: true,
      results,
      overall_safety: overallSafety,
      recommendations
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Ingredient analysis error:', error);
    
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
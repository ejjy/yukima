import { corsHeaders } from '../_shared/cors.ts';

interface FaceScanRequest {
  imageData: string;
  userProfile: {
    skinType: string;
    concerns: string[];
    ageRange: string;
  };
}

interface FaceScanResponse {
  success: boolean;
  result?: {
    skinType: string;
    concerns: string[];
    confidence: number;
    recommendations: string[];
    analysis: {
      oiliness: number;
      dryness: number;
      acne_severity: number;
      pigmentation: number;
      texture_score: number;
    };
  };
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
    const body: FaceScanRequest = await req.json();
    
    // Validate required fields
    if (!body.imageData || !body.userProfile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image data and user profile are required' }),
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

    // Prepare the prompt for OpenAI Vision API
    const prompt = `
You are an expert dermatologist and skincare specialist. Analyze this facial image and provide a detailed skin analysis.

User Profile Context:
- Self-reported skin type: ${body.userProfile.skinType}
- Self-reported concerns: ${body.userProfile.concerns.join(', ')}
- Age range: ${body.userProfile.ageRange}

Please analyze the image and provide:
1. Detected skin type (oily, dry, combination, sensitive, normal, acne-prone, mature)
2. Visible skin concerns (acne, pigmentation, dullness, large pores, fine lines, etc.)
3. Confidence score (0-100) for your analysis
4. Specific recommendations for this skin
5. Detailed analysis scores for: oiliness (0-100), dryness (0-100), acne severity (0-100), pigmentation (0-100), texture score (0-100)

Respond in JSON format only:
{
  "skinType": "detected_skin_type",
  "concerns": ["concern1", "concern2"],
  "confidence": 85,
  "recommendations": ["recommendation1", "recommendation2"],
  "analysis": {
    "oiliness": 45,
    "dryness": 20,
    "acne_severity": 30,
    "pigmentation": 25,
    "texture_score": 75
  }
}
`;

    // Call OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${body.imageData}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
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
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and sanitize the response
    const result = {
      skinType: analysis.skinType || body.userProfile.skinType,
      concerns: Array.isArray(analysis.concerns) ? analysis.concerns : body.userProfile.concerns,
      confidence: Math.min(100, Math.max(0, analysis.confidence || 75)),
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [
        'Use a gentle cleanser twice daily',
        'Apply sunscreen every morning',
        'Moisturize regularly'
      ],
      analysis: {
        oiliness: Math.min(100, Math.max(0, analysis.analysis?.oiliness || 50)),
        dryness: Math.min(100, Math.max(0, analysis.analysis?.dryness || 30)),
        acne_severity: Math.min(100, Math.max(0, analysis.analysis?.acne_severity || 20)),
        pigmentation: Math.min(100, Math.max(0, analysis.analysis?.pigmentation || 25)),
        texture_score: Math.min(100, Math.max(0, analysis.analysis?.texture_score || 70))
      }
    };

    const response: FaceScanResponse = {
      success: true,
      result
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Face scan analysis error:', error);
    
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
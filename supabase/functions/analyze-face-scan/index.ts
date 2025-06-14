import { corsHeaders } from '../_shared/cors.ts';

interface FaceScanRequest {
  image: string;
  userProfile?: {
    skin_type?: string;
    concerns?: string[];
    age_range?: string;
  };
}

interface FaceScanResponse {
  success: boolean;
  skin_type?: string;
  concerns?: string[];
  confidence?: number;
  recommendations?: string[];
  analysis_details?: {
    oiliness: number;
    dryness: number;
    acne_severity: number;
    pigmentation: number;
    texture_score: number;
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
    if (!body.image) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image data is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate image format (basic check)
    if (!body.image.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid image format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Simulate AI analysis processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate realistic analysis results
    const analysisDetails = {
      oiliness: Math.floor(Math.random() * 40) + 30, // 30-70
      dryness: Math.floor(Math.random() * 30) + 10,  // 10-40
      acne_severity: Math.floor(Math.random() * 50) + 10, // 10-60
      pigmentation: Math.floor(Math.random() * 40) + 20, // 20-60
      texture_score: Math.floor(Math.random() * 30) + 60, // 60-90
    };

    // Determine skin type based on analysis
    let detectedSkinType: string;
    if (analysisDetails.oiliness > 50) {
      detectedSkinType = 'oily';
    } else if (analysisDetails.dryness > 25) {
      detectedSkinType = 'dry';
    } else if (analysisDetails.oiliness > 35 && analysisDetails.dryness > 15) {
      detectedSkinType = 'combination';
    } else {
      detectedSkinType = 'sensitive';
    }

    // Determine concerns based on analysis
    const detectedConcerns: string[] = [];
    if (analysisDetails.acne_severity > 30) detectedConcerns.push('acne');
    if (analysisDetails.pigmentation > 40) detectedConcerns.push('pigmentation');
    if (analysisDetails.texture_score < 70) detectedConcerns.push('dullness');
    if (analysisDetails.oiliness > 60) detectedConcerns.push('large_pores');
    if (analysisDetails.dryness > 30) detectedConcerns.push('dryness');

    // Generate confidence score (higher if user profile matches)
    let confidence = Math.floor(Math.random() * 20) + 70; // Base 70-90
    
    if (body.userProfile) {
      // Boost confidence if detected skin type matches user profile
      if (body.userProfile.skin_type === detectedSkinType) {
        confidence = Math.min(95, confidence + 10);
      }
      
      // Boost confidence if detected concerns overlap with user concerns
      if (body.userProfile.concerns) {
        const overlap = detectedConcerns.filter(concern => 
          body.userProfile!.concerns!.includes(concern)
        ).length;
        confidence = Math.min(98, confidence + (overlap * 3));
      }
    }

    // Generate personalized recommendations
    const recommendations = [
      `Use a ${detectedSkinType === 'oily' ? 'gel-based' : 'cream-based'} cleanser twice daily`,
      `Apply sunscreen with SPF 30+ every morning`,
      detectedConcerns.includes('acne') ? 'Consider salicylic acid treatment' : 'Use a gentle exfoliant 2-3 times per week',
      detectedConcerns.includes('pigmentation') ? 'Try vitamin C serum in the morning' : 'Use a hydrating serum',
      `Moisturize with a ${detectedSkinType === 'oily' ? 'lightweight' : 'rich'} formula`
    ];

    const response: FaceScanResponse = {
      success: true,
      skin_type: detectedSkinType,
      concerns: detectedConcerns,
      confidence,
      recommendations,
      analysis_details: analysisDetails
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
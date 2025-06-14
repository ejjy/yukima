import { corsHeaders } from '../_shared/cors.ts';

interface IngredientAnalysisRequest {
  ingredients: string[];
  userProfile?: {
    skin_type?: string;
    concerns?: string[];
  };
}

interface IngredientResult {
  name: string;
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

// Comprehensive ingredient database
const INGREDIENT_DATABASE: Record<string, {
  safety_score: number;
  benefits: string[];
  warnings: string[];
  skin_types: Record<string, number>; // compatibility scores
  concerns: Record<string, number>; // effectiveness scores
  alternatives?: string[];
}> = {
  'niacinamide': {
    safety_score: 95,
    benefits: ['Reduces pore appearance', 'Controls oil production', 'Brightens skin'],
    warnings: ['May cause flushing in high concentrations'],
    skin_types: { oily: 95, combination: 90, dry: 85, sensitive: 80 },
    concerns: { acne: 90, large_pores: 95, dullness: 85, pigmentation: 80 },
    alternatives: ['zinc oxide', 'azelaic acid']
  },
  'salicylic acid': {
    safety_score: 85,
    benefits: ['Unclogs pores', 'Reduces acne', 'Gentle exfoliation'],
    warnings: ['Can cause dryness', 'Increase sun sensitivity', 'Avoid during pregnancy'],
    skin_types: { oily: 95, combination: 85, dry: 60, sensitive: 50 },
    concerns: { acne: 95, large_pores: 85, dullness: 70 },
    alternatives: ['lactic acid', 'mandelic acid']
  },
  'hyaluronic acid': {
    safety_score: 98,
    benefits: ['Intense hydration', 'Plumps skin', 'Suitable for all skin types'],
    warnings: ['May feel sticky in humid climates'],
    skin_types: { oily: 90, combination: 95, dry: 98, sensitive: 95 },
    concerns: { dryness: 98, fine_lines: 90, dullness: 80 },
    alternatives: ['glycerin', 'sodium hyaluronate']
  },
  'retinol': {
    safety_score: 70,
    benefits: ['Anti-aging', 'Improves texture', 'Reduces acne'],
    warnings: ['Can cause irritation', 'Increase sun sensitivity', 'Avoid during pregnancy'],
    skin_types: { oily: 85, combination: 80, dry: 70, sensitive: 40 },
    concerns: { acne: 85, fine_lines: 95, pigmentation: 80, dullness: 85 },
    alternatives: ['bakuchiol', 'peptides']
  },
  'vitamin c': {
    safety_score: 80,
    benefits: ['Antioxidant protection', 'Brightens skin', 'Boosts collagen'],
    warnings: ['Can oxidize easily', 'May cause irritation in sensitive skin'],
    skin_types: { oily: 85, combination: 85, dry: 80, sensitive: 65 },
    concerns: { pigmentation: 90, dullness: 95, fine_lines: 80 },
    alternatives: ['magnesium ascorbyl phosphate', 'arbutin']
  },
  'glycolic acid': {
    safety_score: 75,
    benefits: ['Deep exfoliation', 'Improves texture', 'Reduces pigmentation'],
    warnings: ['Can cause irritation', 'Increase sun sensitivity', 'Start with low concentration'],
    skin_types: { oily: 90, combination: 80, dry: 70, sensitive: 45 },
    concerns: { acne: 80, pigmentation: 90, dullness: 95, fine_lines: 85 },
    alternatives: ['lactic acid', 'mandelic acid']
  },
  'benzoyl peroxide': {
    safety_score: 70,
    benefits: ['Kills acne bacteria', 'Reduces inflammation', 'Fast-acting'],
    warnings: ['Can bleach fabrics', 'May cause dryness', 'Can be irritating'],
    skin_types: { oily: 85, combination: 75, dry: 50, sensitive: 40 },
    concerns: { acne: 95, large_pores: 70 },
    alternatives: ['tea tree oil', 'sulfur']
  },
  'ceramides': {
    safety_score: 96,
    benefits: ['Strengthens skin barrier', 'Prevents moisture loss', 'Soothes irritation'],
    warnings: ['None known'],
    skin_types: { oily: 80, combination: 90, dry: 98, sensitive: 95 },
    concerns: { dryness: 95, sensitivity: 90, fine_lines: 75 },
    alternatives: ['cholesterol', 'fatty acids']
  },
  'peptides': {
    safety_score: 92,
    benefits: ['Stimulates collagen', 'Firms skin', 'Reduces fine lines'],
    warnings: ['Results take time to show'],
    skin_types: { oily: 85, combination: 90, dry: 95, sensitive: 90 },
    concerns: { fine_lines: 95, dullness: 80, firmness: 90 },
    alternatives: ['retinol', 'vitamin c']
  },
  'zinc oxide': {
    safety_score: 98,
    benefits: ['Broad spectrum sun protection', 'Anti-inflammatory', 'Suitable for sensitive skin'],
    warnings: ['Can leave white cast'],
    skin_types: { oily: 90, combination: 95, dry: 90, sensitive: 98 },
    concerns: { acne: 80, sensitivity: 95, pigmentation: 85 },
    alternatives: ['titanium dioxide', 'chemical sunscreens']
  }
};

function analyzeIngredient(
  ingredientName: string, 
  userProfile?: { skin_type?: string; concerns?: string[] }
): IngredientResult {
  const normalizedName = ingredientName.toLowerCase().trim();
  const ingredientData = INGREDIENT_DATABASE[normalizedName];
  
  if (!ingredientData) {
    // Unknown ingredient - provide conservative analysis
    return {
      name: ingredientName,
      safety_score: 60,
      compatibility: 'caution',
      benefits: ['Unknown ingredient - research recommended'],
      warnings: ['Limited safety data available', 'Patch test recommended'],
      alternatives: ['Well-researched alternatives recommended']
    };
  }

  let adjustedSafetyScore = ingredientData.safety_score;
  let compatibility: 'excellent' | 'good' | 'caution' | 'avoid' = 'good';

  // Adjust based on user's skin type
  if (userProfile?.skin_type) {
    const skinTypeScore = ingredientData.skin_types[userProfile.skin_type] || 70;
    adjustedSafetyScore = Math.round((adjustedSafetyScore + skinTypeScore) / 2);
  }

  // Determine compatibility level
  if (adjustedSafetyScore >= 90) compatibility = 'excellent';
  else if (adjustedSafetyScore >= 75) compatibility = 'good';
  else if (adjustedSafetyScore >= 60) compatibility = 'caution';
  else compatibility = 'avoid';

  // Add concern-specific benefits
  const enhancedBenefits = [...ingredientData.benefits];
  if (userProfile?.concerns) {
    for (const concern of userProfile.concerns) {
      const effectivenessScore = ingredientData.concerns[concern];
      if (effectivenessScore && effectivenessScore >= 80) {
        enhancedBenefits.push(`Highly effective for ${concern}`);
      }
    }
  }

  return {
    name: ingredientName,
    safety_score: adjustedSafetyScore,
    compatibility,
    benefits: enhancedBenefits,
    warnings: ingredientData.warnings,
    alternatives: ingredientData.alternatives
  };
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

    // Limit number of ingredients to prevent abuse
    if (body.ingredients.length > 20) {
      return new Response(
        JSON.stringify({ success: false, error: 'Maximum 20 ingredients allowed per request' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Analyze each ingredient
    const results: IngredientResult[] = body.ingredients.map(ingredient => 
      analyzeIngredient(ingredient, body.userProfile)
    );

    // Calculate overall safety score
    const overallSafety = Math.round(
      results.reduce((sum, result) => sum + result.safety_score, 0) / results.length
    );

    // Generate recommendations
    const recommendations: string[] = [];
    const cautionIngredients = results.filter(r => r.compatibility === 'caution' || r.compatibility === 'avoid');
    const excellentIngredients = results.filter(r => r.compatibility === 'excellent');

    if (cautionIngredients.length > 0) {
      recommendations.push(`Consider patch testing products with: ${cautionIngredients.map(r => r.name).join(', ')}`);
    }

    if (excellentIngredients.length > 0) {
      recommendations.push(`Great ingredients for your skin: ${excellentIngredients.map(r => r.name).join(', ')}`);
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
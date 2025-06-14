import { corsHeaders } from '../_shared/cors.ts';

interface UserProfile {
  age_range: string;
  skin_type: string;
  concerns: string[];
  budget: number;
  product_preference: string;
}

interface ScanResults {
  skin_type: string;
  concerns: string[];
  confidence: number;
}

interface RoutineRequest {
  userProfile: UserProfile;
  scanResults?: ScanResults;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  ingredients: string[];
  benefits: string[];
  skin_types: string[];
  concerns: string[];
  preference_tags: string[];
  step_order: number;
  time_of_day: 'morning' | 'evening' | 'both';
  ai_score?: number;
  confidence?: number;
}

interface RoutineResponse {
  success: boolean;
  morning_routine?: Product[];
  evening_routine?: Product[];
  total_cost?: number;
  confidence_score?: number;
  ai_reasoning?: string;
  error?: string;
}

// Comprehensive Indian skincare product database
const PRODUCT_DATABASE: Product[] = [
  // Cleansers
  {
    id: 'cetaphil-gentle-cleanser',
    name: 'Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'cleanser',
    price: 299,
    ingredients: ['ceramides', 'glycerin'],
    benefits: ['Gentle cleansing', 'Maintains skin barrier'],
    skin_types: ['dry', 'sensitive', 'combination'],
    concerns: ['dryness', 'sensitivity'],
    preference_tags: ['dermatologist-recommended'],
    step_order: 1,
    time_of_day: 'both'
  },
  {
    id: 'plum-green-tea-cleanser',
    name: 'Green Tea Pore Cleansing Face Wash',
    brand: 'Plum',
    category: 'cleanser',
    price: 225,
    ingredients: ['green tea', 'salicylic acid'],
    benefits: ['Deep pore cleansing', 'Oil control'],
    skin_types: ['oily', 'combination'],
    concerns: ['acne', 'large_pores'],
    preference_tags: ['natural', 'ayurvedic'],
    step_order: 1,
    time_of_day: 'both'
  },
  {
    id: 'himalaya-neem-cleanser',
    name: 'Purifying Neem Face Wash',
    brand: 'Himalaya',
    category: 'cleanser',
    price: 140,
    ingredients: ['neem', 'turmeric'],
    benefits: ['Antibacterial', 'Purifies skin'],
    skin_types: ['oily', 'acne-prone'],
    concerns: ['acne', 'blemishes'],
    preference_tags: ['ayurvedic', 'natural'],
    step_order: 1,
    time_of_day: 'both'
  },

  // Toners
  {
    id: 'pixi-glow-tonic',
    name: 'Glow Tonic',
    brand: 'Pixi',
    category: 'toner',
    price: 1800,
    ingredients: ['glycolic acid', 'aloe vera'],
    benefits: ['Gentle exfoliation', 'Brightening'],
    skin_types: ['oily', 'combination', 'normal'],
    concerns: ['dullness', 'uneven_texture'],
    preference_tags: ['premium'],
    step_order: 2,
    time_of_day: 'evening'
  },
  {
    id: 'klairs-supple-toner',
    name: 'Supple Preparation Facial Toner',
    brand: 'Klairs',
    category: 'toner',
    price: 1200,
    ingredients: ['hyaluronic acid', 'beta-glucan'],
    benefits: ['Hydrating', 'Soothing'],
    skin_types: ['dry', 'sensitive', 'combination'],
    concerns: ['dryness', 'sensitivity'],
    preference_tags: ['korean-beauty'],
    step_order: 2,
    time_of_day: 'both'
  },

  // Serums
  {
    id: 'minimalist-niacinamide-serum',
    name: '10% Niacinamide Face Serum',
    brand: 'Minimalist',
    category: 'serum',
    price: 399,
    ingredients: ['niacinamide', 'zinc'],
    benefits: ['Pore minimizing', 'Oil control'],
    skin_types: ['oily', 'combination'],
    concerns: ['large_pores', 'acne'],
    preference_tags: ['science-backed'],
    step_order: 3,
    time_of_day: 'both'
  },
  {
    id: 'ordinary-hyaluronic-serum',
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    category: 'serum',
    price: 590,
    ingredients: ['hyaluronic acid', 'vitamin b5'],
    benefits: ['Intense hydration', 'Plumping'],
    skin_types: ['all'],
    concerns: ['dryness', 'fine_lines'],
    preference_tags: ['affordable'],
    step_order: 3,
    time_of_day: 'both'
  },
  {
    id: 'dot-key-vitamin-c-serum',
    name: 'Vitamin C + E Super Bright Serum',
    brand: 'Dot & Key',
    category: 'serum',
    price: 845,
    ingredients: ['vitamin c', 'vitamin e'],
    benefits: ['Brightening', 'Antioxidant protection'],
    skin_types: ['all'],
    concerns: ['pigmentation', 'dullness'],
    preference_tags: ['brightening'],
    step_order: 3,
    time_of_day: 'morning'
  },

  // Moisturizers
  {
    id: 'neutrogena-oil-free-moisturizer',
    name: 'Oil-Free Moisture Gel',
    brand: 'Neutrogena',
    category: 'moisturizer',
    price: 299,
    ingredients: ['glycerin', 'dimethicone'],
    benefits: ['Lightweight hydration', 'Non-comedogenic'],
    skin_types: ['oily', 'combination'],
    concerns: ['oiliness'],
    preference_tags: ['dermatologist-recommended'],
    step_order: 4,
    time_of_day: 'both'
  },
  {
    id: 'cetaphil-daily-moisturizer',
    name: 'Daily Facial Moisturizer',
    brand: 'Cetaphil',
    category: 'moisturizer',
    price: 450,
    ingredients: ['ceramides', 'hyaluronic acid'],
    benefits: ['24-hour hydration', 'Barrier repair'],
    skin_types: ['dry', 'sensitive'],
    concerns: ['dryness', 'sensitivity'],
    preference_tags: ['gentle'],
    step_order: 4,
    time_of_day: 'both'
  },
  {
    id: 'lakme-peach-moisturizer',
    name: 'Peach Milk Moisturizer',
    brand: 'Lakme',
    category: 'moisturizer',
    price: 175,
    ingredients: ['peach extract', 'milk proteins'],
    benefits: ['Soft skin', 'Light fragrance'],
    skin_types: ['normal', 'dry'],
    concerns: ['dryness'],
    preference_tags: ['affordable', 'indian-brand'],
    step_order: 4,
    time_of_day: 'both'
  },

  // Sunscreens
  {
    id: 'neutrogena-ultra-sheer-spf50',
    name: 'Ultra Sheer Dry Touch Sunscreen SPF 50+',
    brand: 'Neutrogena',
    category: 'sunscreen',
    price: 499,
    ingredients: ['zinc oxide', 'octinoxate'],
    benefits: ['Broad spectrum protection', 'Non-greasy'],
    skin_types: ['all'],
    concerns: ['sun_protection'],
    preference_tags: ['high-spf'],
    step_order: 5,
    time_of_day: 'morning'
  },
  {
    id: 'lotus-safe-sun-spf40',
    name: 'Safe Sun UV Screen Matte Gel SPF 40',
    brand: 'Lotus',
    category: 'sunscreen',
    price: 220,
    ingredients: ['titanium dioxide', 'zinc oxide'],
    benefits: ['Matte finish', 'Sweat resistant'],
    skin_types: ['oily', 'combination'],
    concerns: ['sun_protection', 'oiliness'],
    preference_tags: ['indian-brand', 'affordable'],
    step_order: 5,
    time_of_day: 'morning'
  },

  // Night treatments
  {
    id: 'olay-regenerist-night-cream',
    name: 'Regenerist Night Recovery Cream',
    brand: 'Olay',
    category: 'night_treatment',
    price: 899,
    ingredients: ['peptides', 'niacinamide'],
    benefits: ['Anti-aging', 'Skin renewal'],
    skin_types: ['all'],
    concerns: ['fine_lines', 'dullness'],
    preference_tags: ['anti-aging'],
    step_order: 4,
    time_of_day: 'evening'
  },
  {
    id: 'biotique-night-cream',
    name: 'Bio Dandelion Visibly Ageless Lightening Cream',
    brand: 'Biotique',
    category: 'night_treatment',
    price: 340,
    ingredients: ['dandelion', 'sunflower oil'],
    benefits: ['Lightening', 'Nourishing'],
    skin_types: ['all'],
    concerns: ['pigmentation', 'dullness'],
    preference_tags: ['ayurvedic', 'natural'],
    step_order: 4,
    time_of_day: 'evening'
  }
];

function calculateProductScore(
  product: Product,
  userProfile: UserProfile,
  scanResults?: ScanResults
): number {
  let score = 50; // Base score

  // Skin type compatibility (30% weight)
  const skinType = scanResults?.skin_type || userProfile.skin_type;
  if (product.skin_types.includes(skinType) || product.skin_types.includes('all')) {
    score += 30;
  }

  // Concern targeting (25% weight)
  const allConcerns = [...userProfile.concerns, ...(scanResults?.concerns || [])];
  const concernMatches = product.concerns.filter(concern => allConcerns.includes(concern)).length;
  score += (concernMatches / Math.max(allConcerns.length, 1)) * 25;

  // Budget compatibility (20% weight)
  if (product.price <= userProfile.budget * 0.3) { // Each product should be max 30% of budget
    score += 20;
  } else if (product.price <= userProfile.budget * 0.5) {
    score += 10;
  }

  // Preference alignment (15% weight)
  const preferenceMatch = product.preference_tags.some(tag => {
    switch (userProfile.product_preference) {
      case 'ayurvedic': return ['ayurvedic', 'natural'].includes(tag);
      case 'natural': return ['natural', 'ayurvedic'].includes(tag);
      case 'no_preference': return true;
      default: return true;
    }
  });
  if (preferenceMatch) score += 15;

  // Age appropriateness (10% weight)
  const ageBonus = userProfile.age_range === '31-35' && 
    product.benefits.some(benefit => benefit.includes('anti-aging')) ? 10 : 5;
  score += ageBonus;

  return Math.min(100, Math.max(0, score));
}

function generateRoutine(
  userProfile: UserProfile,
  scanResults?: ScanResults
): { morning: Product[]; evening: Product[]; totalCost: number; confidence: number } {
  // Score all products
  const scoredProducts = PRODUCT_DATABASE.map(product => ({
    ...product,
    ai_score: calculateProductScore(product, userProfile, scanResults)
  }));

  // Select best products for each category and time
  const categories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'night_treatment'];
  
  const morningRoutine: Product[] = [];
  const eveningRoutine: Product[] = [];
  let totalCost = 0;

  for (const category of categories) {
    const categoryProducts = scoredProducts
      .filter(p => p.category === category)
      .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));

    // Morning routine
    if (category !== 'night_treatment') {
      const morningProduct = categoryProducts.find(p => 
        p.time_of_day === 'morning' || p.time_of_day === 'both'
      );
      if (morningProduct && totalCost + morningProduct.price <= userProfile.budget) {
        morningRoutine.push(morningProduct);
        totalCost += morningProduct.price;
      }
    }

    // Evening routine
    if (category !== 'sunscreen') {
      let eveningProduct;
      if (category === 'moisturizer') {
        // Try night treatment first, then regular moisturizer
        eveningProduct = categoryProducts.find(p => p.category === 'night_treatment') ||
                        categoryProducts.find(p => p.time_of_day === 'evening' || p.time_of_day === 'both');
      } else {
        eveningProduct = categoryProducts.find(p => 
          p.time_of_day === 'evening' || p.time_of_day === 'both'
        );
      }
      
      if (eveningProduct && 
          !morningRoutine.includes(eveningProduct) && 
          totalCost + eveningProduct.price <= userProfile.budget) {
        eveningRoutine.push(eveningProduct);
        totalCost += eveningProduct.price;
      }
    }
  }

  // Sort by step order
  morningRoutine.sort((a, b) => a.step_order - b.step_order);
  eveningRoutine.sort((a, b) => a.step_order - b.step_order);

  // Calculate confidence based on scan results and product scores
  let confidence = 75; // Base confidence
  if (scanResults && scanResults.confidence > 80) {
    confidence += 15;
  }
  
  const avgProductScore = [...morningRoutine, ...eveningRoutine]
    .reduce((sum, p) => sum + (p.ai_score || 0), 0) / 
    (morningRoutine.length + eveningRoutine.length);
  
  confidence = Math.round(confidence + (avgProductScore - 70) * 0.2);
  confidence = Math.min(98, Math.max(60, confidence));

  return {
    morning: morningRoutine,
    evening: eveningRoutine,
    totalCost,
    confidence
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
    const requiredFields = ['age_range', 'skin_type', 'concerns', 'budget', 'product_preference'];
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

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    // Generate routine
    const routine = generateRoutine(userProfile, scanResults);

    // Generate AI reasoning
    const reasoning = `Based on your ${userProfile.skin_type} skin type and concerns about ${userProfile.concerns.join(', ')}, I've selected products that target these specific issues while staying within your ₹${userProfile.budget} budget. ${scanResults ? `The face scan analysis (${scanResults.confidence}% confidence) helped refine these recommendations.` : ''} This routine focuses on ${userProfile.product_preference === 'ayurvedic' ? 'natural and Ayurvedic ingredients' : userProfile.product_preference === 'natural' ? 'natural formulations' : 'scientifically-proven ingredients'}.`;

    const response: RoutineResponse = {
      success: true,
      morning_routine: routine.morning,
      evening_routine: routine.evening,
      total_cost: routine.totalCost,
      confidence_score: routine.confidence,
      ai_reasoning: reasoning
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
import { openai } from '../utils/openaiClient';
import type { FaceScanAnalysis, IngredientAnalysis, RoutineRecommendation } from '../utils/openaiClient';

export class OpenAIService {
  /**
   * Analyze face scan image using OpenAI Vision API
   */
  static async analyzeFaceScan(
    imageBase64: string,
    userProfile: {
      skinType: string;
      concerns: string[];
      ageRange: string;
    }
  ): Promise<FaceScanAnalysis> {
    try {
      const prompt = `
You are an expert dermatologist and skincare specialist. Analyze this facial image and provide a detailed skin analysis.

User Profile Context:
- Self-reported skin type: ${userProfile.skinType}
- Self-reported concerns: ${userProfile.concerns.join(', ')}
- Age range: ${userProfile.ageRange}

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

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const analysis = JSON.parse(content) as FaceScanAnalysis;
      
      // Validate and sanitize the response
      return {
        skinType: analysis.skinType || userProfile.skinType,
        concerns: Array.isArray(analysis.concerns) ? analysis.concerns : userProfile.concerns,
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

    } catch (error) {
      console.error('OpenAI Face Scan Analysis Error:', error);
      
      // Fallback analysis if OpenAI fails
      return {
        skinType: userProfile.skinType,
        concerns: userProfile.concerns,
        confidence: 60,
        recommendations: [
          'Continue with your current skincare routine',
          'Consider consulting a dermatologist for personalized advice',
          'Use products suitable for your skin type'
        ],
        analysis: {
          oiliness: 50,
          dryness: 30,
          acne_severity: 20,
          pigmentation: 25,
          texture_score: 70
        }
      };
    }
  }

  /**
   * Analyze ingredients using OpenAI
   */
  static async analyzeIngredients(
    ingredients: string[],
    userProfile: {
      skinType: string;
      concerns: string[];
    }
  ): Promise<IngredientAnalysis[]> {
    try {
      const prompt = `
You are a cosmetic chemist and dermatologist. Analyze these skincare ingredients for safety and compatibility.

Ingredients to analyze: ${ingredients.join(', ')}

User Profile:
- Skin type: ${userProfile.skinType}
- Concerns: ${userProfile.concerns.join(', ')}

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

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert cosmetic chemist and dermatologist specializing in ingredient analysis for Indian skin types and climate conditions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(content) as IngredientAnalysis[];
      
      // Validate and sanitize the response
      return analysis.map(item => ({
        ingredient: item.ingredient || 'Unknown',
        safety_score: Math.min(100, Math.max(0, item.safety_score || 70)),
        compatibility: ['excellent', 'good', 'caution', 'avoid'].includes(item.compatibility) 
          ? item.compatibility 
          : 'good',
        benefits: Array.isArray(item.benefits) ? item.benefits : ['General skincare benefits'],
        warnings: Array.isArray(item.warnings) ? item.warnings : ['Patch test recommended'],
        alternatives: Array.isArray(item.alternatives) ? item.alternatives : []
      }));

    } catch (error) {
      console.error('OpenAI Ingredient Analysis Error:', error);
      
      // Fallback analysis
      return ingredients.map(ingredient => ({
        ingredient,
        safety_score: 75,
        compatibility: 'good' as const,
        benefits: ['General skincare benefits'],
        warnings: ['Patch test recommended before first use'],
        alternatives: []
      }));
    }
  }

  /**
   * Generate personalized routine using OpenAI
   */
  static async generateRoutine(
    userProfile: {
      ageRange: string;
      skinType: string;
      concerns: string[];
      budget: number;
      productPreference: string;
    },
    scanResults?: {
      skinType: string;
      concerns: string[];
      confidence: number;
    }
  ): Promise<RoutineRecommendation> {
    try {
      const effectiveSkinType = scanResults?.skinType || userProfile.skinType;
      const effectiveConcerns = scanResults?.concerns || userProfile.concerns;

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

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert skincare consultant with deep knowledge of Indian skincare brands, climate considerations, and budget-conscious recommendations for Indian women aged 18-45."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const routine = JSON.parse(content) as RoutineRecommendation;
      
      // Validate and sanitize the response
      return {
        morning: Array.isArray(routine.morning) ? routine.morning : [],
        evening: Array.isArray(routine.evening) ? routine.evening : [],
        totalCost: Math.max(0, routine.totalCost || 0),
        confidence: Math.min(100, Math.max(0, routine.confidence || 75)),
        reasoning: routine.reasoning || 'Personalized routine based on your skin type and concerns'
      };

    } catch (error) {
      console.error('OpenAI Routine Generation Error:', error);
      
      // Fallback routine
      return {
        morning: [
          {
            step: "1. Cleanser",
            product: "Gentle Face Wash",
            brand: "Cetaphil",
            price: 299,
            reasoning: "Gentle cleansing for daily use"
          },
          {
            step: "2. Moisturizer",
            product: "Daily Moisturizer",
            brand: "Neutrogena",
            price: 299,
            reasoning: "Lightweight hydration"
          },
          {
            step: "3. Sunscreen",
            product: "Sunscreen SPF 30",
            brand: "Lotus",
            price: 220,
            reasoning: "Essential sun protection"
          }
        ],
        evening: [
          {
            step: "1. Cleanser",
            product: "Gentle Face Wash",
            brand: "Cetaphil",
            price: 299,
            reasoning: "Remove daily impurities"
          },
          {
            step: "2. Moisturizer",
            product: "Night Cream",
            brand: "Olay",
            price: 450,
            reasoning: "Overnight skin repair"
          }
        ],
        totalCost: 1267,
        confidence: 70,
        reasoning: "Basic routine suitable for most skin types within budget"
      };
    }
  }
}
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
});

export { openai };

// Types for OpenAI responses
export interface FaceScanAnalysis {
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
}

export interface IngredientAnalysis {
  ingredient: string;
  safety_score: number;
  compatibility: 'excellent' | 'good' | 'caution' | 'avoid';
  benefits: string[];
  warnings: string[];
  alternatives?: string[];
}

export interface RoutineRecommendation {
  morning: Array<{
    step: string;
    product: string;
    brand: string;
    price: number;
    reasoning: string;
  }>;
  evening: Array<{
    step: string;
    product: string;
    brand: string;
    price: number;
    reasoning: string;
  }>;
  totalCost: number;
  confidence: number;
  reasoning: string;
}
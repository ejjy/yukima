export interface UserProfile {
  ageRange: '18-24' | '25-30' | '31-35' | '36-40' | '41-45';
  skinType: 'Oily' | 'Dry' | 'Combo' | 'Sensitive' | 'Normal' | 'Acne-prone' | 'Mature';
  concerns: string[];
  budget: 299 | 499 | 999 | 1499;
  productPreference: 'Ayurvedic' | 'Natural' | 'Premium' | 'Doesn\'t Matter';
  language: 'English' | 'Hindi';
  consent: boolean;
}

export interface Product {
  id: string;
  name: string;
  step: string;
  skinType: string[];
  concernTags: string[];
  price: number;
  budgetTier: number;
  regionalRelevance: 'High' | 'Medium' | 'Low';
  brand: string;
  category: string;
  description?: string;
  ageGroup?: string[]; // New field for age-specific products
  premiumTier?: boolean; // New field for premium products
}

export interface RoutineStep {
  step: string;
  product: Product;
  completed: boolean;
}

export interface Routine {
  morning: RoutineStep[];
  evening: RoutineStep[];
  totalCost: number;
}

export interface Dupe {
  id: string;
  originalProduct: string;
  dupeName: string;
  originalPrice: number;
  dupePrice: number;
  savings: number;
  reason: string;
  brand: string;
  category: string;
}

export interface IngredientAlert {
  id: string;
  ingredient: string;
  risk: string;
  avoidFor: string[];
  description: string;
  alternatives: string[];
}

export interface ScanResult {
  skinType: string;
  concerns: string[];
  confidence: number;
  recommendations: string[];
  timestamp: Date;
  ageEstimate?: string; // New field for age-based recommendations
}
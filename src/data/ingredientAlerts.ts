// This file now serves as a fallback and exports service functions
// The actual data is stored in Supabase and accessed via IngredientService

export { 
  IngredientService, 
  getAlertsForSkinType, 
  getAlertsForConcerns, 
  searchIngredients 
} from '../services/ingredientService';

// Keep the IngredientAlert interface export for backward compatibility
export type { IngredientAlert } from '../types';

// Fallback ingredient alerts for offline mode or development
export const ingredientAlerts = [
  {
    id: '1',
    ingredient: 'Fragrance/Parfum',
    risk: 'Skin Irritation & Allergic Reactions',
    avoidFor: ['Sensitive', 'Eczema-prone'],
    description: 'Synthetic fragrances can cause contact dermatitis, redness, and irritation, especially in sensitive skin types.',
    alternatives: ['Fragrance-free products', 'Essential oil-based natural scents', 'Unscented formulations']
  },
  {
    id: '2',
    ingredient: 'Sodium Lauryl Sulfate (SLS)',
    risk: 'Dryness & Barrier Disruption',
    avoidFor: ['Dry', 'Sensitive', 'Eczema-prone'],
    description: 'Harsh surfactant that strips natural oils, leading to dryness, irritation, and compromised skin barrier.',
    alternatives: ['Sodium Laureth Sulfate (SLES)', 'Cocamidopropyl Betaine', 'Decyl Glucoside']
  }
];
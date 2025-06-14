// This file now serves as a fallback and exports service functions
// The actual data is stored in Supabase and accessed via DupeService

export { DupeService, findDupes, getDupesByCategory, getBestSavings } from '../services/dupeService';

// Keep the Dupe interface export for backward compatibility
export type { Dupe } from '../types';

// Fallback dupes for offline mode or development
export const dupes = [
  {
    id: '1',
    originalProduct: 'Dot & Key Vitamin C+E Face Serum',
    dupeName: 'The Derma Co 2% Vitamin C Serum',
    originalPrice: 595,
    dupePrice: 349,
    savings: 246,
    reason: 'Similar vitamin C concentration, gentler for sensitive skin',
    brand: 'The Derma Co',
    category: 'Serum'
  },
  {
    id: '2',
    originalProduct: 'Olay Regenerist Micro-Sculpting Serum',
    dupeName: 'Minimalist 10% Niacinamide Serum',
    originalPrice: 899,
    dupePrice: 349,
    savings: 550,
    reason: 'Better for oily skin, targets same concerns at lower cost',
    brand: 'Minimalist',
    category: 'Serum'
  }
];
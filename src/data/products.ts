// This file now serves as a fallback and exports service functions
// The actual data is stored in Supabase and accessed via ProductService

export { ProductService, getRecommendedProducts } from '../services/productService';

// Keep the Product interface export for backward compatibility
export type { Product } from '../types';

// Fallback products for offline mode or development - updated with new skin types
export const products = [
  {
    id: '1',
    name: 'Himalaya Neem Face Wash',
    step: 'Cleanser',
    skinType: ['Oily', 'Combo', 'Acne-prone'],
    concernTags: ['Acne', 'Oiliness'],
    price: 89,
    budgetTier: 299,
    regionalRelevance: 'High' as const,
    brand: 'Himalaya',
    category: 'Cleanser',
    description: 'Purifying neem face wash for acne-prone skin'
  },
  {
    id: '2',
    name: 'Minimalist 10% Niacinamide Serum',
    step: 'Serum',
    skinType: ['Oily', 'Combo', 'Acne-prone'],
    concernTags: ['Acne', 'Large Pores', 'Oiliness'],
    price: 349,
    budgetTier: 499,
    regionalRelevance: 'High' as const,
    brand: 'Minimalist',
    category: 'Serum',
    description: 'High-strength niacinamide for oil control'
  },
  {
    id: '3',
    name: 'Cetaphil Gentle Skin Cleanser',
    step: 'Cleanser',
    skinType: ['Sensitive', 'Dry', 'Normal'],
    concernTags: ['Sensitivity', 'Dryness'],
    price: 299,
    budgetTier: 499,
    regionalRelevance: 'Medium' as const,
    brand: 'Cetaphil',
    category: 'Cleanser',
    description: 'Dermatologist recommended gentle cleanser'
  },
  {
    id: '4',
    name: 'Olay Regenerist Micro-Sculpting Serum',
    step: 'Serum',
    skinType: ['Mature', 'Normal', 'Dry'],
    concernTags: ['Fine Lines', 'Aging', 'Firmness'],
    price: 899,
    budgetTier: 999,
    regionalRelevance: 'Medium' as const,
    brand: 'Olay',
    category: 'Serum',
    description: 'Anti-aging serum with amino-peptides'
  },
  {
    id: '5',
    name: 'The Ordinary Hyaluronic Acid 2% + B5',
    step: 'Serum',
    skinType: ['All', 'Dry', 'Normal', 'Mature'],
    concernTags: ['Dryness', 'Fine Lines', 'Hydration'],
    price: 590,
    budgetTier: 999,
    regionalRelevance: 'Medium' as const,
    brand: 'The Ordinary',
    category: 'Serum',
    description: 'Intense hydration with hyaluronic acid'
  }
];
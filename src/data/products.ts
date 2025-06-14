// This file now serves as a fallback and exports service functions
// The actual data is stored in Supabase and accessed via ProductService

export { ProductService, getRecommendedProducts } from '../services/productService';

// Keep the Product interface export for backward compatibility
export type { Product } from '../types';

// Fallback products for offline mode or development
export const products = [
  {
    id: '1',
    name: 'Himalaya Neem Face Wash',
    step: 'Cleanser',
    skinType: ['Oily', 'Combo'],
    concernTags: ['Acne', 'Oiliness'],
    price: 89,
    budgetTier: 299,
    regionalRelevance: 'High' as const,
    brand: 'Himalaya',
    category: 'Cleanser',
    description: 'Purifying neem face wash for acne-prone skin'
  },
  // Add a few more fallback products for development
  {
    id: '2',
    name: 'Minimalist 10% Niacinamide Serum',
    step: 'Serum',
    skinType: ['Oily', 'Combo'],
    concernTags: ['Acne', 'Large Pores', 'Oiliness'],
    price: 349,
    budgetTier: 499,
    regionalRelevance: 'High' as const,
    brand: 'Minimalist',
    category: 'Serum',
    description: 'High-strength niacinamide for oil control'
  }
];
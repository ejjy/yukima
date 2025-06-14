import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

export interface ProductFilters {
  skinType?: string;
  concerns?: string[];
  budget?: number;
  productPreference?: string;
  category?: string;
  step?: string;
  ageRange?: string;
}

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    return data || [];
  }

  static async getRecommendedProducts(filters: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*');

    // Apply skin type filter with expanded compatibility
    if (filters.skinType) {
      const skinTypeCompatibility = this.getSkinTypeCompatibility(filters.skinType);
      query = query.overlaps('skin_type', skinTypeCompatibility);
    }

    if (filters.concerns && filters.concerns.length > 0) {
      query = query.overlaps('concern_tags', filters.concerns);
    }

    if (filters.budget) {
      query = query.lte('budget_tier', filters.budget);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.step) {
      query = query.eq('step', filters.step);
    }

    // Apply product preference filter with enhanced premium support
    if (filters.productPreference && filters.productPreference !== "Doesn't Matter") {
      if (filters.productPreference === 'Ayurvedic') {
        query = query.in('brand', ['Himalaya', 'Biotique', 'Forest Essentials', 'Kama Ayurveda', 'Khadi Natural']);
      } else if (filters.productPreference === 'Natural') {
        query = query.in('brand', ['Mamaearth', 'Plum', 'WOW Skin Science', 'Bella Vita Organic', 'Good Vibes']);
      } else if (filters.productPreference === 'Premium') {
        query = query.in('brand', ['SK-II', 'La Mer', 'Estee Lauder', 'Clinique', 'Shiseido', 'Olay', 'L\'Oreal']);
      }
    }

    // Age-based filtering for enhanced recommendations
    if (filters.ageRange) {
      const ageCompatibility = this.getAgeCompatibility(filters.ageRange);
      if (ageCompatibility.length > 0) {
        query = query.overlaps('age_group', ageCompatibility);
      }
    }

    const { data, error } = await query.order('regional_relevance', { ascending: false });

    if (error) {
      console.error('Error fetching recommended products:', error);
      throw new Error('Failed to fetch recommended products');
    }

    // Post-process for age-specific recommendations
    let products = data || [];
    
    if (filters.ageRange) {
      products = this.enhanceAgeSpecificRecommendations(products, filters.ageRange);
    }

    return products;
  }

  // Enhanced skin type compatibility for broader age range
  private static getSkinTypeCompatibility(skinType: string): string[] {
    const compatibilityMap: { [key: string]: string[] } = {
      'Oily': ['Oily', 'Combo'],
      'Dry': ['Dry', 'Sensitive', 'Mature'],
      'Combo': ['Combo', 'Oily', 'Normal'],
      'Sensitive': ['Sensitive', 'Dry'],
      'Normal': ['Normal', 'All', 'Combo'],
      'Acne-prone': ['Oily', 'Combo', 'Acne-prone'],
      'Mature': ['Dry', 'Normal', 'Mature', 'All']
    };

    return compatibilityMap[skinType] || [skinType, 'All'];
  }

  // New method for age-based compatibility
  private static getAgeCompatibility(ageRange: string): string[] {
    const ageMap: { [key: string]: string[] } = {
      '18-24': ['Young Adult', 'Prevention', 'All Ages'],
      '25-30': ['Young Adult', 'Early Anti-Aging', 'All Ages'],
      '31-35': ['Adult', 'Anti-Aging', 'All Ages'],
      '36-40': ['Mature Adult', 'Intensive Anti-Aging', 'All Ages'],
      '41-45': ['Mature', 'Premium Anti-Aging', 'All Ages']
    };

    return ageMap[ageRange] || ['All Ages'];
  }

  // Enhanced age-specific product recommendations
  private static enhanceAgeSpecificRecommendations(products: Product[], ageRange: string): Product[] {
    const agePreferences: { [key: string]: any } = {
      '18-24': {
        priorityIngredients: ['niacinamide', 'salicylic acid', 'hyaluronic acid'],
        avoidIngredients: ['retinol', 'glycolic acid'],
        maxBudget: 999,
        focusAreas: ['prevention', 'acne control', 'hydration']
      },
      '25-30': {
        priorityIngredients: ['vitamin c', 'niacinamide', 'peptides', 'mild retinol'],
        avoidIngredients: ['harsh acids'],
        maxBudget: 1499,
        focusAreas: ['early anti-aging', 'brightening', 'prevention']
      },
      '31-35': {
        priorityIngredients: ['retinol', 'peptides', 'vitamin c', 'hyaluronic acid'],
        avoidIngredients: [],
        maxBudget: 1499,
        focusAreas: ['anti-aging', 'firmness', 'hydration']
      },
      '36-40': {
        priorityIngredients: ['retinol', 'peptides', 'ceramides', 'antioxidants'],
        avoidIngredients: [],
        maxBudget: 1499,
        focusAreas: ['intensive anti-aging', 'repair', 'firmness']
      },
      '41-45': {
        priorityIngredients: ['retinol', 'peptides', 'growth factors', 'ceramides'],
        avoidIngredients: [],
        maxBudget: 1499,
        focusAreas: ['premium anti-aging', 'renewal', 'luxury care']
      }
    };

    const preferences = agePreferences[ageRange];
    if (!preferences) return products;

    // Sort products based on age-specific preferences
    return products.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Boost score for age-appropriate ingredients
      preferences.priorityIngredients.forEach((ingredient: string) => {
        if (a.description?.toLowerCase().includes(ingredient)) scoreA += 10;
        if (b.description?.toLowerCase().includes(ingredient)) scoreB += 10;
      });

      // Penalize for ingredients to avoid
      preferences.avoidIngredients.forEach((ingredient: string) => {
        if (a.description?.toLowerCase().includes(ingredient)) scoreA -= 5;
        if (b.description?.toLowerCase().includes(ingredient)) scoreB -= 5;
      });

      // Boost premium products for older age groups
      if (ageRange === '36-40' || ageRange === '41-45') {
        if (a.price > 800) scoreA += 5;
        if (b.price > 800) scoreB += 5;
      }

      return scoreB - scoreA;
    });
  }

  static async getProductsByStep(step: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('step', step)
      .order('price');

    if (error) {
      console.error('Error fetching products by step:', error);
      throw new Error('Failed to fetch products by step');
    }

    return data || [];
  }

  static async getProductsByBrand(brand: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand', brand)
      .order('name');

    if (error) {
      console.error('Error fetching products by brand:', error);
      throw new Error('Failed to fetch products by brand');
    }

    return data || [];
  }

  static async searchProducts(searchTerm: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('name');

    if (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }

    return data || [];
  }

  // New method for premium product recommendations
  static async getPremiumProducts(filters: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .gte('price', 800); // Premium price threshold

    if (filters.skinType) {
      const skinTypeCompatibility = this.getSkinTypeCompatibility(filters.skinType);
      query = query.overlaps('skin_type', skinTypeCompatibility);
    }

    if (filters.concerns && filters.concerns.length > 0) {
      query = query.overlaps('concern_tags', filters.concerns);
    }

    const { data, error } = await query
      .order('price', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching premium products:', error);
      throw new Error('Failed to fetch premium products');
    }

    return data || [];
  }
}

// Legacy function for backward compatibility
export const getRecommendedProducts = (
  skinType: string,
  concerns: string[],
  budget: number,
  productPreference: string,
  ageRange?: string
): Promise<Product[]> => {
  return ProductService.getRecommendedProducts({
    skinType,
    concerns,
    budget,
    productPreference,
    ageRange
  });
};
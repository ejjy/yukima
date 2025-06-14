import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

export interface ProductFilters {
  skinType?: string;
  concerns?: string[];
  budget?: number;
  productPreference?: string;
  category?: string;
  step?: string;
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

    // Apply product preference filter
    if (filters.productPreference && filters.productPreference !== "Doesn't Matter") {
      if (filters.productPreference === 'Ayurvedic') {
        query = query.in('brand', ['Himalaya', 'Biotique', 'Forest Essentials', 'Kama Ayurveda', 'Khadi Natural']);
      } else if (filters.productPreference === 'Natural') {
        query = query.in('brand', ['Mamaearth', 'Plum', 'WOW Skin Science', 'Bella Vita Organic', 'Good Vibes']);
      }
    }

    const { data, error } = await query.order('regional_relevance', { ascending: false });

    if (error) {
      console.error('Error fetching recommended products:', error);
      throw new Error('Failed to fetch recommended products');
    }

    return data || [];
  }

  // Map new skin types to compatible existing product categories
  private static getSkinTypeCompatibility(skinType: string): string[] {
    const compatibilityMap: { [key: string]: string[] } = {
      'Oily': ['Oily', 'Combo'],
      'Dry': ['Dry', 'Sensitive'],
      'Combo': ['Combo', 'Oily', 'Normal'],
      'Sensitive': ['Sensitive', 'Dry'],
      'Normal': ['Normal', 'All', 'Combo'],
      'Acne-prone': ['Oily', 'Combo', 'Acne-prone'],
      'Mature': ['Dry', 'Normal', 'Mature', 'All']
    };

    return compatibilityMap[skinType] || [skinType, 'All'];
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
}

// Legacy function for backward compatibility
export const getRecommendedProducts = (
  skinType: string,
  concerns: string[],
  budget: number,
  productPreference: string
): Promise<Product[]> => {
  return ProductService.getRecommendedProducts({
    skinType,
    concerns,
    budget,
    productPreference
  });
};
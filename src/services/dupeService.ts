import { supabase } from '../utils/supabaseClient';
import { Dupe } from '../types';

export class DupeService {
  static async getAllDupes(): Promise<Dupe[]> {
    const { data, error } = await supabase
      .from('dupes')
      .select('*')
      .order('savings', { ascending: false });

    if (error) {
      console.error('Error fetching dupes:', error);
      throw new Error('Failed to fetch dupes');
    }

    return data || [];
  }

  static async findDupes(productName: string, category?: string): Promise<Dupe[]> {
    let query = supabase
      .from('dupes')
      .select('*');

    // Search in original product name or dupe name
    query = query.or(`original_product.ilike.%${productName}%,dupe_name.ilike.%${productName}%`);

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('savings', { ascending: false });

    if (error) {
      console.error('Error finding dupes:', error);
      throw new Error('Failed to find dupes');
    }

    return data || [];
  }

  static async getDupesByCategory(category: string): Promise<Dupe[]> {
    const { data, error } = await supabase
      .from('dupes')
      .select('*')
      .eq('category', category)
      .order('savings', { ascending: false });

    if (error) {
      console.error('Error fetching dupes by category:', error);
      throw new Error('Failed to fetch dupes by category');
    }

    return data || [];
  }

  static async getBestSavings(limit: number = 10): Promise<Dupe[]> {
    const { data, error } = await supabase
      .from('dupes')
      .select('*')
      .gt('savings', 0)
      .order('savings', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching best savings:', error);
      throw new Error('Failed to fetch best savings');
    }

    return data || [];
  }

  static async searchDupes(searchTerm: string): Promise<Dupe[]> {
    const { data, error } = await supabase
      .from('dupes')
      .select('*')
      .or(`original_product.ilike.%${searchTerm}%,dupe_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
      .order('savings', { ascending: false });

    if (error) {
      console.error('Error searching dupes:', error);
      throw new Error('Failed to search dupes');
    }

    return data || [];
  }
}

// Legacy functions for backward compatibility
export const findDupes = (productName: string, category?: string): Promise<Dupe[]> => {
  return DupeService.findDupes(productName, category);
};

export const getDupesByCategory = (category: string): Promise<Dupe[]> => {
  return DupeService.getDupesByCategory(category);
};

export const getBestSavings = (): Promise<Dupe[]> => {
  return DupeService.getBestSavings();
};
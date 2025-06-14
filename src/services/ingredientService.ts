import { supabase } from '../utils/supabaseClient';
import { IngredientAlert } from '../types';

export class IngredientService {
  static async getAllIngredientAlerts(): Promise<IngredientAlert[]> {
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .select('*')
      .order('ingredient_name');

    if (error) {
      console.error('Error fetching ingredient alerts:', error);
      throw new Error('Failed to fetch ingredient alerts');
    }

    // Map database format to IngredientAlert interface
    return (data || []).map(item => ({
      id: item.id,
      ingredient: item.ingredient_name,
      risk: item.risk || 'Unknown risk',
      avoidFor: item.avoid_for || [],
      description: item.description || 'No description available',
      alternatives: item.alternatives || []
    }));
  }

  static async getAlertsForSkinType(skinType: string): Promise<IngredientAlert[]> {
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .select('*')
      .contains('avoid_for', [skinType]);

    if (error) {
      console.error('Error fetching alerts for skin type:', error);
      throw new Error('Failed to fetch alerts for skin type');
    }

    return (data || []).map(item => ({
      id: item.id,
      ingredient: item.ingredient_name,
      risk: item.risk || 'Unknown risk',
      avoidFor: item.avoid_for || [],
      description: item.description || 'No description available',
      alternatives: item.alternatives || []
    }));
  }

  static async getAlertsForConcerns(concerns: string[]): Promise<IngredientAlert[]> {
    // Map concerns to skin conditions that might be in avoid_for
    const concernMap: { [key: string]: string[] } = {
      'Acne': ['Acne-prone', 'Oily'],
      'Dryness': ['Dry'],
      'Sensitivity': ['Sensitive'],
      'Fine Lines': ['Mature'],
      'Pigmentation': ['Dark skin tones']
    };

    const relevantConditions = concerns.flatMap(concern => concernMap[concern] || []);
    
    if (relevantConditions.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .select('*')
      .overlaps('avoid_for', relevantConditions);

    if (error) {
      console.error('Error fetching alerts for concerns:', error);
      throw new Error('Failed to fetch alerts for concerns');
    }

    return (data || []).map(item => ({
      id: item.id,
      ingredient: item.ingredient_name,
      risk: item.risk || 'Unknown risk',
      avoidFor: item.avoid_for || [],
      description: item.description || 'No description available',
      alternatives: item.alternatives || []
    }));
  }

  static async searchIngredients(searchTerm: string): Promise<IngredientAlert[]> {
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .select('*')
      .or(`ingredient_name.ilike.%${searchTerm}%,risk.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('ingredient_name');

    if (error) {
      console.error('Error searching ingredients:', error);
      throw new Error('Failed to search ingredients');
    }

    return (data || []).map(item => ({
      id: item.id,
      ingredient: item.ingredient_name,
      risk: item.risk || 'Unknown risk',
      avoidFor: item.avoid_for || [],
      description: item.description || 'No description available',
      alternatives: item.alternatives || []
    }));
  }

  static async getIngredientByName(ingredientName: string): Promise<IngredientAlert | null> {
    const { data, error } = await supabase
      .from('ingredient_analysis_cache')
      .select('*')
      .eq('ingredient_name', ingredientName.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching ingredient by name:', error);
      throw new Error('Failed to fetch ingredient');
    }

    return {
      id: data.id,
      ingredient: data.ingredient_name,
      risk: data.risk || 'Unknown risk',
      avoidFor: data.avoid_for || [],
      description: data.description || 'No description available',
      alternatives: data.alternatives || []
    };
  }
}

// Legacy functions for backward compatibility
export const getAlertsForSkinType = (skinType: string): Promise<IngredientAlert[]> => {
  return IngredientService.getAlertsForSkinType(skinType);
};

export const getAlertsForConcerns = (concerns: string[]): Promise<IngredientAlert[]> => {
  return IngredientService.getAlertsForConcerns(concerns);
};

export const searchIngredients = (searchTerm: string): Promise<IngredientAlert[]> => {
  return IngredientService.searchIngredients(searchTerm);
};
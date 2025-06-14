import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error(`
    Supabase configuration error:
    
    Please update your .env file with your actual Supabase credentials:
    - VITE_SUPABASE_URL should be your Supabase project URL (e.g., https://your-project-id.supabase.co)
    - VITE_SUPABASE_ANON_KEY should be your Supabase anonymous key
    
    You can find these values in your Supabase project dashboard under Settings > API.
    
    Current values:
    - VITE_SUPABASE_URL: ${supabaseUrl}
    - VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '[SET]' : '[NOT SET]'}
  `);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`
    Invalid Supabase URL format: ${supabaseUrl}
    
    The URL should be in the format: https://your-project-id.supabase.co
    Please check your VITE_SUPABASE_URL in the .env file.
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          age_range: string;
          skin_type: string;
          concerns: string[];
          budget: number;
          product_preference: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age_range: string;
          skin_type: string;
          concerns: string[];
          budget: number;
          product_preference: string;
          language: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age_range?: string;
          skin_type?: string;
          concerns?: string[];
          budget?: number;
          product_preference?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_routines: {
        Row: {
          id: string;
          user_id: string;
          morning_routine: any;
          evening_routine: any;
          total_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          morning_routine: any;
          evening_routine: any;
          total_cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          morning_routine?: any;
          evening_routine?: any;
          total_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      scan_results: {
        Row: {
          id: string;
          user_id: string;
          skin_type: string;
          concerns: string[];
          confidence: number;
          recommendations: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skin_type: string;
          concerns: string[];
          confidence: number;
          recommendations: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skin_type?: string;
          concerns?: string[];
          confidence?: number;
          recommendations?: string[];
          created_at?: string;
        };
      };
    };
  };
}
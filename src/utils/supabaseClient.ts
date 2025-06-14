import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
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
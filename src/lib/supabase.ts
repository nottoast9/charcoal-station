/**
 * Supabase Client Configuration
 *
 * This module provides the Supabase client for database operations.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Create client with fallback for build time
// During build, we use placeholder values if credentials aren't set
const createSupabaseClient = () => {
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || 'placeholder-key';
  
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

export const supabase = createSupabaseClient();

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          created_at?: string;
          is_active?: boolean;
        };
      };
      product_price_history: {
        Row: {
          id: string;
          product_id: string;
          old_price: number;
          new_price: number;
          changed_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          old_price: number;
          new_price: number;
          changed_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          old_price?: number;
          new_price?: number;
          changed_at?: string;
        };
      };
      expense_types: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          is_active?: boolean;
        };
      };
      sales: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_amount: number;
          date: string;
          time: string;
          datetime: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_amount: number;
          date: string;
          time: string;
          datetime: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_amount?: number;
          date?: string;
          time?: string;
          datetime?: string;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          expense_type_id: string;
          expense_type_name: string;
          amount: number;
          description: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_type_id: string;
          expense_type_name: string;
          amount: number;
          description: string;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_type_id?: string;
          expense_type_name?: string;
          amount?: number;
          description?: string;
          date?: string;
          created_at?: string;
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          percentage: number;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          percentage: number;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          percentage?: number;
          created_at?: string;
          is_active?: boolean;
        };
      };
      profit_splits: {
        Row: {
          id: string;
          month: number;
          year: number;
          total_income: number;
          total_expenses: number;
          net_profit: number;
          split_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          month: number;
          year: number;
          total_income: number;
          total_expenses: number;
          net_profit: number;
          split_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: number;
          year?: number;
          total_income?: number;
          total_expenses?: number;
          net_profit?: number;
          split_date?: string;
          created_at?: string;
        };
      };
      partner_splits: {
        Row: {
          id: string;
          profit_split_id: string;
          partner_id: string;
          partner_name: string;
          percentage: number;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profit_split_id: string;
          partner_id: string;
          partner_name: string;
          percentage: number;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profit_split_id?: string;
          partner_id?: string;
          partner_name?: string;
          percentage?: number;
          amount?: number;
          created_at?: string;
        };
      };
      id_sequences: {
        Row: {
          id_prefix: string;
          last_number: number;
        };
        Insert: {
          id_prefix: string;
          last_number?: number;
        };
        Update: {
          id_prefix?: string;
          last_number?: number;
        };
      };
    };
  };
}

export type SupabaseClient = typeof supabase;

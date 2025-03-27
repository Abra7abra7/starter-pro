export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Helper type to extract table types from the Database interface
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

/**
 * Helper type to extract insertable table types from the Database interface
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

/**
 * Helper type to extract updatable table types from the Database interface
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export interface Database {
  public: {
    Tables: {
      prices: {
        Row: {
          id: string
          product_id: string
          active: boolean
          currency: string
          description: string | null
          type: 'one_time' | 'recurring'
          unit_amount: number | null
          interval?: 'day' | 'week' | 'month' | 'year' | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata: Json | null
        }
        Insert: {
          id: string
          product_id: string
          active?: boolean
          currency: string
          description?: string | null
          type?: 'one_time' | 'recurring'
          unit_amount?: number | null
          interval?: 'day' | 'week' | 'month' | 'year' | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          product_id?: string
          active?: boolean
          currency?: string
          description?: string | null
          type?: 'one_time' | 'recurring'
          unit_amount?: number | null
          interval?: 'day' | 'week' | 'month' | 'year' | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
      }
      products: {
        Row: {
          id: string
          active: boolean
          name: string
          description: string | null
          image: string | null
          metadata: Json | null
          marketing_features: string[]
          live_mode: boolean
        }
        Insert: {
          id: string
          active?: boolean
          name: string
          description?: string | null
          image?: string | null
          metadata?: Json | null
          marketing_features?: string[]
          live_mode?: boolean
        }
        Update: {
          id?: string
          active?: boolean
          name?: string
          description?: string | null
          image?: string | null
          metadata?: Json | null
          marketing_features?: string[]
          live_mode?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          metadata: Json | null
          price_id: string
          quantity: number | null
          cancel_at_period_end: boolean
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id: string
          user_id: string
          status: string
          metadata?: Json | null
          price_id: string
          quantity?: number | null
          cancel_at_period_end: boolean
          created: string
          current_period_start: string
          current_period_end: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          metadata?: Json | null
          price_id?: string
          quantity?: number | null
          cancel_at_period_end?: boolean
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

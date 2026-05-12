export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string | null
          course: string | null
          role_id: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          course?: string | null
          role_id: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          course?: string | null
          role_id?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      finances: {
        Row: {
          id: string
          type: 'receita' | 'despesa'
          category: string
          description: string | null
          amount: number
          date: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'receita' | 'despesa'
          category: string
          description?: string | null
          amount: number
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'receita' | 'despesa'
          category?: string
          description?: string | null
          amount?: number
          date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          date: string
          location: string | null
          max_participants: number | null
          current_participants: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          date: string
          location?: string | null
          max_participants?: number | null
          current_participants?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          date?: string
          location?: string | null
          max_participants?: number | null
          current_participants?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          cost_price: number
          price: number
          profit_margin: number
          stock: number
          size: string | null
          image_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cost_price: number
          price: number
          stock?: number
          size?: string | null
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cost_price?: number
          price?: number
          stock?: number
          size?: string | null
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          type: 'entrada' | 'saida' | 'ajuste'
          quantity: number
          reason: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          type: 'entrada' | 'saida' | 'ajuste'
          quantity: number
          reason?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          type?: 'entrada' | 'saida' | 'ajuste'
          quantity?: number
          reason?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          customer_name: string | null
          customer_phone: string | null
          payment_method: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          customer_name?: string | null
          customer_phone?: string | null
          payment_method?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          customer_name?: string | null
          customer_phone?: string | null
          payment_method?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          title: string
          description: string | null
          target_value: number
          current_value: number
          unit: string | null
          deadline: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high'
          category: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          target_value: number
          current_value?: number
          unit?: string | null
          deadline?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          category: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          unit?: string | null
          deadline?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          category?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

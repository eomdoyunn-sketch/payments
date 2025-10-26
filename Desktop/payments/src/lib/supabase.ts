import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface SettingsData {
  globalSettings?: Record<string, unknown>
  localSettings?: Record<string, unknown>
  [key: string]: unknown
}

export interface QuotaData {
  full_day?: number
  morning?: number
  evening?: number
  [key: string]: unknown
}

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string
          data: SettingsData
          updated_at: string
        }
        Insert: {
          id?: string
          data: SettingsData
          updated_at?: string
        }
        Update: {
          id?: string
          data?: SettingsData
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: number
          code: string
          name: string
          quota: QuotaData
          mode: string
          status: string
          registered: number
          remaining: number
          contact_person: string
          contact_email: string
          contact_phone: string
          allocated_total: number
          full_day_allocated: number
          full_day_paid: number
          morning_allocated: number
          morning_paid: number
          evening_allocated: number
          evening_paid: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          quota: QuotaData
          mode: string
          status: string
          registered?: number
          remaining?: number
          contact_person?: string
          contact_email?: string
          contact_phone?: string
          allocated_total: number
          full_day_allocated: number
          full_day_paid?: number
          morning_allocated: number
          morning_paid?: number
          evening_allocated: number
          evening_paid?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          quota?: QuotaData
          mode?: string
          status?: string
          registered?: number
          remaining?: number
          contact_person?: string
          contact_email?: string
          contact_phone?: string
          allocated_total?: number
          full_day_allocated?: number
          full_day_paid?: number
          morning_allocated?: number
          morning_paid?: number
          evening_allocated?: number
          evening_paid?: number
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          payment_date: string
          company: string
          employee_id: string
          name: string
          gender: string
          membership_type: string
          membership_period: number
          has_locker: boolean
          locker_period: number
          locker_number: string | null
          price: number
          status: string
          processed: boolean
          memo: string | null
          toss_payment_key: string | null
          toss_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payment_date?: string
          company: string
          employee_id: string
          name: string
          gender: string
          membership_type: string
          membership_period: number
          has_locker: boolean
          locker_period: number
          locker_number?: string | null
          price: number
          status?: string
          processed?: boolean
          memo?: string | null
          toss_payment_key?: string | null
          toss_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payment_date?: string
          company?: string
          employee_id?: string
          name?: string
          gender?: string
          membership_type?: string
          membership_period?: number
          has_locker?: boolean
          locker_period?: number
          locker_number?: string | null
          price?: number
          status?: string
          processed?: boolean
          memo?: string | null
          toss_payment_key?: string | null
          toss_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      whitelists: {
        Row: {
          id: string
          company_code: string
          product_type: string
          employee_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          company_code: string
          product_type: string
          employee_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          company_code?: string
          product_type?: string
          employee_id?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}



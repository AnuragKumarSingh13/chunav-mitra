import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Service role client for admin operations
const supabaseServiceUrl = 'https://ycwqrtpkcawfgcickrtl.supabase.co'
const supabaseServiceKey = 'SERVICE_ROLE_KEY_HERE' // This should be set in .env

export const supabase = createClient(
  supabaseServiceUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false
    }
  }
)

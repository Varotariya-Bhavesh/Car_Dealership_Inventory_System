import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.'
  );
}

/**
 * Server-side Supabase client using the Service Role Key.
 * This bypasses Row Level Security (RLS) — use only in trusted server code.
 * Never expose this key to the client.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

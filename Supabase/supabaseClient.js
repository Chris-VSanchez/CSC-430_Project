import ws from "ws";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEYS = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS'));
const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS'));

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  SUPABASE_PUBLISHABLE_KEYS['default']
)

// Administrative operations
const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS'))
// For admin operations (bypasses RLS)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL'),
  SUPABASE_SECRET_KEYS['default']
)

// Backend Supabase client (admin service role)
export const supabase = createClient(
  supabaseUrl,
  SUPABASE_SECRET_KEYS,
  {
    realtime: {
      transport: ws
    }
  }
);
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing from .env. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  // In a production app, you might want to prevent the app from loading or show a critical error message.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
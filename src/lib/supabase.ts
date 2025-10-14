import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:', {
    supabaseUrl: supabaseUrl ? 'present' : 'MISSING',
    supabaseAnonKey: supabaseAnonKey ? 'present' : 'MISSING',
    allEnvVars: import.meta.env
  });
  throw new Error(`Missing Supabase environment variables - URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

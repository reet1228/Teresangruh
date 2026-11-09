import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel.');
}

export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseKey || 'missing-publishable-key');

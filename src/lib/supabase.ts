import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function fetchAds() {
  const { data, error } = await supabase.from('ads').select('*');
  if (error) {
    throw error;
  }
  return data;
}
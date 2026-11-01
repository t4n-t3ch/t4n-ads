import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Browser client used by 'use client' components. Unlike the plain
// @supabase/supabase-js client, this persists the session as a cookie (not
// just localStorage), which is what createMiddlewareClient/
// createRouteHandlerClient read on the server — required for
// middleware-protected routes and API routes to see a logged-in session.
export const supabase = createClientComponentClient<Database>();

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
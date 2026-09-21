import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client using the service role key, which bypasses RLS entirely.
 * Only use this in trusted backend contexts with no user session (webhooks, cron jobs) -
 * never import it into client-side code, and never expose the key to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role configuration (SUPABASE_SERVICE_ROLE_KEY)')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

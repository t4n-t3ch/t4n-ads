import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export function createClient() {
  return createServerActionClient<Database>({
    cookies,
  })
}
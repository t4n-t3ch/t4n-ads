import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function getUser() {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
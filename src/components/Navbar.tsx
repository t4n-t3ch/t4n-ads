"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaUserCircle } from 'react-icons/fa'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <nav className={cn('bg-white shadow-md p-4')}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span>{user.email}</span>
              <FaUserCircle className="text-2xl" />
            </>
          ) : (
            <Link href="/login" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
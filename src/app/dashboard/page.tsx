use client

import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const user = getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  )
}
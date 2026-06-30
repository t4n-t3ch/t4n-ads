import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    // Get session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        credits: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      // Create user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          credits: 10 // Default credits
        },
        select: {
          id: true,
          email: true,
          credits: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return NextResponse.json(newUser)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
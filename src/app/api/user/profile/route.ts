import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // Find or create user in Prisma database
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        credits: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    // If user doesn't exist in Prisma yet, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: session.user.email || '',
          credits: 10, // Default starting credits
        },
        select: {
          id: true,
          email: true,
          credits: true,
          createdAt: true,
          updatedAt: true
        }
      })
    }
    
    // Return user profile with credits
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
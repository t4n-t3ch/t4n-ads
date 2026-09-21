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
    
    if (!session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Keyed by email, matching every other route that touches this user row
    // (id is a generated cuid, not the Supabase UUID - see supabaseId for that).
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        supabaseId: session.user.id,
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
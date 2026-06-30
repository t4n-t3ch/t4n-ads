import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { credits: true }
    })

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { credits: user.credits }
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, operation = 'deduct' } = body

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, credits: true }
    })

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (operation === 'deduct') {
      if (user.credits < amount) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Insufficient credits' },
          { status: 400 }
        )
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: amount } },
        select: { credits: true }
      })

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { credits: updatedUser.credits }
      })
    } else if (operation === 'add') {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { credits: { increment: amount } },
        select: { credits: true }
      })

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { credits: updatedUser.credits }
      })
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid operation' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error updating credits:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
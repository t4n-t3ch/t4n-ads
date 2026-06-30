// src/app/api/videos/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const videoId = params.id

    if (!videoId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session.user.id
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    if (!video) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: video
    })
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json<ApiResponse>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch video'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const videoId = params.id

    if (!videoId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // First verify the video belongs to the user
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session.user.id
      }
    })

    if (!video) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }

    // Delete the video
    await prisma.video.delete({
      where: {
        id: videoId
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Video deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json<ApiResponse>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete video'
      },
      { status: 500 }
    )
  }
}
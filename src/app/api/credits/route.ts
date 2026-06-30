// src/app/api/generate/status/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VideoStatus } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const videoId = params.id

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        progress: true,
        videoUrl: true,
        error: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        duration: true,
        aspectRatio: true,
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // If video is completed and has a videoUrl, return it
    if (video.status === VideoStatus.COMPLETED && video.videoUrl) {
      return NextResponse.json({
        id: video.id,
        status: video.status,
        progress: 100,
        videoUrl: video.videoUrl,
        title: video.title,
        duration: video.duration,
        aspectRatio: video.aspectRatio,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      })
    }

    // If video failed, return error
    if (video.status === VideoStatus.FAILED) {
      return NextResponse.json({
        id: video.id,
        status: video.status,
        progress: video.progress || 0,
        error: video.error || 'Unknown error occurred',
        title: video.title,
        duration: video.duration,
        aspectRatio: video.aspectRatio,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      })
    }

    // For processing videos, return current progress
    return NextResponse.json({
      id: video.id,
      status: video.status,
      progress: video.progress || 0,
      title: video.title,
      duration: video.duration,
      aspectRatio: video.aspectRatio,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching video status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
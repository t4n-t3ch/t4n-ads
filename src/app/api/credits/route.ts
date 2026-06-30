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

    // If video is completed but has no videoUrl, check if we should simulate one
    if (video.status === VideoStatus.COMPLETED && !video.videoUrl) {
      // In development, we might want to return a placeholder
      if (process.env.NODE_ENV === 'development') {
        const placeholderVideo = {
          ...video,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }
        return NextResponse.json(placeholderVideo)
      }
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
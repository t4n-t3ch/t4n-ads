import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VideoStatus } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        videos: {
          orderBy: { createdAt: 'desc' },
          include: {
            template: {
              select: {
                id: true,
                name: true,
                category: true,
                thumbnailUrl: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transform the data to match our Video type
    const videos = user.videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      prompt: video.prompt,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      status: video.status as VideoStatus,
      aspectRatio: video.aspectRatio,
      duration: video.duration,
      style: video.style,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
      userId: video.userId,
      templateId: video.templateId,
      template: video.template ? {
        id: video.template.id,
        name: video.template.name,
        category: video.template.category,
        thumbnailUrl: video.template.thumbnailUrl
      } : null
    }))

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
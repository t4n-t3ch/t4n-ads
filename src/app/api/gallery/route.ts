import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Video } from '@/types'

export async function GET(request: Request) {
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

    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        template: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    })

    const formattedVideos: Video[] = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      prompt: video.prompt,
      status: video.status,
      aspectRatio: video.aspectRatio,
      duration: video.duration,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
      userId: video.userId,
      templateId: video.templateId,
      template: video.template ? {
        id: video.template.id,
        name: video.template.name,
        category: video.template.category,
      } : undefined,
    }))

    return NextResponse.json(formattedVideos)
  } catch (error) {
    console.error('Error fetching gallery videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
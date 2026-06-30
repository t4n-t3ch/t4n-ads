import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VideoStatus } from '@/types'
import { generateVideo } from '@/services/videoGeneration'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { prompt, aspectRatio, duration, style, templateId } = body

    if (!prompt || !aspectRatio || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, aspectRatio, duration' },
        { status: 400 }
      )
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title: prompt.substring(0, 100),
        description: prompt,
        prompt,
        aspectRatio,
        duration: parseInt(duration),
        style: style || 'cinematic',
        status: VideoStatus.PROCESSING,
        progress: 0,
        templateId: templateId || null,
      },
    })

    // Deduct one credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    })

    // Start generation in background (non-blocking)
    generateVideo(prompt, aspectRatio, duration, style, video.id)
      .then(async (result) => {
        if (result.success) {
          await prisma.video.update({
            where: { id: video.id },
            data: {
              status: VideoStatus.COMPLETED,
              progress: 100,
              videoUrl: result.videoUrl,
              thumbnailUrl: result.thumbnailUrl,
              metadata: result.metadata,
            },
          })
        } else {
          await prisma.video.update({
            where: { id: video.id },
            data: {
              status: VideoStatus.FAILED,
              error: result.error,
            },
          })
        }
      })
      .catch(async (error) => {
        console.error('Video generation error:', error)
        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: VideoStatus.FAILED,
            error: error.message,
          },
        })
      })

    return NextResponse.json({
      success: true,
      videoId: video.id,
      message: 'Video generation started',
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
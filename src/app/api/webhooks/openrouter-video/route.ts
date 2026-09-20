import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VideoStatus } from '@/types'
import { finalizeVideoGeneration } from '@/services/finalizeVideo'

export async function POST(request: NextRequest) {
  const event = await request.json()
  const jobId = event?.data?.id

  if (!jobId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const video = await prisma.video.findUnique({ where: { jobId } })
  if (!video) {
    return NextResponse.json({ received: true })
  }

  if (event.type === 'video.generation.completed') {
    const rawVideoUrl = event.data.unsigned_urls?.[0]
    if (rawVideoUrl) {
      await finalizeVideoGeneration(video.id, rawVideoUrl)
    }
  } else if (event.type === 'video.generation.failed') {
    await prisma.video.update({
      where: { id: video.id },
      data: {
        status: VideoStatus.FAILED,
        error: event.data.error || 'Video generation failed',
      },
    })
  }

  return NextResponse.json({ received: true })
}

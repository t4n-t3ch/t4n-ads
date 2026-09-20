import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'
import { getVideoGenerationStatus } from '@/services/videoGeneration'
import { finalizeVideoGeneration } from '@/services/finalizeVideo'
import { VideoStatus } from '@/types'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const video = await prisma.video.findUnique({ where: { id: params.id } })

  if (!video || video.userId !== session.user.id) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  // Already resolved, e.g. by the webhook - no need to re-poll the provider
  if (video.status === VideoStatus.COMPLETED || video.status === VideoStatus.FAILED) {
    return NextResponse.json({
      id: video.id,
      status: video.status,
      progress: video.progress,
      videoUrl: video.status === VideoStatus.COMPLETED ? video.videoUrl : undefined,
      error: video.error ?? undefined,
    })
  }

  // Veo finished and we're now adding voice/music/captions - nothing to poll externally for this part
  if (video.status === VideoStatus.COMPOSING) {
    return NextResponse.json({ id: video.id, status: 'composing', progress: video.progress })
  }

  if (!video.jobId) {
    return NextResponse.json({ id: video.id, status: video.status, progress: video.progress })
  }

  const jobStatus = await getVideoGenerationStatus(video.jobId)

  if (jobStatus.status === 'completed' && jobStatus.videoUrl) {
    // Awaited inline: local dev has no reachable webhook callback, so this poll is the only trigger.
    await finalizeVideoGeneration(video.id, jobStatus.videoUrl)
    const updated = await prisma.video.findUnique({ where: { id: video.id } })
    return NextResponse.json({
      id: video.id,
      status: updated?.status ?? 'failed',
      progress: updated?.progress ?? 0,
      videoUrl: updated?.status === VideoStatus.COMPLETED ? updated.videoUrl : undefined,
      error: updated?.error ?? undefined,
    })
  }

  if (['failed', 'cancelled', 'expired'].includes(jobStatus.status)) {
    const error = jobStatus.error || 'Video generation failed'
    await prisma.video.update({
      where: { id: video.id },
      data: { status: VideoStatus.FAILED, error },
    })
    return NextResponse.json({ id: video.id, status: 'failed', error })
  }

  return NextResponse.json({ id: video.id, status: 'processing', progress: video.progress })
}

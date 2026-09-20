import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { submitVideoGeneration } from '@/services/videoGeneration'
import { pickDurationForNarration } from '@/services/captions'
import { VideoStatus } from '@/types'

// Re-run a studio roughly once a day, allowing slack for cron timing drift.
const MIN_HOURS_BETWEEN_RUNS = 20

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - MIN_HOURS_BETWEEN_RUNS * 60 * 60 * 1000)

  const dueStudios = await prisma.studio.findMany({
    where: {
      dailyGeneration: true,
      OR: [{ lastGeneratedAt: null }, { lastGeneratedAt: { lt: cutoff } }],
    },
    include: {
      assets: { where: { type: 'image' }, orderBy: { createdAt: 'desc' } },
    },
  })

  const results = []

  for (const studio of dueStudios) {
    const prompt = studio.dailyPrompt || studio.stylePrompt || `Create a short video for the "${studio.name}" channel.`
    // Rotate through reference images so the same shot isn't reused every run.
    const asset = studio.assets.length > 0
      ? studio.assets[Math.floor(Math.random() * studio.assets.length)]
      : null

    const resolvedDuration = pickDurationForNarration(8, prompt)

    const video = await prisma.video.create({
      data: {
        userId: studio.userId,
        studioId: studio.id,
        title: `Daily: ${studio.name}`,
        prompt,
        narration: prompt,
        aspectRatio: studio.aspectRatio,
        duration: resolvedDuration,
        status: VideoStatus.PROCESSING,
        progress: 0,
      },
    })

    const callbackUrl = `${request.nextUrl.origin}/api/webhooks/openrouter-video`
    const result = await submitVideoGeneration(
      { prompt, aspectRatio: studio.aspectRatio, duration: resolvedDuration, referenceImageUrl: asset?.url },
      callbackUrl
    )

    if (result.success) {
      await prisma.video.update({ where: { id: video.id }, data: { jobId: result.jobId } })
      await prisma.studio.update({ where: { id: studio.id }, data: { lastGeneratedAt: new Date() } })
      results.push({ studioId: studio.id, videoId: video.id, status: 'submitted' })
    } else {
      await prisma.video.update({
        where: { id: video.id },
        data: { status: VideoStatus.FAILED, error: result.error },
      })
      results.push({ studioId: studio.id, videoId: video.id, status: 'failed', error: result.error })
    }
  }

  return NextResponse.json({ success: true, processed: results.length, results })
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'
import { submitVideoGeneration } from '@/services/videoGeneration'
import { pickDurationForNarration } from '@/services/captions'
import { VideoStatus } from '@/types'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: { email: session.user.email, supabaseId: session.user.id, credits: 10 },
  })

  const studio = await prisma.studio.findUnique({ where: { id: params.id } })
  if (!studio || studio.userId !== user.id) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  const body = await request.json()
  const { prompt, narration, duration = 8, assetId } = body

  if (!prompt || prompt.trim().length < 3) {
    return NextResponse.json({ error: 'Prompt is required and must be at least 3 characters' }, { status: 400 })
  }

  const narrationScript = narration?.trim() || prompt
  const resolvedDuration = pickDurationForNarration(duration, narrationScript)

  let referenceImageUrl: string | undefined
  if (assetId) {
    const asset = await prisma.studioAsset.findUnique({ where: { id: assetId } })
    if (!asset || asset.studioId !== studio.id) {
      return NextResponse.json({ error: 'Reference asset not found in this studio' }, { status: 404 })
    }
    if (asset.type === 'image') {
      referenceImageUrl = asset.url
    }
  }

  const combinedPrompt = studio.stylePrompt ? `${studio.stylePrompt}\n\n${prompt}` : prompt

  const video = await prisma.video.create({
    data: {
      userId: user.id,
      studioId: studio.id,
      title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      prompt: combinedPrompt,
      narration: narrationScript,
      aspectRatio: studio.aspectRatio,
      duration: resolvedDuration,
      status: VideoStatus.PROCESSING,
      progress: 0,
    },
  })

  const callbackUrl = `${request.nextUrl.origin}/api/webhooks/openrouter-video`

  const result = await submitVideoGeneration(
    { prompt: combinedPrompt, aspectRatio: studio.aspectRatio, duration: resolvedDuration, referenceImageUrl },
    callbackUrl
  )

  if (!result.success) {
    await prisma.video.update({
      where: { id: video.id },
      data: { status: VideoStatus.FAILED, error: result.error },
    })
    return NextResponse.json({ error: result.error || 'Failed to start video generation' }, { status: 500 })
  }

  await prisma.video.update({ where: { id: video.id }, data: { jobId: result.jobId } })

  return NextResponse.json({ success: true, videoId: video.id, status: VideoStatus.PROCESSING })
}

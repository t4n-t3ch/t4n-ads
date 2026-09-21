import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'
import { VideoStatus } from '@/types'
import { generateVoiceover, generateMusic } from '@/services/audioGeneration'
import { buildCaptionChunks, chunksToSrt } from '@/services/captions'
import { composeVideo } from '@/services/videoComposition'

const GENERATED_VIDEOS_BUCKET = 'generated-videos'

/**
 * Runs once a Veo clip finishes rendering: adds a voiceover, background music, and burned-in
 * captions, then re-hosts the final file. Called from both the webhook (production) and the
 * status-poll fallback (local dev, where OpenRouter can't reach a public callback URL).
 *
 * Guarded so only one caller does this work even if the webhook and a poll race each other.
 */
export async function finalizeVideoGeneration(videoId: string, rawVideoUrl: string): Promise<void> {
  const claimed = await prisma.video.updateMany({
    where: { id: videoId, status: VideoStatus.PROCESSING },
    data: { status: VideoStatus.COMPOSING },
  })
  if (claimed.count === 0) return // already being handled, or already finished

  try {
    const video = await prisma.video.findUniqueOrThrow({ where: { id: videoId } })
    const narration = video.narration || video.prompt || ''
    const durationSeconds = video.duration || 8

    const videoResponse = await fetch(rawVideoUrl, {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    })
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch generated video (${videoResponse.status})`)
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())

    const [voiceoverResult, musicResult] = await Promise.allSettled([
      generateVoiceover(narration),
      generateMusic(`Short instrumental background music, no vocals, matching the mood of: ${narration}`),
    ])

    if (voiceoverResult.status === 'rejected') {
      throw new Error(`Voiceover generation failed: ${voiceoverResult.reason}`)
    }
    const voiceoverBuffer = voiceoverResult.value
    const musicBuffer = musicResult.status === 'fulfilled' ? musicResult.value : null

    const captionChunks = buildCaptionChunks(narration, durationSeconds)
    const srtContent = chunksToSrt(captionChunks)

    const composedBuffer = await composeVideo({
      videoBuffer,
      voiceoverBuffer,
      musicBuffer,
      srtContent,
      durationSeconds,
    })

    const supabaseAdmin = createAdminClient()
    const fileName = `${video.userId}/${video.id}-${Date.now()}.mp4`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(GENERATED_VIDEOS_BUCKET)
      .upload(fileName, composedBuffer, { contentType: 'video/mp4', upsert: false })

    if (uploadError) {
      throw new Error(`Failed to upload composed video: ${uploadError.message}`)
    }

    const { data: urlData } = supabaseAdmin.storage.from(GENERATED_VIDEOS_BUCKET).getPublicUrl(fileName)

    await prisma.video.update({
      where: { id: videoId },
      data: { status: VideoStatus.COMPLETED, progress: 100, videoUrl: urlData.publicUrl },
    })
  } catch (error) {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: VideoStatus.FAILED,
        error: error instanceof Error ? error.message : 'Failed to finalize video',
      },
    })
  }
}

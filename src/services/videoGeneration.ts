const OPENROUTER_VIDEOS_URL = 'https://openrouter.ai/api/v1/videos'
const DEFAULT_MODEL = 'google/veo-3.1-fast'

type SubmitParams = {
  prompt: string
  aspectRatio: string
  duration: number
}

type SubmitResult =
  | { success: true; jobId: string }
  | { success: false; error: string }

export async function submitVideoGeneration(
  { prompt, aspectRatio, duration }: SubmitParams,
  callbackUrl: string
): Promise<SubmitResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { success: false, error: 'Video generation is not configured (missing OPENROUTER_API_KEY)' }
  }

  try {
    const response = await fetch(OPENROUTER_VIDEOS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt,
        duration,
        resolution: '720p',
        aspect_ratio: aspectRatio,
        generate_audio: false,
        callback_url: callbackUrl,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data?.error?.message || data?.error || `Video generation request failed (${response.status})`,
      }
    }

    return { success: true, jobId: data.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reach video generation provider',
    }
  }
}

export type VideoJobStatus = {
  id: string
  status: string
  videoUrl?: string
  error?: string
}

export async function getVideoGenerationStatus(jobId: string): Promise<VideoJobStatus> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { id: jobId, status: 'failed', error: 'Video generation is not configured' }
  }

  const response = await fetch(`${OPENROUTER_VIDEOS_URL}/${jobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  const data = await response.json()

  if (!response.ok) {
    return { id: jobId, status: 'failed', error: data?.error?.message || 'Failed to fetch video status' }
  }

  return {
    id: data.id,
    status: data.status,
    videoUrl: data.unsigned_urls?.[0],
    error: data.error,
  }
}

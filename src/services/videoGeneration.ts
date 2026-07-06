export interface VideoGenerationOptions {
  prompt: string
  aspectRatio?: '16:9' | '9:16' | '1:1'
  duration?: number
}

export interface SubmitVideoResult {
  success: boolean
  jobId?: string
  error?: string
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export async function submitVideoGeneration(
  options: VideoGenerationOptions,
  callbackUrl: string
): Promise<SubmitVideoResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { success: false, error: 'OPENROUTER_API_KEY is not configured' }
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/veo-3.1',
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio || '16:9',
        duration: options.duration || 8,
        callback_url: callbackUrl,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `OpenRouter error: ${errorText}` }
    }

    const data = await response.json()
    return { success: true, jobId: data.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error submitting video job',
    }
  }
}

export interface VideoGenerationOptions {
  prompt: string
  aspectRatio?: '16:9' | '9:16' | '1:1'
  duration?: number
  generateAudio?: boolean
  frameImageUrl?: string
  referenceImageUrls?: string[]
  subjectContext?: string
}

export interface SubmitVideoResult {
  success: boolean
  jobId?: string
  error?: string
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

/**
 * Used by "AI varies each time" automations: writes a fresh one-paragraph
 * video ad prompt from a style goal + subject description, so each
 * scheduled run isn't the exact same video.
 */
export async function generateVariedPrompt(
  styleGoal: string,
  subjectContext?: string
): Promise<{ prompt: string | null; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { prompt: null, error: 'OPENROUTER_API_KEY is not configured' }
  }

  const userContent = subjectContext
    ? `Brand/subject context: ${subjectContext}\n\nCreative direction: ${styleGoal}`
    : `Creative direction: ${styleGoal}`

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You write single-paragraph prompts for an AI video generator (Veo). ' +
              'Given a creative direction, write one fresh, specific, visually ' +
              'descriptive prompt (2-4 sentences) for an 8-second ad. Vary the ' +
              'angle/scene each time so repeated runs don\'t look identical. ' +
              'Reply with only the prompt text, no preamble or quotes.',
          },
          { role: 'user', content: userContent },
        ],
        temperature: 1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { prompt: null, error: `OpenRouter error: ${errorText}` }
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) {
      return { prompt: null, error: 'Empty response generating prompt' }
    }
    return { prompt: text }
  } catch (error) {
    return {
      prompt: null,
      error: error instanceof Error ? error.message : 'Unknown error generating prompt',
    }
  }
}

export async function submitVideoGeneration(
  options: VideoGenerationOptions,
  callbackUrl: string
): Promise<SubmitVideoResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { success: false, error: 'OPENROUTER_API_KEY is not configured' }
  }

  const brandGuard =
    "\n\nIMPORTANT: if any on-screen text, logo, or spoken word includes the " +
    "company name, it must read exactly \"Trade-Link-UK\" - capital T, capital " +
    "L, capital U, capital K, with a hyphen between each word, never " +
    "abbreviated, merged, or missing a hyphen (e.g. not \"Link-UK\", not " +
    "\"TradeLinkUK\", not \"Trade-LinUK\")."

  const prompt =
    (options.subjectContext
      ? `Brand context: ${options.subjectContext}\n\n${options.prompt}`
      : options.prompt) + brandGuard

  const body: Record<string, unknown> = {
    model: 'google/veo-3.1',
    prompt,
    aspect_ratio: options.aspectRatio || '16:9',
    duration: options.duration || 8,
    generate_audio: options.generateAudio ?? true,
    callback_url: callbackUrl,
  }

  if (options.frameImageUrl) {
    body.frame_images = [
      {
        type: 'image_url',
        image_url: { url: options.frameImageUrl },
        frame_type: 'first_frame',
      },
    ]
  }

  if (options.referenceImageUrls?.length) {
    // Veo 3.1 hard-caps reference-to-video at 3 images, and expects them to
    // cohere into one subject - exceeding the cap is rejected outright.
    body.input_references = options.referenceImageUrls.slice(0, 3).map((url) => ({
      type: 'image_url',
      image_url: { url },
    }))
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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

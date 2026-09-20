const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const TTS_MODEL = 'hexgrad/kokoro-82m'
const MUSIC_MODEL = 'google/lyria-3-clip-preview'

/** Generates a spoken voiceover from a script. Throws on failure - a missing voiceover should fail the whole video. */
export async function generateVoiceover(script: string, voice = 'onyx'): Promise<Buffer> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('Voiceover generation is not configured (missing OPENROUTER_API_KEY)')
  }

  const response = await fetch(`${OPENROUTER_BASE}/audio/speech`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      input: script,
      voice,
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Voiceover generation failed (${response.status}): ${text}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Generates a short instrumental music clip. Returns null on failure rather than throwing -
 * music is a nice-to-have, and a flaky music call shouldn't sink an otherwise-good video.
 */
export async function generateMusic(prompt: string): Promise<Buffer | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MUSIC_MODEL,
        modalities: ['text', 'audio'],
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok || !response.body) {
      console.error('Music generation request failed:', response.status)
      return null
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let audioB64 = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6)
        if (payload === '[DONE]') continue

        try {
          const json = JSON.parse(payload)
          const audioChunk = json.choices?.[0]?.delta?.audio?.data
          if (audioChunk) audioB64 += audioChunk
        } catch {
          // ignore malformed/partial SSE lines
        }
      }
    }

    if (!audioB64) return null
    return Buffer.from(audioB64, 'base64')
  } catch (error) {
    console.error('Music generation error:', error)
    return null
  }
}

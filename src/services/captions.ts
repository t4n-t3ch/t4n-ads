const WORDS_PER_SECOND = 2.3
const WORDS_PER_CHUNK = 5

export type CaptionChunk = {
  text: string
  start: number
  end: number
}

/** Rough estimate of how long a script takes to speak aloud, used to pick a video duration that won't clip the narration. */
export function estimateSpeechDuration(script: string): number {
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length
  return wordCount / WORDS_PER_SECOND
}

/** Veo 3.1 (Fast) only supports these exact durations - bumps up to fit the narration instead of clipping it. */
const SUPPORTED_DURATIONS = [4, 6, 8]

export function pickDurationForNarration(requestedDuration: number, narration: string): number {
  const neededSeconds = estimateSpeechDuration(narration)
  const target = Math.max(requestedDuration, neededSeconds)
  return SUPPORTED_DURATIONS.find((d) => d >= target) ?? SUPPORTED_DURATIONS[SUPPORTED_DURATIONS.length - 1]
}

/** Splits a script into small chunks and distributes them evenly across the given duration. */
export function buildCaptionChunks(script: string, totalDurationSeconds: number): CaptionChunk[] {
  const words = script.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const groups: string[] = []
  for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
    groups.push(words.slice(i, i + WORDS_PER_CHUNK).join(' '))
  }

  const perChunk = totalDurationSeconds / groups.length
  return groups.map((text, i) => ({
    text,
    start: i * perChunk,
    end: (i + 1) * perChunk,
  }))
}

function formatSrtTimestamp(seconds: number): string {
  const ms = Math.max(0, Math.round(seconds * 1000))
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const msRemainder = ms % 1000
  const pad = (n: number, len = 2) => String(n).padStart(len, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(msRemainder, 3)}`
}

export function chunksToSrt(chunks: CaptionChunk[]): string {
  return chunks
    .map((chunk, i) => {
      return `${i + 1}\n${formatSrtTimestamp(chunk.start)} --> ${formatSrtTimestamp(chunk.end)}\n${chunk.text}\n`
    })
    .join('\n')
}

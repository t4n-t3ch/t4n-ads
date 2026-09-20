import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import ffmpeg from '@ffmpeg-installer/ffmpeg'

type ComposeParams = {
  videoBuffer: Buffer
  voiceoverBuffer: Buffer
  musicBuffer: Buffer | null
  srtContent: string
  durationSeconds: number
}

/** Escapes a filesystem path for use inside an ffmpeg filter option (subtitles=<path>), which is finicky about `:` and `\`. */
function escapePathForFilter(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:')
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg.path, args)
    let stderr = ''
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })
    proc.on('error', reject)
    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-2000)}`))
    })
  })
}

/** Mixes a voiceover and optional music onto a silent video, burning in the given SRT captions. */
export async function composeVideo({
  videoBuffer,
  voiceoverBuffer,
  musicBuffer,
  srtContent,
  durationSeconds,
}: ComposeParams): Promise<Buffer> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 't4n-compose-'))

  try {
    const videoPath = path.join(tmpDir, 'input.mp4')
    const voicePath = path.join(tmpDir, 'voice.mp3')
    const musicPath = path.join(tmpDir, 'music.mp3')
    const srtPath = path.join(tmpDir, 'captions.srt')
    const outputPath = path.join(tmpDir, 'output.mp4')

    await fs.writeFile(videoPath, videoBuffer)
    await fs.writeFile(voicePath, voiceoverBuffer)
    await fs.writeFile(srtPath, srtContent, 'utf8')
    if (musicBuffer) await fs.writeFile(musicPath, musicBuffer)

    const subtitlesFilter = `subtitles='${escapePathForFilter(srtPath)}':force_style='FontName=Arial,FontSize=22,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Alignment=2,MarginV=80'`

    const args = musicBuffer
      ? [
          '-y',
          '-i', videoPath,
          '-i', voicePath,
          '-i', musicPath,
          '-filter_complex',
          `[1:a]volume=1.0[voice];[2:a]volume=0.22[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout];[0:v]${subtitlesFilter}[vout]`,
          '-map', '[vout]',
          '-map', '[aout]',
          '-t', String(durationSeconds),
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-c:a', 'aac',
          outputPath,
        ]
      : [
          '-y',
          '-i', videoPath,
          '-i', voicePath,
          '-filter_complex', `[0:v]${subtitlesFilter}[vout]`,
          '-map', '[vout]',
          '-map', '1:a',
          '-t', String(durationSeconds),
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-c:a', 'aac',
          outputPath,
        ]

    await runFfmpeg(args)
    return await fs.readFile(outputPath)
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
  }
}

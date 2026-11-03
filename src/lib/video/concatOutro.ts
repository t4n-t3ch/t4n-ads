import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Matches the aspect ratio options offered in the Gallery/Generate UI.
const TARGET_DIMENSIONS: Record<string, [number, number]> = {
  '16:9': [1280, 720],
  '9:16': [720, 1280],
  '1:1': [1080, 1080],
  '4:5': [864, 1080],
};

/**
 * Appends the account's chosen outro video to the end of a freshly generated
 * video. Both clips are scaled/letterboxed to the same target resolution and
 * re-encoded so a differently-sized or differently-codec'd outro still
 * concatenates cleanly, rather than requiring an exact stream match.
 */
export async function appendOutro(
  mainBuffer: Buffer,
  outroUrl: string,
  aspectRatio: string | null | undefined
): Promise<Buffer> {
  const [w, h] = TARGET_DIMENSIONS[aspectRatio || '16:9'] || TARGET_DIMENSIONS['16:9'];

  const id = crypto.randomUUID();
  const mainPath = path.join(os.tmpdir(), `${id}-main.mp4`);
  const outroPath = path.join(os.tmpdir(), `${id}-outro.mp4`);
  const outPath = path.join(os.tmpdir(), `${id}-out.mp4`);

  try {
    await fs.writeFile(mainPath, mainBuffer);

    const outroRes = await fetch(outroUrl);
    if (!outroRes.ok) {
      throw new Error(`Failed to fetch outro video: ${outroRes.status}`);
    }
    await fs.writeFile(outroPath, Buffer.from(await outroRes.arrayBuffer()));

    const filter =
      `[0:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v0];` +
      `[1:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v1];` +
      `[v0][0:a][v1][1:a]concat=n=2:v=1:a=1[outv][outa]`;

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(mainPath)
        .input(outroPath)
        .complexFilter(filter)
        .outputOptions([
          '-map', '[outv]',
          '-map', '[outa]',
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '192k',
        ])
        .on('error', (err) => reject(err))
        .on('end', () => resolve())
        .save(outPath);
    });

    return await fs.readFile(outPath);
  } finally {
    await Promise.all(
      [mainPath, outroPath, outPath].map((p) => fs.rm(p, { force: true }).catch(() => {}))
    );
  }
}

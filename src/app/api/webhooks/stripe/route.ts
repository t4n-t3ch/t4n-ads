import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { VideoStatus } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    if (!data?.id) {
      return NextResponse.json({ error: 'Missing job id in webhook payload' }, { status: 400 });
    }

    const video = await prisma.video.findFirst({ where: { jobId: data.id } });
    if (!video) {
      return NextResponse.json({ error: 'No matching video for this job' }, { status: 404 });
    }

    if (type === 'video.generation.completed') {
      const sourceUrl = data.unsigned_urls?.[0];
      if (!sourceUrl) {
        await prisma.video.update({
          where: { id: video.id },
          data: { status: VideoStatus.FAILED, error: 'No video URL in completion payload' },
        });
        return NextResponse.json({ ok: true });
      }

      let finalUrl = sourceUrl;
      try {
        const videoResponse = await fetch(sourceUrl);
        const arrayBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const supabase = createClient();
        const fileName = `${video.id}-${Date.now()}.mp4`;
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, buffer, { contentType: 'video/mp4', upsert: false });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
          finalUrl = urlData.publicUrl;
        }
      } catch (uploadErr) {
        console.error('Video re-upload to Supabase failed, using OpenRouter URL directly:', uploadErr);
      }

      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: VideoStatus.COMPLETED,
          progress: 100,
          videoUrl: finalUrl,
        },
      });
    } else if (type === 'video.generation.failed' || type === 'video.generation.cancelled' || type === 'video.generation.expired') {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: VideoStatus.FAILED,
          error: data.error || 'Video generation did not complete',
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

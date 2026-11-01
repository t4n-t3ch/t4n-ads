import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { submitVideoGeneration } from '@/services/videoGeneration';
import { uploadImage } from '@/lib/actions/storage';
import { VideoStatus } from '@/types';
import type { Database } from '@/types/supabase';
import { isEmailAllowed } from '@/lib/allowlist';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isEmailAllowed(session.user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const aspectRatio = (formData.get('aspectRatio') as string) || '16:9';
    const duration = Number(formData.get('duration')) || 8;
    const style = (formData.get('style') as string) || 'cinematic';
    const templateId = formData.get('templateId') as string | null;
    const subjectId = formData.get('subjectId') as string | null;
    const generateAudio = formData.get('generateAudio') !== 'false';
    const referenceImage = formData.get('referenceImage') as File | null;

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'Prompt is required and must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Ensure a matching User row exists before creating a Video that
    // references it via foreign key — a brand new user may not have one yet
    // if this is their first action after signing up.
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        email: session.user.email || '',
        credits: 100000, // internal Trade-Link-UK use — no paywall
      },
    });

    let subjectContext: string | undefined;
    let referenceImageUrls: string[] | undefined;

    if (subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: subjectId, userId: session.user.id },
        include: { photos: true },
      });

      if (!subject) {
        return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
      }

      subjectContext = subject.description || undefined;
      referenceImageUrls = subject.photos.map((p) => p.url);
    }

    let frameImageUrl: string | undefined;
    if (referenceImage && referenceImage.size > 0) {
      const { url, error } = await uploadImage(
        referenceImage,
        'videos',
        `references/${session.user.id}`
      );
      if (error) {
        return NextResponse.json({ error: `Failed to upload reference photo: ${error}` }, { status: 500 });
      }
      frameImageUrl = url || undefined;
    }

    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        prompt,
        aspectRatio,
        duration,
        style,
        status: VideoStatus.PROCESSING,
        progress: 0,
        templateId: templateId || null,
        subjectId: subjectId || null,
      },
    });

    // request.nextUrl.origin reflects next dev's own bind address, not the
    // Host actually used to reach this server (e.g. behind a tunnel or
    // proxy) — prefer the forwarded headers when present.
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
    const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;
    const callbackUrl = `${origin}/api/webhooks/openrouter-video`;

    const result = await submitVideoGeneration(
      { prompt, aspectRatio: aspectRatio as '16:9' | '9:16' | '1:1', duration, generateAudio, frameImageUrl, referenceImageUrls, subjectContext },
      callbackUrl
    );

    if (!result.success) {
      await prisma.video.update({
        where: { id: video.id },
        data: { status: VideoStatus.FAILED, error: result.error },
      });
      return NextResponse.json(
        { error: result.error || 'Failed to start video generation' },
        { status: 500 }
      );
    }

    await prisma.video.update({
      where: { id: video.id },
      data: { jobId: result.jobId },
    });

    return NextResponse.json({
      success: true,
      videoId: video.id,
      status: VideoStatus.PROCESSING,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { submitVideoGeneration } from '@/services/videoGeneration';
import { VideoStatus } from '@/types';
import type { Database } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      prompt,
      aspectRatio = '16:9',
      duration = 8,
      style = 'cinematic',
      templateId,
    } = body;

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
        credits: 10,
      },
    });

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
      },
    });

    const callbackUrl = `${request.nextUrl.origin}/api/webhooks/openrouter-video`;

    const result = await submitVideoGeneration(
      { prompt, aspectRatio, duration },
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

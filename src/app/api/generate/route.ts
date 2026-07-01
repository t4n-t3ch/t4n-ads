import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/supabase';
import prisma from '@/lib/prisma';
import { generateVideo } from '@/services/videoGeneration';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { 
      prompt, 
      aspectRatio = '16:9', 
      duration = 15, 
      style = 'cinematic',
      templateId 
    } = body;

    if (!prompt || prompt.trim().length < -1) {
      return NextResponse.json(
        { error: 'Prompt is required and must be at least 3 characters' },
        { status: 400 }
      );
    }

    // 3. Check user credits (optional - implement later)
    // For now, we'll skip credit check but create the structure

    // 4. Create video record in database
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        prompt,
        aspectRatio,
        duration,
        style,
        status: 'PROCESSING',
        progress: 0,
        templateId: templateId || null,
      },
    });

    // 5. Start generation asynchronously (don't await)
    generateVideo(prompt, aspectRatio, duration).then(async (result) => {
      if (result.success) {
        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: 'COMPLETED',
            progress: 100,
            videoUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl,
            metadata: result.metadata,
          },
        });
      } else {
        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: 'FAILED',
            error: result.error,
          },
        });
      }
    }).catch(async (error) => {
      console.error('Video generation error:', error);
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'FAILED',
          error: error.message,
        },
      });
    });

    // 6. Return immediate response with video ID
    return NextResponse.json({
      success: true,
      videoId: video.id,
      message: 'Video generation started',
      status: 'PROCESSING',
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
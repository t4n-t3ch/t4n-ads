import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Template } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get all public templates
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match our Template type
    const formattedTemplates: Template[] = templates.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      prompt: template.prompt,
      aspectRatio: template.aspectRatio as '16:9' | '9:16' | '1:1',
      duration: template.duration,
      category: template.category || 'general',
      tags: template.tags || [],
      style: template.style || 'cinematic',
      thumbnailUrl: template.thumbnailUrl || '',
      exampleVideoUrl: template.exampleVideoUrl || '',
      isPublic: template.isPublic,
      creditCost: template.creditCost || 1,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedTemplates,
      count: formattedTemplates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
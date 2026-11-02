import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const subjects = await prisma.subject.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { photos: true } } },
    });

    return NextResponse.json(
      subjects.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        photoCount: s._count.photos,
        createdAt: s.createdAt,
      }))
    );
  } catch (error) {
    console.error('List subjects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { id: userId, email: userEmail } = await resolveAccountUser(session.user);

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: userEmail,
        credits: 100000, // internal Trade-Link-UK use — no paywall
      },
    });

    const subject = await prisma.subject.create({
      data: {
        userId,
        name,
        description: description || null,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('Create subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

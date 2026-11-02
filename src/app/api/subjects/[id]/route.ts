import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const subject = await prisma.subject.findFirst({
      where: { id: params.id, userId },
      include: { photos: { orderBy: { createdAt: 'desc' } } },
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Get subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const existing = await prisma.subject.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const body = await request.json();
    const data: { name?: string; description?: string | null } = {};
    if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
    if (typeof body.description === 'string') data.description = body.description.trim() || null;

    const subject = await prisma.subject.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const existing = await prisma.subject.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    await prisma.subject.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete subject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

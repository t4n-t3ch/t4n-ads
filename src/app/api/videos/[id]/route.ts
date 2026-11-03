import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);
    const body = await request.json();

    const video = await prisma.video.findFirst({ where: { id: params.id, userId } });
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (typeof body.isOutro === 'boolean') {
      if (body.isOutro) {
        // Only one outro per account - unset any previous one first.
        await prisma.$transaction([
          prisma.video.updateMany({ where: { userId, isOutro: true }, data: { isOutro: false } }),
          prisma.video.update({ where: { id: video.id }, data: { isOutro: true } }),
        ]);
      } else {
        await prisma.video.update({ where: { id: video.id }, data: { isOutro: false } });
      }
    }

    const updated = await prisma.video.findUnique({ where: { id: video.id } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update video error:', error);
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

    const video = await prisma.video.findFirst({ where: { id: params.id, userId } });
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    await prisma.video.delete({ where: { id: video.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

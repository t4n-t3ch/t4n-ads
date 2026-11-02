import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const photo = await prisma.subjectPhoto.findFirst({
      where: { id: params.photoId, subjectId: params.id, subject: { userId } },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    await prisma.subjectPhoto.delete({ where: { id: photo.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete subject photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

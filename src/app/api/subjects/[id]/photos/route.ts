import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/actions/storage';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

const MAX_PHOTOS_PER_SUBJECT = 200;

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const subject = await prisma.subject.findFirst({
      where: { id: params.id, userId },
      include: { _count: { select: { photos: true } } },
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    if (subject._count.photos >= MAX_PHOTOS_PER_SUBJECT) {
      return NextResponse.json(
        { error: `A subject can have at most ${MAX_PHOTOS_PER_SUBJECT} photos` },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('photo') as File | null;
    const caption = (formData.get('caption') as string | null)?.trim() || null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Photo is required' }, { status: 400 });
    }

    const { url, error } = await uploadImage(file, 'videos', `subjects/${subject.id}`);
    if (error || !url) {
      return NextResponse.json({ error: error || 'Failed to upload photo' }, { status: 500 });
    }

    const photo = await prisma.subjectPhoto.create({
      data: { subjectId: subject.id, url, caption },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Upload subject photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const outro = await prisma.video.findFirst({
      where: { userId, isOutro: true },
      select: { id: true, title: true },
    });

    return NextResponse.json({ outro: outro || null });
  } catch (error) {
    console.error('Get outro video error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

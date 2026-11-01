import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [mine, household] = await Promise.all([
      prisma.video.aggregate({
        where: { userId: session.user.id, costCents: { not: null } },
        _sum: { costCents: true },
        _count: true,
      }),
      prisma.video.aggregate({
        where: { costCents: { not: null } },
        _sum: { costCents: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      myCents: mine._sum.costCents || 0,
      myVideoCount: mine._count,
      totalCents: household._sum.costCents || 0,
      totalVideoCount: household._count,
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}

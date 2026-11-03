import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

function parseDaysOfWeek(input: unknown): string | null {
  if (!Array.isArray(input)) return null;
  const days = input
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  if (days.length === 0) return null;
  return Array.from(new Set(days)).sort().join(',');
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const existing = await prisma.automation.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
    if (typeof body.enabled === 'boolean') data.enabled = body.enabled;
    if (typeof body.appendOutro === 'boolean') data.appendOutro = body.appendOutro;
    if (typeof body.promptTemplate === 'string') data.promptTemplate = body.promptTemplate.trim() || null;
    if (typeof body.styleGoal === 'string') data.styleGoal = body.styleGoal.trim() || null;
    if (typeof body.aspectRatio === 'string') data.aspectRatio = body.aspectRatio;
    if (body.duration !== undefined) data.duration = Number(body.duration) || 8;
    if (body.daysOfWeek !== undefined) {
      const parsed = parseDaysOfWeek(body.daysOfWeek);
      if (!parsed) {
        return NextResponse.json({ error: 'Pick at least one day of the week' }, { status: 400 });
      }
      data.daysOfWeek = parsed;
    }

    const automation = await prisma.automation.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(automation);
  } catch (error) {
    console.error('Update automation error:', error);
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

    const existing = await prisma.automation.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    await prisma.automation.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete automation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

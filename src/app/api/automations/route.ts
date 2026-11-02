import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/prisma';
import { isEmailAllowed } from '@/lib/allowlist';
import { resolveAccountUser } from '@/lib/accountAccess';
import type { Database } from '@/types/supabase';

const VALID_PROMPT_MODES = ['fixed', 'ai_varied'];

function parseDaysOfWeek(input: unknown): string | null {
  if (!Array.isArray(input)) return null;
  const days = input
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  if (days.length === 0) return null;
  return Array.from(new Set(days)).sort().join(',');
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const automations = await prisma.automation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { subject: { select: { id: true, name: true } } },
    });

    return NextResponse.json(automations);
  } catch (error) {
    console.error('List automations error:', error);
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
    if (!isEmailAllowed(session.user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const subjectId = body.subjectId as string;
    const promptMode = body.promptMode as string;
    const promptTemplate = (body.promptTemplate || '').trim();
    const styleGoal = (body.styleGoal || '').trim();
    const aspectRatio = body.aspectRatio || '16:9';
    const duration = Number(body.duration) || 8;
    const daysOfWeek = parseDaysOfWeek(body.daysOfWeek);

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!subjectId) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!VALID_PROMPT_MODES.includes(promptMode)) {
      return NextResponse.json({ error: 'Invalid prompt mode' }, { status: 400 });
    }
    if (promptMode === 'fixed' && !promptTemplate) {
      return NextResponse.json({ error: 'Prompt template is required for fixed mode' }, { status: 400 });
    }
    if (promptMode === 'ai_varied' && !styleGoal) {
      return NextResponse.json({ error: 'Style goal is required for AI-varied mode' }, { status: 400 });
    }
    if (!daysOfWeek) {
      return NextResponse.json({ error: 'Pick at least one day of the week' }, { status: 400 });
    }

    const { id: userId } = await resolveAccountUser(session.user);

    const subject = await prisma.subject.findFirst({
      where: { id: subjectId, userId },
    });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const automation = await prisma.automation.create({
      data: {
        userId,
        subjectId,
        name,
        promptMode,
        promptTemplate: promptMode === 'fixed' ? promptTemplate : null,
        styleGoal: promptMode === 'ai_varied' ? styleGoal : null,
        daysOfWeek,
        aspectRatio,
        duration,
      },
    });

    return NextResponse.json(automation, { status: 201 });
  } catch (error) {
    console.error('Create automation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

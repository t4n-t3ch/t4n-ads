import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submitVideoGeneration, generateVariedPrompt } from '@/services/videoGeneration';
import { VideoStatus } from '@/types';

export const maxDuration = 60;

function todayUTC(): { dateStr: string; dayOfWeek: number } {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const dayOfWeek = now.getUTCDay(); // 0 (Sun) - 6 (Sat)
  return { dateStr, dayOfWeek };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  if (authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dateStr, dayOfWeek } = todayUTC();

  const candidates = await prisma.automation.findMany({
    where: { enabled: true },
    include: { subject: true },
  });

  const due = candidates.filter((a) => {
    if (a.lastRunDate === dateStr) return false;
    const days = a.daysOfWeek.split(',').map(Number);
    return days.includes(dayOfWeek);
  });

  const origin =
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null;

  if (!origin) {
    return NextResponse.json({ error: 'Could not determine app origin' }, { status: 500 });
  }

  const callbackUrl = `${origin}/api/webhooks/openrouter-video`;
  const results: Array<{ automationId: string; status: string; error?: string }> = [];

  for (const automation of due) {
    try {
      let prompt: string;

      if (automation.promptMode === 'fixed') {
        prompt = automation.promptTemplate || '';
      } else {
        const generated = await generateVariedPrompt(
          automation.styleGoal || '',
          automation.subject.description || undefined
        );
        if (!generated.prompt) {
          results.push({ automationId: automation.id, status: 'skipped', error: generated.error });
          continue;
        }
        prompt = generated.prompt;
      }

      await prisma.user.upsert({
        where: { id: automation.userId },
        update: {},
        create: { id: automation.userId, email: '', credits: 100000 },
      });

      const video = await prisma.video.create({
        data: {
          userId: automation.userId,
          title: `[Auto] ${automation.name}`,
          prompt,
          aspectRatio: automation.aspectRatio,
          duration: automation.duration,
          status: VideoStatus.PROCESSING,
          progress: 0,
          subjectId: automation.subjectId,
        },
      });

      const result = await submitVideoGeneration(
        {
          prompt,
          aspectRatio: automation.aspectRatio as '16:9' | '9:16' | '1:1',
          duration: automation.duration,
          generateAudio: true,
          subjectContext: automation.subject.description || undefined,
        },
        callbackUrl
      );

      if (!result.success) {
        await prisma.video.update({
          where: { id: video.id },
          data: { status: VideoStatus.FAILED, error: result.error },
        });
        results.push({ automationId: automation.id, status: 'failed', error: result.error });
      } else {
        await prisma.video.update({ where: { id: video.id }, data: { jobId: result.jobId } });
        results.push({ automationId: automation.id, status: 'submitted' });
      }

      await prisma.automation.update({
        where: { id: automation.id },
        data: { lastRunDate: dateStr },
      });
    } catch (error) {
      results.push({
        automationId: automation.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({ ok: true, dateStr, dayOfWeek, checked: candidates.length, ran: results });
}

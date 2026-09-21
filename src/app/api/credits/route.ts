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

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: { email: session.user.email, supabaseId: session.user.id, credits: 10 },
      select: { credits: true },
    });

    return NextResponse.json({ success: true, credits: user.credits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: { email: session.user.email, supabaseId: session.user.id, credits: 10 },
      select: { id: true, credits: true },
    });

    if (user.credits < amount) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: amount,
        },
      },
      select: { credits: true },
    });

    // Create a transaction record
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: -amount,
        description: description || 'Credit deduction',
        balanceAfter: updatedUser.credits,
      },
    });

    return NextResponse.json({ 
      success: true, 
      newBalance: updatedUser.credits 
    });
  } catch (error) {
    console.error('Error deducting credits:', error);
    return NextResponse.json(
      { error: 'Failed to deduct credits' },
      { status: 500 }
    );
  }
}
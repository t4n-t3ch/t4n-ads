import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email || '' } })

  if (!user) {
    return NextResponse.json({ success: true, data: [] })
  }

  const studios = await prisma.studio.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { assets: true, videos: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, data: studios })
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, type, description, stylePrompt, aspectRatio } = body

  if (!name || !type) {
    return NextResponse.json({ error: 'name and type are required' }, { status: 400 })
  }

  const user = await prisma.user.upsert({
    where: { email: session.user.email || '' },
    update: {},
    create: {
      email: session.user.email || '',
      supabaseId: session.user.id,
      credits: 10,
    },
  })

  const studio = await prisma.studio.create({
    data: {
      userId: user.id,
      name,
      type,
      description: description || null,
      stylePrompt: stylePrompt || null,
      aspectRatio: aspectRatio || '9:16',
    },
  })

  return NextResponse.json({ success: true, data: studio }, { status: 201 })
}

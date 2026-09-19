import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const video = await prisma.video.findUnique({ where: { id: params.id } })

  if (!video || video.userId !== session.user.id || !video.videoUrl) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const upstream = await fetch(video.videoUrl, {
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
  })

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'video/mp4',
      'Cache-Control': 'private, max-age=3600',
    },
  })
}

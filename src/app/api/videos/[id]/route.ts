import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const video = await prisma.video.findUnique({ where: { id: params.id } })

  if (!video || video.userId !== session.user.id) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  await prisma.video.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}

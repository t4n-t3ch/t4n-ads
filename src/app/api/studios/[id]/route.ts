import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

async function getOwnedStudio(studioId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const studio = await prisma.studio.findUnique({ where: { id: studioId } })
  if (!studio || studio.userId !== user.id) return null

  return studio
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const studio = await prisma.studio.findFirst({
    where: { id: params.id, user: { email: session.user.email } },
    include: {
      assets: { orderBy: { createdAt: 'desc' } },
      videos: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!studio) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: studio })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owned = await getOwnedStudio(params.id, session.user.email)
  if (!owned) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  const body = await request.json()
  const { name, description, stylePrompt, aspectRatio, dailyGeneration, dailyPrompt } = body

  const studio = await prisma.studio.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(stylePrompt !== undefined && { stylePrompt }),
      ...(aspectRatio !== undefined && { aspectRatio }),
      ...(dailyGeneration !== undefined && { dailyGeneration }),
      ...(dailyPrompt !== undefined && { dailyPrompt }),
    },
  })

  return NextResponse.json({ success: true, data: studio })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owned = await getOwnedStudio(params.id, session.user.email)
  if (!owned) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  await prisma.studio.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}

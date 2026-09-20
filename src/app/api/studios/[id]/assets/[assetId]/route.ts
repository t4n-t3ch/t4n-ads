import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; assetId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  const asset = await prisma.studioAsset.findUnique({
    where: { id: params.assetId },
    include: { studio: true },
  })

  if (!asset || asset.studioId !== params.id || asset.studio.userId !== user.id) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
  }

  await prisma.studioAsset.delete({ where: { id: params.assetId } })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { prisma } from '@/lib/prisma'

const STUDIO_ASSETS_BUCKET = 'studio-assets'

async function getOwnedStudio(studioId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const studio = await prisma.studio.findUnique({ where: { id: studioId } })
  if (!studio || studio.userId !== user.id) return null

  return studio
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owned = await getOwnedStudio(params.id, session.user.email)
  if (!owned) {
    return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
  }

  const formData = await request.formData()
  const type = formData.get('type') as string | null
  const caption = (formData.get('caption') as string | null) || null

  if (type === 'link') {
    const url = formData.get('url') as string | null
    if (!url) {
      return NextResponse.json({ error: 'url is required for a link asset' }, { status: 400 })
    }

    const asset = await prisma.studioAsset.create({
      data: { studioId: params.id, type: 'link', url, caption },
    })
    return NextResponse.json({ success: true, data: asset }, { status: 201 })
  }

  if (type === 'image') {
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'file is required for an image asset' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${params.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(STUDIO_ASSETS_BUCKET)
      .upload(fileName, new Uint8Array(arrayBuffer), { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(STUDIO_ASSETS_BUCKET).getPublicUrl(fileName)

    const asset = await prisma.studioAsset.create({
      data: { studioId: params.id, type: 'image', url: urlData.publicUrl, caption },
    })
    return NextResponse.json({ success: true, data: asset }, { status: 201 })
  }

  return NextResponse.json({ error: 'type must be "image" or "link"' }, { status: 400 })
}

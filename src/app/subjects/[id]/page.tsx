'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, X } from 'lucide-react'

type SubjectPhoto = {
  id: string
  url: string
  caption: string | null
}

type SubjectDetail = {
  id: string
  name: string
  description: string | null
  photos: SubjectPhoto[]
}

const MAX_PHOTOS = 200

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [subject, setSubject] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch(`/api/subjects/${id}`)
      .then((res) => {
        if (res.status === 404) {
          router.push('/subjects')
          return null
        }
        return res.json()
      })
      .then((data: SubjectDetail | null) => {
        if (!data) return
        setSubject(data)
        setName(data.name)
        setDescription(data.description || '')
      })
      .catch(() => setError('Failed to load subject'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (id) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      load()
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSubject = async () => {
    if (!confirm(`Delete subject "${subject?.name}"? This also removes its saved photos.`)) return
    await fetch(`/api/subjects/${id}`, { method: 'DELETE' })
    router.push('/subjects')
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setUploadProgress({ done: 0, total: files.length })

    let failures = 0
    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData()
        formData.append('photo', files[i])
        const res = await fetch(`/api/subjects/${id}/photos`, { method: 'POST', body: formData })
        if (!res.ok) failures++
      } catch {
        failures++
      }
      setUploadProgress({ done: i + 1, total: files.length })
    }

    if (failures > 0) {
      setError(`${failures} of ${files.length} photo(s) failed to upload (archive may be at the ${MAX_PHOTOS}-photo limit)`)
    }
    setUploading(false)
    setUploadProgress(null)
    load()
  }

  const handleDeletePhoto = async (photoId: string) => {
    await fetch(`/api/subjects/${id}/photos/${photoId}`, { method: 'DELETE' })
    load()
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-gray-400">Loading...</div>
  }

  if (!subject) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/subjects" className="text-sm text-orange-400 hover:text-orange-300">
        ← Back to subjects
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex items-center justify-between">
              <Button type="submit" disabled={saving || !name.trim()}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <button
                type="button"
                onClick={handleDeleteSubject}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete subject
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Reference photos</CardTitle>
          <p className="text-sm text-gray-400">
            Up to {MAX_PHOTOS} photos - select a whole folder of screenshots/images at once. Used as
            style/content references when generating with this subject, and as the source archive for
            any automations tied to it.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subject.photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Subject photo'}
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {subject.photos.length < MAX_PHOTOS && (
              <label className="aspect-square border-2 border-dashed border-white/15 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/30 transition-colors">
                <Camera className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 text-center px-2">
                  {uploading
                    ? `Uploading ${uploadProgress?.done ?? 0}/${uploadProgress?.total ?? 0}...`
                    : 'Add photos'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

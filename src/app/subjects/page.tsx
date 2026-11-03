'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import AppNav from '@/components/AppNav'

type Subject = {
  id: string
  name: string
  description: string | null
  photoCount: number
  createdAt: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSubjects = () => {
    setLoading(true)
    fetch('/api/subjects')
      .then((res) => res.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError(null)

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create subject')
        return
      }

      setName('')
      setDescription('')
      loadSubjects()
    } catch (err) {
      setError('Failed to create subject')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Subjects</h1>
          <p className="text-sm text-gray-400">
            Save a name, description, and reference photos for a brand or topic. Select a subject
            when generating so the AI reuses that context automatically.
          </p>
        </div>
        <AppNav current="/subjects" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New subject</CardTitle>
          <CardDescription>e.g. &quot;T4N&quot; with your brand description and logo/product photos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="T4N"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="T4N is a black-and-orange developer tooling brand. Bold, modern, high-contrast..."
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? 'Creating...' : 'Create subject'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold text-white mb-3">Your subjects</h2>
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : subjects.length === 0 ? (
        <p className="text-sm text-gray-400">No subjects yet — create one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((s) => (
            <Link key={s.id} href={`/subjects/${s.id}`}>
              <Card className="hover:border-orange-500/40 transition-colors h-full">
                <CardHeader>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {s.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    {s.photoCount} photo{s.photoCount === 1 ? '' : 's'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AppHeader from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Studio = {
  id: string
  name: string
  type: string
  description: string | null
  aspectRatio: string
  dailyGeneration: boolean
  lastGeneratedAt: string | null
  _count: { assets: number; videos: number }
}

const TYPE_PRESETS = [
  { value: 'trading', label: 'Trading' },
  { value: 'ufc', label: 'UFC Shorts' },
  { value: 'custom', label: 'Custom' },
]

export default function StudiosPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'trading',
    description: '',
    stylePrompt: '',
    aspectRatio: '9:16',
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    fetchStudios()
  }, [user, authLoading, router])

  const fetchStudios = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/studios')
      const { data } = await res.json()
      setStudios(data || [])
    } catch (err) {
      setError('Failed to load studios')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/studios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to create studio')
      const { data } = await res.json()
      router.push(`/studios/${data.id}`)
    } catch (err) {
      setError('Failed to create studio')
      setCreating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Studios</h1>
            <p className="text-muted-foreground mt-1">
              Each studio is its own channel — its own reference material, style, and generation schedule.
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Studio'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Studio</CardTitle>
              <CardDescription>Set this up once, then generate videos for it whenever you like.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Studio name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Trading Channel"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_PRESETS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What this channel is about"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stylePrompt">Style guidance</Label>
                  <Textarea
                    id="stylePrompt"
                    placeholder="e.g. Fast-paced, tangerine/dark UI overlays, confident narrator tone, punchy captions"
                    value={form.stylePrompt}
                    onChange={(e) => setForm({ ...form, stylePrompt: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to every video generated in this studio, on top of whatever prompt you give it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspectRatio">Aspect ratio</Label>
                  <Select value={form.aspectRatio} onValueChange={(v) => setForm({ ...form, aspectRatio: v })}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:16">9:16 (Shorts / Reels)</SelectItem>
                      <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={creating || !form.name.trim()}>
                  {creating ? 'Creating...' : 'Create Studio'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {studios.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-xl border-border">
            <h3 className="text-xl font-semibold mb-2">No studios yet</h3>
            <p className="text-muted-foreground mb-6">
              Create one for each channel — e.g. a trading channel and a UFC shorts channel.
            </p>
            {!showForm && <Button onClick={() => setShowForm(true)}>+ New Studio</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Link key={studio.id} href={`/studios/${studio.id}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{studio.name}</CardTitle>
                      {studio.dailyGeneration && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Daily</span>
                      )}
                    </div>
                    <CardDescription>{studio.description || `${studio.type} studio`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{studio._count.assets} references</span>
                      <span>{studio._count.videos} videos</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}

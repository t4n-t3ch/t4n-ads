'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AppHeader from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Asset = {
  id: string
  type: string
  url: string
  caption: string | null
}

type StudioVideo = {
  id: string
  title: string
  status: string
  videoUrl: string | null
  createdAt: string
}

type Studio = {
  id: string
  name: string
  type: string
  description: string | null
  stylePrompt: string | null
  aspectRatio: string
  dailyGeneration: boolean
  dailyPrompt: string | null
  lastGeneratedAt: string | null
  assets: Asset[]
  videos: StudioVideo[]
}

export default function StudioDetailPage() {
  const params = useParams()
  const studioId = params.id as string
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [studio, setStudio] = useState<Studio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add-asset state
  const [linkUrl, setLinkUrl] = useState('')
  const [linkCaption, setLinkCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate-specific-video state
  const [prompt, setPrompt] = useState('')
  const [narration, setNarration] = useState('')
  const [selectedAssetId, setSelectedAssetId] = useState<string>('none')
  const [generating, setGenerating] = useState(false)
  const [genStatus, setGenStatus] = useState<{ status: string; videoUrl?: string; error?: string } | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Daily generation settings
  const [dailyGeneration, setDailyGeneration] = useState(false)
  const [dailyPrompt, setDailyPrompt] = useState('')
  const [savingDaily, setSavingDaily] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    fetchStudio()
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [user, authLoading, router, studioId])

  const fetchStudio = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/studios/${studioId}`)
      if (!res.ok) throw new Error('Studio not found')
      const { data } = await res.json()
      setStudio(data)
      setDailyGeneration(data.dailyGeneration)
      setDailyPrompt(data.dailyPrompt || '')
    } catch (err) {
      setError('Failed to load studio')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkUrl.trim()) return

    const formData = new FormData()
    formData.append('type', 'link')
    formData.append('url', linkUrl)
    if (linkCaption) formData.append('caption', linkCaption)

    const res = await fetch(`/api/studios/${studioId}/assets`, { method: 'POST', body: formData })
    if (res.ok) {
      setLinkUrl('')
      setLinkCaption('')
      fetchStudio()
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('type', 'image')
    formData.append('file', file)

    try {
      const res = await fetch(`/api/studios/${studioId}/assets`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      await fetchStudio()
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    await fetch(`/api/studios/${studioId}/assets/${assetId}`, { method: 'DELETE' })
    fetchStudio()
  }

  const startPolling = (videoId: string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/generate/status/${videoId}`)
      const data = await res.json()
      setGenStatus(data)
      if (data.status === 'completed' || data.status === 'failed') {
        if (pollRef.current) clearInterval(pollRef.current)
        setGenerating(false)
        fetchStudio()
      }
    }, 5000)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setGenerating(true)
    setGenStatus(null)
    try {
      const res = await fetch(`/api/studios/${studioId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          narration,
          assetId: selectedAssetId === 'none' ? undefined : selectedAssetId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenStatus({ status: 'failed', error: data.error })
        setGenerating(false)
        return
      }
      setGenStatus({ status: 'processing' })
      startPolling(data.videoId)
    } catch (err) {
      setGenStatus({ status: 'failed', error: 'Failed to start generation' })
      setGenerating(false)
    }
  }

  const handleSaveDaily = async () => {
    setSavingDaily(true)
    try {
      await fetch(`/api/studios/${studioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyGeneration, dailyPrompt }),
      })
      await fetchStudio()
    } finally {
      setSavingDaily(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!studio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{error || 'Studio not found'}</p>
      </div>
    )
  }

  const imageAssets = studio.assets.filter((a) => a.type === 'image')
  const linkAssets = studio.assets.filter((a) => a.type === 'link')

  return (
    <>
      <AppHeader />
      <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <button onClick={() => router.push('/studios')} className="text-sm text-primary hover:underline mb-2">
            ← All studios
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">{studio.name}</h1>
          <p className="text-muted-foreground mt-1">{studio.description || `${studio.type} studio`}</p>
        </div>

        {/* Reference assets */}
        <Card>
          <CardHeader>
            <CardTitle>Reference Material</CardTitle>
            <CardDescription>
              Screenshots, photos, or links this studio draws on when generating videos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              {imageAssets.map((asset) => (
                <div key={asset.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.caption || ''} className="w-28 h-28 object-cover rounded-lg border border-border" />
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-28 h-28 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm"
              >
                {uploading ? 'Uploading...' : '+ Add photo'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
            </div>

            {linkAssets.length > 0 && (
              <ul className="space-y-2">
                {linkAssets.map((asset) => (
                  <li key={asset.id} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2">
                    <a href={asset.url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                      {asset.caption || asset.url}
                    </a>
                    <button onClick={() => handleDeleteAsset(asset.id)} className="text-muted-foreground hover:text-destructive ml-2">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste a link (e.g. a fighter highlight clip)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Label (optional)"
                value={linkCaption}
                onChange={(e) => setLinkCaption(e.target.value)}
                className="sm:max-w-[200px]"
              />
              <Button type="submit" variant="outline" disabled={!linkUrl.trim()}>Add link</Button>
            </form>
          </CardContent>
        </Card>

        {/* Generate specific video */}
        <Card>
          <CardHeader>
            <CardTitle>Generate a Specific Video</CardTitle>
            <CardDescription>Describe what you want, optionally anchored to one of your reference photos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g. Turn this screenshot into a hype clip announcing my new breakout strategy"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="narration">Voiceover script (optional)</Label>
                <Textarea
                  id="narration"
                  placeholder="What the narrator should say. Leave blank to use the prompt above."
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Every video gets a voiceover, background music, and burned-in captions automatically.
                </p>
              </div>

              {imageAssets.length > 0 && (
                <div className="space-y-2">
                  <Label>Reference photo (optional)</Label>
                  <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {imageAssets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.caption || asset.url.split('/').pop()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" disabled={generating || !prompt.trim()}>
                {generating ? 'Generating...' : 'Generate Video'}
              </Button>
            </form>

            {genStatus?.status === 'processing' && (
              <div className="mt-6 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Generating your video... this can take a minute or two.</p>
              </div>
            )}

            {genStatus?.status === 'composing' && (
              <div className="mt-6 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Adding voiceover, music, and captions...</p>
              </div>
            )}

            {genStatus?.status === 'completed' && genStatus.videoUrl && (
              <div className="mt-6">
                <video src={genStatus.videoUrl} controls className="w-full rounded-lg" />
              </div>
            )}

            {genStatus?.status === 'failed' && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                Generation failed: {genStatus.error || 'Unknown error'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily generation */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Generation</CardTitle>
            <CardDescription>
              Automatically generate a new video for this studio every day, rotating through your reference photos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dailyGeneration}
                onChange={(e) => setDailyGeneration(e.target.checked)}
                className="w-5 h-5 accent-orange-500"
              />
              <span>Enable daily generation for this studio</span>
            </label>

            {dailyGeneration && (
              <div className="space-y-2">
                <Label htmlFor="dailyPrompt">Daily prompt template</Label>
                <Textarea
                  id="dailyPrompt"
                  placeholder="e.g. Summarize today's market move in an energetic 8-second clip"
                  value={dailyPrompt}
                  onChange={(e) => setDailyPrompt(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            {studio.lastGeneratedAt && (
              <p className="text-xs text-muted-foreground">
                Last auto-generated: {new Date(studio.lastGeneratedAt).toLocaleString()}
              </p>
            )}

            <Button onClick={handleSaveDaily} disabled={savingDaily} variant="outline">
              {savingDaily ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent videos */}
        {studio.videos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {studio.videos.map((video) => (
                  <li key={video.id} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2">
                    <span className="truncate">{video.title}</span>
                    <span className="text-muted-foreground capitalize">{video.status}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type VideoStatusResponse = {
  id: string
  status: string
  progress: number
  videoUrl?: string
  error?: string
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('8')
  const [loading, setLoading] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoStatusResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPolling = (id: string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate/status/${id}`)
        const data: VideoStatusResponse = await res.json()
        setStatus(data)
        if (data.status === 'completed' || data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current)
          setLoading(false)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setStatus(null)
    setVideoId(null)
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, duration: Number(duration) }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to start video generation')
        setLoading(false)
        return
      }

      setVideoId(data.videoId)
      setStatus({ id: data.videoId, status: 'processing', progress: 0 })
      startPolling(data.videoId)
    } catch (err) {
      setSubmitError('Failed to start video generation')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate AI Video Ad</CardTitle>
          <CardDescription>
            Describe the ad you want, and Veo 3.1 will generate it for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe your video ad *</Label>
              <Textarea
                id="prompt"
                placeholder="A sleek smartphone rotating on a marble pedestal, dramatic lighting, product reveal style..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                minLength={3}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Vertical / Shorts)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 seconds</SelectItem>
                    <SelectItem value="6">6 seconds</SelectItem>
                    <SelectItem value="8">8 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
              {loading ? 'Generating...' : 'Generate Video'}
            </Button>
          </form>

          {submitError && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          {status && status.status === 'processing' && (
            <div className="mt-6 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Generating your video with Veo 3.1... this can take a minute or two.
              </p>
            </div>
          )}

          {status && status.status === 'completed' && status.videoUrl && (
            <div className="mt-6">
              <video src={status.videoUrl} controls className="w-full rounded-lg" />
              <a
                href={status.videoUrl}
                download
                className="mt-3 inline-block text-sm text-orange-500 hover:text-orange-400"
              >
                Download video
              </a>
            </div>
          )}

          {status && status.status === 'failed' && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              Generation failed: {status.error || 'Unknown error'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

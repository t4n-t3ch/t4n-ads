'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UsageBadge from '@/components/UsageBadge'

type VideoStatusResponse = {
  id: string
  status: string
  progress: number
  videoUrl?: string
  error?: string
}

type SubjectSummary = {
  id: string
  name: string
  photoCount: number
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const fixId = searchParams.get('fix')
  const [isFixMode, setIsFixMode] = useState(false)
  const [fixNote, setFixNote] = useState('')
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('8')
  const [generateAudio, setGenerateAudio] = useState(true)
  const [subjects, setSubjects] = useState<SubjectSummary[]>([])
  const [subjectId, setSubjectId] = useState<string>('none')
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoStatusResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/subjects')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]))
  }, [])

  useEffect(() => {
    if (!fixId) return
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : []))
      .then((videos) => {
        const original = Array.isArray(videos) ? videos.find((v) => v.id === fixId) : null
        if (!original) return
        setPrompt(original.prompt || '')
        setAspectRatio(original.aspectRatio || '16:9')
        setDuration(String(original.duration || 8))
        setIsFixMode(true)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixId])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (referencePreview) URL.revokeObjectURL(referencePreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (referencePreview) URL.revokeObjectURL(referencePreview)
    setReferenceImage(file)
    setReferencePreview(file ? URL.createObjectURL(file) : null)
  }

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
      const finalPrompt =
        isFixMode && fixNote.trim()
          ? `${prompt}\n\nCorrection from a previous attempt: ${fixNote.trim()}`
          : prompt

      const formData = new FormData()
      formData.append('prompt', finalPrompt)
      formData.append('aspectRatio', aspectRatio)
      formData.append('duration', duration)
      formData.append('generateAudio', String(generateAudio))
      if (subjectId !== 'none') formData.append('subjectId', subjectId)
      if (referenceImage) formData.append('referenceImage', referenceImage)

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isFixMode ? 'Fix & Regenerate' : 'Generate AI Video Ad'}</CardTitle>
              <CardDescription>
                {isFixMode
                  ? "Reusing the original prompt — say what should be different this time, and we'll regenerate from scratch."
                  : 'Describe the ad you want, and Veo 3.1 will generate it for you.'}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <UsageBadge />
              <div className="flex gap-3">
                <Link href="/gallery" className="text-sm text-orange-400 hover:text-orange-300 whitespace-nowrap">
                  Gallery
                </Link>
                <Link href="/subjects" className="text-sm text-orange-400 hover:text-orange-300 whitespace-nowrap">
                  Manage subjects
                </Link>
                <Link href="/automations" className="text-sm text-orange-400 hover:text-orange-300 whitespace-nowrap">
                  Automations
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe your video ad *</Label>
              <Textarea
                id="prompt"
                placeholder="A sleek smartphone rotating on a marble pedestal, dramatic lighting, product reveal style... Describe any narration or dialogue you want spoken."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                minLength={3}
                rows={4}
              />
            </div>

            {isFixMode && (
              <div className="space-y-2">
                <Label htmlFor="fixNote">What should be different this time?</Label>
                <Textarea
                  id="fixNote"
                  placeholder="e.g. the end card said 'Link-UK' instead of 'Trade-Link-UK' - make sure the full name renders correctly"
                  value={fixNote}
                  onChange={(e) => setFixNote(e.target.value)}
                  rows={2}
                />
              </div>
            )}

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

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.photoCount} photo{s.photoCount === 1 ? '' : 's'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Applies the subject&apos;s saved description and reference photos to this generation.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceImage">Reference photo (optional)</Label>
              <input
                id="referenceImage"
                type="file"
                accept="image/*"
                onChange={handleReferenceImageChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-secondary file:text-white file:text-sm hover:file:bg-secondary/80"
              />
              {referencePreview && (
                <img src={referencePreview} alt="Reference preview" className="mt-2 h-24 rounded-md border border-white/10 object-cover" />
              )}
              <p className="text-xs text-gray-500">Used as the first frame Veo generates from.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="generateAudio"
                type="checkbox"
                checked={generateAudio}
                onChange={(e) => setGenerateAudio(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-orange-500"
              />
              <Label htmlFor="generateAudio" className="cursor-pointer">
                Generate audio (dialogue, narration, ambient sound described in your prompt)
              </Label>
            </div>

            <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
              {loading ? 'Generating...' : isFixMode ? 'Regenerate Video' : 'Generate Video'}
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

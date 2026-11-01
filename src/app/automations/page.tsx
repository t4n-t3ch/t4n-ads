'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SubjectSummary = {
  id: string
  name: string
  photoCount: number
}

type Automation = {
  id: string
  name: string
  promptMode: 'fixed' | 'ai_varied'
  promptTemplate: string | null
  styleGoal: string | null
  daysOfWeek: string
  aspectRatio: string
  duration: number
  enabled: boolean
  lastRunDate: string | null
  subject: { id: string; name: string }
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [subjects, setSubjects] = useState<SubjectSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [promptMode, setPromptMode] = useState<'fixed' | 'ai_varied'>('fixed')
  const [promptTemplate, setPromptTemplate] = useState('')
  const [styleGoal, setStyleGoal] = useState('')
  const [days, setDays] = useState<number[]>([1, 4]) // Mon + Thu by default
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('8')
  const [creating, setCreating] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/automations').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/subjects').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([autos, subs]) => {
        setAutomations(Array.isArray(autos) ? autos : [])
        setSubjects(Array.isArray(subs) ? subs : [])
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !subjectId || days.length === 0) return
    if (promptMode === 'fixed' && !promptTemplate.trim()) {
      setError('Prompt template is required for a fixed prompt')
      return
    }
    if (promptMode === 'ai_varied' && !styleGoal.trim()) {
      setError('Style goal is required for AI-varied prompts')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          subjectId,
          promptMode,
          promptTemplate,
          styleGoal,
          daysOfWeek: days,
          aspectRatio,
          duration: Number(duration),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create automation')
        return
      }
      setName('')
      setPromptTemplate('')
      setStyleGoal('')
      load()
    } catch {
      setError('Failed to create automation')
    } finally {
      setCreating(false)
    }
  }

  const toggleEnabled = async (automation: Automation) => {
    await fetch(`/api/automations/${automation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !automation.enabled }),
    })
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automation?')) return
    await fetch(`/api/automations/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Automations</h1>
          <p className="text-sm text-gray-400">
            Auto-generate a new video on a schedule, drawing from a subject&apos;s reference photo archive.
            Results land in the gallery like any other video.
          </p>
        </div>
        <Link href="/generate" className="text-sm text-orange-400 hover:text-orange-300 whitespace-nowrap">
          Back to generate
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New automation</CardTitle>
          <CardDescription>
            Add photos to a subject first (
            <Link href="/subjects" className="text-orange-400 hover:text-orange-300">
              Subjects
            </Link>
            ), then point an automation at it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Daily Trade-Link-UK ad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.photoCount} photo{s.photoCount === 1 ? '' : 's'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subjects.length === 0 && (
                <p className="text-xs text-gray-500">
                  No subjects yet —{' '}
                  <Link href="/subjects" className="text-orange-400 hover:text-orange-300">
                    create one and add photos
                  </Link>{' '}
                  first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Prompt</Label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={promptMode === 'fixed'}
                    onChange={() => setPromptMode('fixed')}
                  />
                  Same prompt every time
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={promptMode === 'ai_varied'}
                    onChange={() => setPromptMode('ai_varied')}
                  />
                  Let AI vary it each time
                </label>
              </div>

              {promptMode === 'fixed' ? (
                <Textarea
                  value={promptTemplate}
                  onChange={(e) => setPromptTemplate(e.target.value)}
                  placeholder="A short ad featuring this photo, Trade-Link-UK branding, cinematic lighting..."
                  rows={3}
                />
              ) : (
                <Textarea
                  value={styleGoal}
                  onChange={(e) => setStyleGoal(e.target.value)}
                  placeholder="Creative direction for the AI to riff on each run, e.g. 'short punchy ads showing tradespeople using the app on site'"
                  rows={3}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Days to run</Label>
              <div className="flex flex-wrap gap-2">
                {DAY_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      days.includes(i)
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">Checked once a day — pick every day for daily, or just the days you want.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 seconds</SelectItem>
                    <SelectItem value="6">6 seconds</SelectItem>
                    <SelectItem value="8">8 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={creating || !name.trim() || !subjectId}>
              {creating ? 'Creating...' : 'Create automation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold text-white mb-3">Your automations</h2>
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : automations.length === 0 ? (
        <p className="text-sm text-gray-400">No automations yet — create one above.</p>
      ) : (
        <div className="space-y-3">
          {automations.map((a) => (
            <Card key={a.id}>
              <CardContent className="py-4 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-sm text-gray-400">
                    {a.subject.name} • {a.promptMode === 'fixed' ? 'Fixed prompt' : 'AI-varied'} •{' '}
                    {a.daysOfWeek
                      .split(',')
                      .map((d) => DAY_LABELS[Number(d)])
                      .join('/')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {a.lastRunDate ? `Last ran ${a.lastRunDate}` : 'Not run yet'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleEnabled(a)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      a.enabled
                        ? 'border-green-600 text-green-400 hover:bg-green-600/10'
                        : 'border-gray-700 text-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    {a.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

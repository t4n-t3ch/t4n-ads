'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useCredits } from '@/hooks/useCredits'
import ProgressBar from '@/components/ProgressBar'
import StatusBadge from '@/components/StatusBadge'
import { VideoStatus } from '@/types'

const PROMPT_SUGGESTIONS = [
  "Create a 15-second ad for a new eco-friendly water bottle that highlights sustainability and modern design",
  "Generate a 30-second promotional video for a fitness app showing workout tracking and progress analytics",
  "Make a 10-second social media ad for a coffee shop with cozy atmosphere and artisanal brews",
  "Produce a 45-second explainer video for a project management tool with team collaboration features",
  "Create a 20-second fashion brand ad showcasing summer collection with vibrant colors and urban settings"
]

const ASPECT_RATIOS = [
  { value: '16:9', label: 'Landscape (16:9)', width: 320, height: 180 },
  { value: '9:16', label: 'Portrait (9:16)', width: 180, height: 320 },
  { value: '1:1', label: 'Square (1:1)', width: 240, height: 240 }
]

const STYLES = [
  { id: 'cinematic', label: 'Cinematic', description: 'Film-like quality with dramatic lighting' },
  { id: 'animated', label: 'Animated', description: 'Motion graphics and dynamic transitions' },
  { id: 'minimal', label: 'Minimal', description: 'Clean, simple design with focus on content' },
  { id: 'bold', label: 'Bold', description: 'Vibrant colors and strong typography' }
]

export default function GeneratePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { credits, refreshCredits } = useCredits()
  
  const [prompt, setPrompt] = useState('')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState(15)
  const [selectedStyle, setSelectedStyle] = useState('cinematic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<VideoStatus | null>(null)
  const [progress, setProgress] = useState(0)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])

  const startPolling = (id: string) => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate/status/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setGenerationStatus(data.video.status)
          setProgress(data.video.progress || 0)
          
          if (data.video.status === 'completed' && data.video.videoUrl) {
            setVideoUrl(data.video.videoUrl)
            setIsGenerating(false)
            clearInterval(interval)
            refreshCredits()
          } else if (data.video.status === 'failed') {
            setError('Video generation failed. Please try again.')
            setIsGenerating(false)
            clearInterval(interval)
          }
        }
      } catch (err) {
        console.error('Error polling status:', err)
      }
    }, 2000)

    setPollingInterval(interval)
  }

  const handleGenerate = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (credits < 1) {
      setError('Insufficient credits. Please purchase more credits.')
      return
    }

    setIsGenerating(true)
    setGenerationStatus('processing')
    setProgress(0)
    setVideoUrl(null)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio: selectedAspectRatio,
          duration,
          style: selectedStyle,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to start generation')
      }

      setVideoId(data.videoId)
      startPolling(data.videoId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      setIsGenerating(false)
      setGenerationStatus(null)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  const handleViewInGallery = () => {
    if (videoId) {
      router.push(`/gallery?highlight=${videoId}`)
    } else {
      router.push('/gallery')
    }
  }

  const handleNewGeneration = () => {
    setVideoId(null)
    setVideoUrl(null)
    setGenerationStatus(null)
    setProgress(0)
    setIsGenerating(false)
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Generate AI Video Ads
          </h1>
          <p className="text-gray-400 text-lg">
            Create stunning video ads in seconds with AI. Enter your prompt, customize settings, and generate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prompt Section */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Video Prompt</h2>
                <span className="text-sm text-gray-400">Required</span>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="w-full h-48 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Try these suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-6">Video Settings</h2>
              
              <div className="space-y-8">
                {/* Aspect Ratio */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Aspect Ratio</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setSelectedAspectRatio(ratio.value)}
                        disabled={isGenerating}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all",
                          selectedAspectRatio === ratio.value
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <div 
                            className="mb-2 border border-gray-600 bg-gray-700 rounded"
                            style={{ width: ratio.width, height: ratio.height }}
                          />
                          <span className="font-medium">{ratio.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Duration: {duration}s</h3>
                    <span className="text-sm text-gray-400">5-60 seconds</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    disabled={isGenerating}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>5s</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>

                {/* Style */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Style</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        disabled={isGenerating}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          selectedStyle === style.id
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        <div className="font-medium mb-1">{style.label}</div>
                        <div className="text-sm text-gray-400">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-8">
            {/* Preview */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              
              <div className="aspect-video bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center mb-4 overflow-hidden">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
                      <div className="text-4xl">🎬</div>
                    </div>
                    <p className="text-gray-400">
                      {isGenerating ? 'Generating preview...' : 'Video preview will appear here'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Aspect Ratio:</span>
                  <span className="font-medium">{selectedAspectRatio}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{duration}s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Style:</span>
                  <span className="font-medium capitalize">{selectedStyle}</span>
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="space-y-6">
                {/* Credits */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Your Credits:</span>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg">
                      <span className="font-bold text-orange-400">{credits}</span>
                    </div>
                    <button
                      onClick={() => router.push('/pricing')}
                      className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Buy more
                    </button>
                  </div>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cost per video:</span>
                  <span className="font-medium">1 credit</span>
                </div>

                {/* Status */}
                {generationStatus && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status:</span>
                      <StatusBadge status={generationStatus} />
                    </div>
                    {isGenerating && (
                      <ProgressBar
                        progress={progress}
                        label={`Generating... ${progress}%`}
                        variant="orange"
                        showAnimation
                      />
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {videoUrl ? (
                    <>
                      <button
                        onClick={handleViewInGallery}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        View in Gallery
                      </button>
                      <button
                        onClick={handleNewGeneration}
                        className="w-full py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
                      >
                        Create
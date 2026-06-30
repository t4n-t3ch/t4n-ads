'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { VideoStatus } from '@/types'

const PROMPT_SUGGESTIONS = [
  "Create a 15-second ad for a new eco-friendly water bottle that highlights durability and sustainability",
  "Generate a 30-second animated explainer video for a budgeting app with clean, modern visuals",
  "Make a 10-second Instagram story ad for a coffee subscription service with energetic music",
  "Produce a 45-second brand story video for a handmade skincare line with calming nature shots",
  "Create a 20-second TikTok-style ad for a fitness app showing quick workout transformations"
]

const STYLE_OPTIONS = [
  { id: 'cinematic', label: 'Cinematic', description: 'Film-like quality with dramatic lighting' },
  { id: 'animated', label: 'Animated', description: 'Motion graphics and smooth animations' },
  { id: 'minimal', label: 'Minimal', description: 'Clean, simple design with ample white space' },
  { id: 'bold', label: 'Bold', description: 'Vibrant colors and dynamic transitions' }
]

const ASPECT_RATIO_OPTIONS = [
  { id: '16:9', label: '16:9', description: 'Widescreen (YouTube, TV)', icon: '▭' },
  { id: '9:16', label: '9:16', description: 'Vertical (TikTok, Stories)', icon: '▯' },
  { id: '1:1', label: '1:1', description: 'Square (Instagram)', icon: '▢' }
]

export default function GeneratePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9')
  const [duration, setDuration] = useState(15)
  const [style, setStyle] = useState('cinematic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<VideoStatus>('draft')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGenerationId(null)
    setProgress(0)
    setStatus('processing')
    setVideoUrl(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
          style,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start generation')
      }

      const data = await response.json()
      setGenerationId(data.videoId)
      
      // Start polling for status
      pollGenerationStatus(data.videoId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setIsGenerating(false)
      setStatus('failed')
    }
  }

  const pollGenerationStatus = async (videoId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate/status/${videoId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch status')
        }

        const data = await response.json()
        setProgress(data.progress || 0)
        setStatus(data.status)

        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl)
          setIsGenerating(false)
          clearInterval(pollInterval)
        } else if (data.status === 'failed') {
          setError('Video generation failed')
          setIsGenerating(false)
          clearInterval(pollInterval)
        }
      } catch (err) {
        console.error('Polling error:', err)
        // Don't stop polling on transient errors
      }
    }, 2000)

    // Cleanup on unmount
    return () => clearInterval(pollInterval)
  }

  const handleViewInGallery = () => {
    if (generationId) {
      router.push(`/gallery?video=${generationId}`)
    } else {
      router.push('/gallery')
    }
  }

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = `t4n-ad-${generationId}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Generate AI Video Ad</h1>
          <p className="text-gray-400">Create professional video ads in seconds with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prompt Section */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Video Prompt</h2>
                <span className="text-sm text-gray-400">Describe your video</span>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Try these suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {suggestion.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Video Settings</h2>
              
              <div className="space-y-8">
                {/* Aspect Ratio */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Aspect Ratio</h3>
                    <span className="text-sm text-gray-400">Choose format</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {ASPECT_RATIO_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setAspectRatio(option.id as any)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          aspectRatio === option.id
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        )}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Duration</h3>
                    <span className="text-sm text-gray-400">{duration} seconds</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5s</span>
                      <span>15s</span>
                      <span>30s</span>
                      <span>45s</span>
                      <span>60s</span>
                    </div>
                  </div>
                </div>

                {/* Style */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Style</h3>
                    <span className="text-sm text-gray-400">Visual theme</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STYLE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setStyle(option.id)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          style === option.id
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        )}
                      >
                        <div className="font-medium mb-1">{option.label}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Preview & Actions */}
          <div className="space-y-8">
            {/* Preview */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              
              <div className={cn(
                'relative bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden mb-4',
                aspectRatio === '16:9' ? 'aspect-video' : '',
                aspectRatio === '9:16' ? 'aspect-[9/16]' : '',
                aspectRatio === '1:1' ? 'aspect-square' : ''
              )}>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-50">
                        {aspectRatio === '16:9' && '▭'}
                        {aspectRatio === '9:16' && '▯'}
                        {aspectRatio === '1:1' && '▢'}
                      </div>
                      <p className="text-gray-500">Preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Format:</span>
                  <span className="font-medium">{aspectRatio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{duration}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Style:</span>
                  <span className="font-medium capitalize">{style}</span>
                </div>
              </div>
            </div>

            {/* Generation Status */}
            {isGenerating && (
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Generating...</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className={cn(
                        'w-2 h-2 rounded-full animate-pulse',
                        status === 'processing' ? 'bg-orange-500' : '',
                        status === 'completed' ? 'bg-green-500' : '',
                        status === 'failed' ? 'bg-red-500' : ''
                      )} />
                      <span className="capitalize">{status}</span>
                    </div>
                    <p className="mt-2 text-gray-500 text-xs">
                      {status === 'processing' && 'AI is creating your video...'}
                      {status === 'completed' && 'Video ready!'}
                      {status === 'failed' && 'Generation failed'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all',
                  isGenerating
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
                )}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Generate Video'
                )}
              </button>

              {videoUrl && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleViewInGallery}
                    className="py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium transition-colors"
                  >
                    View in Gallery
                  </button>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Uses 1 credit per generation •{' '}
                  <a href="/pricing" className="text-orange-500 hover:text-orange-400">
                    View pricing
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
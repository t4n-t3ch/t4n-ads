'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'
import { X, Download, Share2, Copy, Check, ExternalLink } from 'lucide-react'

interface VideoModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleDownload = () => {
    if (!video?.videoUrl) return
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title || 'video'}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!video?.videoUrl) return
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title || 'AI Generated Video',
          text: 'Check out this AI-generated video ad!',
          url: video.videoUrl,
        })
      } else {
        await navigator.clipboard.writeText(video.videoUrl)
        setCopied(true)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const copyVideoUrl = async () => {
    if (!video?.videoUrl) return
    try {
      await navigator.clipboard.writeText(video.videoUrl)
      setCopied(true)
    } catch (error) {
      console.error('Error copying:', error)
    }
  }

  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{video.title || 'Untitled Video'}</h2>
            <p className="text-gray-400 mt-1">
              Created {formatDate(video.createdAt)}
              {video.duration && ` • ${formatDuration(video.duration)}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-6">
          <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
            {video.videoUrl ? (
              <>
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-full"
                  onLoadedData={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Video is still processing...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Metadata */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white">
                  {video.description || 'No description provided for this video.'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Prompt</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-300 font-mono text-sm">{video.prompt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        video.status === 'completed' ? 'bg-green-500' :
                        video.status === 'processing' ? 'bg-orange-500 animate-pulse' :
                        video.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <p className="text-white capitalize">{video.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Aspect Ratio</p>
                    <p className="text-white mt-1">{video.aspectRatio || '16:9'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Style</p>
                    <p className="text-white mt-1 capitalize">{video.style || 'cinematic'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Resolution</p>
                    <p className="text-white mt-1">{video.resolution || '1080p'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Video URL</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-lg p-3 overflow-hidden">
                    <p className="text-gray-300 text-sm truncate">
                      {video.videoUrl || 'Processing...'}
                    </p>
                  </div>
                  <button
                    onClick={copyVideoUrl}
                    disabled={!video.videoUrl}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Copy video URL"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <ExternalLink size={16} />
              <span className="text-sm">Video ID: {video.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                disabled={!video.videoUrl}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={handleDownload}
                disabled={!video.videoUrl || video.status !== 'completed'}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download size={18} />
                Download MP4
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
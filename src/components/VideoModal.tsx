'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/types'
import { formatDate, formatDuration, cn } from '@/lib/utils'
import { X, Download, Share2, Copy, Check, ExternalLink } from 'lucide-react'

interface VideoModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (id: string) => void
}

export default function VideoModal({ video, isOpen, onClose, onDelete }: VideoModalProps) {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !video) return null

  const handleCopyLink = async () => {
    if (!video.videoUrl) return
    
    try {
      await navigator.clipboard.writeText(video.videoUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    if (!video.videoUrl) return
    
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title || 'video'}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!video.videoUrl) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title || 'AI Generated Video',
          text: 'Check out this AI-generated video ad!',
          url: video.videoUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !video.id) return
    
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await onDelete(video.id)
        onClose()
      } catch (error) {
        console.error('Failed to delete video:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'processing':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-video'
      case '9:16':
        return 'aspect-[9/16]'
      case '1:1':
        return 'aspect-square'
      default:
        return 'aspect-video'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{video.title || 'Untitled Video'}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-medium border',
                getStatusColor(video.status)
              )}>
                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
              </span>
              <span className="text-gray-400 text-sm">
                Created {formatDate(video.createdAt)}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Player */}
          <div className="mb-6">
            <div className={cn(
              'relative rounded-xl overflow-hidden bg-gray-950',
              getAspectRatioClass(video.aspectRatio)
            )}>
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={video.thumbnailUrl || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400">Video is processing...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {video.progress || 0}% complete
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Prompt</h3>
                <p className="text-white bg-gray-800/50 rounded-lg p-4">
                  {video.prompt || 'No prompt provided'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Style</h3>
                <p className="text-white">{video.style || 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Duration</h3>
                  <p className="text-white">{formatDuration(video.duration)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Aspect Ratio</h3>
                  <p className="text-white">{video.aspectRatio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Resolution</h3>
                  <p className="text-white">{video.resolution || '1080p'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Size</h3>
                  <p className="text-white">
                    {video.fileSize ? `${(video.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown'}
                  </p>
                </div>
              </div>

              {video.tags && video.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                disabled={!video.videoUrl}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  video.videoUrl
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                )}
              >
                <Download className="w-4 h-4" />
                Download MP4
              </button>

              <button
                onClick={handleShare}
                disabled={!video.videoUrl}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  video.videoUrl
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                )}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <button
                onClick={handleCopyLink}
                disabled={!video.videoUrl}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  video.videoUrl
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {video.videoUrl && (
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
              )}

              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Video'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
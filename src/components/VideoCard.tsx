'use client'

import { Video, VideoStatus } from '@/types'
import { formatDate, formatDuration, cn } from '@/lib/utils'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void
  compact?: boolean
}

export default function VideoCard({ video, onDelete, compact = false }: VideoCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        onDelete(video.id)
      } else {
        console.error('Failed to delete video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDownload = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank')
    }
  }

  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case VideoStatus.COMPLETED:
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case VideoStatus.PROCESSING:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse'
      case VideoStatus.FAILED:
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case VideoStatus.DRAFT:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getAspectRatioBadge = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '16:9':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case '9:16':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case '1:1':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getThumbnailBg = () => {
    if (video.videoUrl && video.status === VideoStatus.COMPLETED) {
      return 'bg-gradient-to-br from-orange-500/10 to-purple-500/10'
    }
    return 'bg-gradient-to-br from-gray-800 to-gray-900'
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/80 hover:shadow-xl",
      compact ? "p-3" : "p-4"
    )}>
      {/* Thumbnail/Preview */}
      <div className={cn(
        "relative mb-3 overflow-hidden rounded-lg",
        getThumbnailBg(),
        compact ? "h-32" : "h-48"
      )}>
        {video.videoUrl && video.status === VideoStatus.COMPLETED ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="h-6 w-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                {video.status === VideoStatus.PROCESSING ? (
                  <svg className="h-5 w-5 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : video.status === VideoStatus.FAILED ? (
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {video.status === VideoStatus.PROCESSING ? 'Processing...' : 
                 video.status === VideoStatus.FAILED ? 'Failed' : 'No preview'}
              </p>
            </div>
          </div>
        )}
        
        {/* Status badge on thumbnail */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
            getStatusColor(video.status)
          )}>
            {video.status}
          </span>
        </div>
        
        {/* Aspect ratio badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
            getAspectRatioBadge(video.aspectRatio)
          )}>
            {video.aspectRatio}
          </span>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2">
          <span className="inline-flex items-center rounded-full bg-black/70 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm">
            {formatDuration(video.duration)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={compact ? "space-y-2" : "space-y-3"}>
        <div>
          <h3 className={cn(
            "font-medium text-gray-200 line-clamp-1",
            compact ? "text-sm" : "text-base"
          )}>
            {video.title || 'Untitled Video'}
          </h3>
          <p className={cn(
            "text-gray-500 line-clamp-2",
            compact ? "text-xs" : "text-sm"
          )}>
            {video.prompt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className={cn(
            "text-gray-500",
            compact ? "text-xs" : "text-sm"
          )}>
            {formatDate(video.createdAt)}
          </span>
          
          <div className="flex items-center space-x-2">
            {video.status === VideoStatus.COMPLETED && video.videoUrl && (
              <button
                onClick={handleDownload}
                className={cn(
                  "rounded-lg bg-orange-500/10 px-2 py-1 text-orange-500 transition-colors hover:bg-orange-500/20",
                  compact ? "text-xs" : "text-sm"
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            
            {onDelete && (
              <>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className={cn(
                    "rounded-lg bg-red-500/10 px-2 py-1 text-red-500 transition-colors hover:bg-red-500/20 disabled:opacity-50",
                    compact ? "text-xs" : "text-sm"
                  )}
                >
                  {isDeleting ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-gray-900 p-4 shadow-xl">
            <h3 className="mb-2 text-lg font-medium text-gray-200">Delete Video</h3>
            <p className="mb-4 text-sm text-gray-400">
              Are you sure you want to delete this video? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
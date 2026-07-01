"use client"

import { useState } from 'react'
import { Video, VideoStatus } from '@/types'
import { formatDate, formatDuration, truncate } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'

interface VideoCardProps {
  video: Video
  onDelete?: (id: string) => void
  onDownload?: (video: Video) => void
  onClick?: (video: Video) => void
  className?: string
}

export function VideoCard({ video, onDelete, onDownload, onClick, className }: VideoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(video.id)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDownload = () => {
    if (onDownload && video.status === VideoStatus.COMPLETED && video.videoUrl) {
      onDownload(video)
    }
  }

  const getAspectRatioClass = () => {
    switch (video.aspectRatio) {
      case '16:9': return 'aspect-video'
      case '9:16': return 'aspect-[9/16]'
      case '1:1': return 'aspect-square'
      default: return 'aspect-video'
    }
  }

  const getAspectRatioLabel = () => {
    switch (video.aspectRatio) {
      case '16:9': return '16:9'
      case '9:16': return '9:16'
      case '1:1': return '1:1'
      default: return video.aspectRatio
    }
  }

  return (
    <div className={cn(
      "group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10",
      className
    )}>
      {/* Thumbnail/Preview Area */}
      <div 
        className={cn(
          "relative cursor-pointer bg-gradient-to-br from-gray-900 to-black overflow-hidden",
          getAspectRatioClass()
        )}
        onClick={() => onClick?.(video)}
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-3 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">
                {video.status === VideoStatus.COMPLETED ? 'Click to preview' : 'No preview'}
              </p>
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-md text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Aspect Ratio Indicator */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded-md text-xs font-medium">
          {getAspectRatioLabel()}
        </div>

        {/* Status Overlay */}
        {video.status !== VideoStatus.COMPLETED && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <StatusBadge status={video.status} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-white truncate cursor-pointer hover:text-orange-400 transition-colors"
              onClick={() => onClick?.(video)}
            >
              {truncate(video.title, 50)}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {formatDate(video.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            {video.status === VideoStatus.COMPLETED && video.videoUrl && (
              <button
                onClick={handleDownload}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                title="Download video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                title="Delete video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium text-white mb-2">Delete Video</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{truncate(video.title, 30)}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard
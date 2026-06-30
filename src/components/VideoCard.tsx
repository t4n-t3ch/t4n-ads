'use client'

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

        {/* Status overlay */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={video.status} />
        </div>

        {/* Duration overlay */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-md">
            <span className="text-xs font-medium text-white">
              {formatDuration(video.duration)}
            </span>
          </div>
        )}

        {/* Aspect ratio badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-md">
          <span className="text-xs font-medium text-gray-300">
            {getAspectRatioLabel()}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClick?.(video)
              }}
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-white cursor-pointer hover:text-orange-400 transition-colors line-clamp-1"
            onClick={() => onClick?.(video)}
            title={video.title}
          >
            {truncate(video.title, 40)}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDate(video.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
          {video.description || 'No description provided'}
        </p>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={video.status !== VideoStatus.COMPLETED || !video.videoUrl}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                video.status === VideoStatus.COMPLETED && video.videoUrl
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 cursor-not-allowed"
              )}
              title={video.status === VideoStatus.COMPLETED ? "Download video" : "Video not available for download"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <button
              onClick={() => onClick?.(video)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              title="Preview video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>

          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                title="Delete video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
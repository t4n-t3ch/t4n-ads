'use client'

import { useState, useEffect, useCallback } from 'react'
import { Video, VideoStatus } from '@/types'

interface UseVideosReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteVideo: (id: string) => Promise<boolean>
  getVideoById: (id: string) => Video | undefined
}

export function useVideos(): UseVideosReturn {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/gallery')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`)
      }
      
      const data = await response.json()
      setVideos(data.videos || data)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError(err instanceof Error ? err.message : 'Failed to load videos')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVideo = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.status}`)
      }

      // Optimistically remove the video from state
      setVideos(prev => prev.filter(video => video.id !== id))
      
      return true
    } catch (err) {
      console.error('Error deleting video:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete video')
      return false
    }
  }, [])

  const getVideoById = useCallback((id: string): Video | undefined => {
    return videos.find(video => video.id === id)
  }, [videos])

  // Poll for updates on processing videos
  useEffect(() => {
    const processingVideos = videos.filter(v => v.status === VideoStatus.PROCESSING)
    
    if (processingVideos.length === 0) return

    const interval = setInterval(async () => {
      try {
        const updatedVideos = await Promise.all(
          processingVideos.map(async (video) => {
            const response = await fetch(`/api/generate/status/${video.id}`)
            if (!response.ok) return video
            
            const data = await response.json()
            return { ...video, ...data }
          })
        )

        setVideos(prev => 
          prev.map(video => {
            const updated = updatedVideos.find(uv => uv.id === video.id)
            return updated || video
          })
        )
      } catch (err) {
        console.error('Error polling video status:', err)
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval)
  }, [videos])

  // Initial fetch
  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos,
    deleteVideo,
    getVideoById,
  }
}
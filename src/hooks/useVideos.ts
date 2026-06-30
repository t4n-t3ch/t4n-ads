'use client'

import { useState, useEffect, useCallback } from 'react'
import { Video, VideoStatus } from '@/types'

interface UseVideosReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteVideo: (id: string) => Promise<boolean>
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
      setVideos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos')
      console.error('Error fetching videos:', err)
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

      // Remove the deleted video from state
      setVideos(prev => prev.filter(video => video.id !== id))
      return true
    } catch (err) {
      console.error('Error deleting video:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete video')
      return false
    }
  }, [])

  // Poll for updates on processing videos
  useEffect(() => {
    const processingVideos = videos.filter(v => v.status === VideoStatus.PROCESSING)
    
    if (processingVideos.length === 0) return

    const interval = setInterval(async () => {
      try {
        // Fetch fresh data for all processing videos
        const updatedVideos = await Promise.all(
          processingVideos.map(async (video) => {
            const response = await fetch(`/api/generate/status/${video.id}`)
            if (!response.ok) return video
            
            const data = await response.json()
            return { ...video, ...data }
          })
        )

        // Update only the processing videos in state
        setVideos(prev => 
          prev.map(video => {
            const updated = updatedVideos.find(u => u.id === video.id)
            return updated || video
          })
        )
      } catch (err) {
        console.error('Error polling video status:', err)
      }
    }, 2000) // Poll every 2 seconds

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
  }
}
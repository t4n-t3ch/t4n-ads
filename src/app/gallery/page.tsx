'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Video } from '@/types'
import { formatDate, formatDuration, cn } from '@/lib/utils'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import { useAuth } from '@/hooks/useAuth'

export default function GalleryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchVideos()
    }
  }, [user, authLoading, router])

  const fetchVideos = async () => {
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
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.status}`)
      }

      // Remove from local state
      setVideos(videos.filter(video => video.id !== videoId))
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(null)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete video')
      console.error('Error deleting video:', err)
    }
  }

  const handleDownload = async (video: Video) => {
    if (!video.videoUrl) {
      alert('Video is not ready for download yet.')
      return
    }

    try {
      const response = await fetch(video.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${video.title || 'video'}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading video:', err)
      alert('Failed to download video')
    }
  }

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true
    return video.status === filter
  })

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Video Gallery</h1>
          <p className="text-gray-400">
            Manage all your AI-generated video ads in one place
          </p>
        </div>

        {/* Stats and Filters */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{videos.length}</div>
                <div className="text-sm text-gray-400">Total Videos</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {videos.filter(v => v.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {videos.filter(v => v.status === 'processing').length}
                </div>
                <div className="text-sm text-gray-400">Processing</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {videos.filter(v => v.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                All Videos
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  filter === 'completed'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('processing')}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  filter === 'processing'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  filter === 'failed'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your videos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchVideos}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">No videos found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all'
                  ? "You haven't created any videos yet. Start generating your first AI video ad!"
                  : `No ${filter} videos found.`}
              </p>
              {filter === 'all' ? (
                <button
                  onClick={() => router.push('/generate')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                >
                  Create Your First Video
                </button>
              ) : (
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  View All Videos
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={setSelectedVideo}
                  onDelete={handleDeleteVideo}
                  onDownload={handleDownload}
                  deleteConfirmId={deleteConfirm}
                  onDeleteConfirm={setDeleteConfirm}
                />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="text-center text-gray-400 text-sm">
              Showing {filteredVideos.length} of {videos.length} videos
              {filter !== 'all' && ` (filtered by ${filter})`}
            </div>
          </>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  )
}
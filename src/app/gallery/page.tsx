'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Video } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useVideos } from '@/hooks/useVideos'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import { FiVideo, FiFilter, FiSearch, FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi'

export default function GalleryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { videos, loading, error, refetch, deleteVideo } = useVideos()
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = searchQuery === '' || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || video.status === statusFilter
      const matchesAspectRatio = aspectRatioFilter === 'all' || video.aspectRatio === aspectRatioFilter
      
      return matchesSearch && matchesStatus && matchesAspectRatio
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'duration':
          return b.duration - a.duration
        default:
          return 0
      }
    })

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return
    }
    
    setIsDeleting(videoId)
    try {
      await deleteVideo(videoId)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDownload = (video: Video) => {
    if (video.videoUrl) {
      const link = document.createElement('a')
      link.href = video.videoUrl
      link.download = `${video.title.replace(/\s+/g, '-')}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getStats = () => {
    const total = videos.length
    const completed = videos.filter(v => v.status === 'completed').length
    const processing = videos.filter(v => v.status === 'processing').length
    const failed = videos.filter(v => v.status === 'failed').length
    
    return { total, completed, processing, failed }
  }

  const stats = getStats()

  if (authLoading) {
    return null // Will be handled by loading.tsx
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Video Gallery</h1>
              <p className="text-gray-400">
                Manage and view all your AI-generated video ads
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={loading}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
                  loading
                    ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                )}
              >
                <FiRefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => router.push('/generate')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Create New Video
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Videos</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-500">{stats.processing}</div>
              <div className="text-sm text-gray-400">Processing</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search videos by title or prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={aspectRatioFilter}
                onChange={(e) => setAspectRatioFilter(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Aspect Ratios</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">Error loading videos: {error}</div>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50 mb-6">
              <FiVideo className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || aspectRatioFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Create your first AI video ad to get started'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setAspectRatioFilter('all')
                router.push('/generate')
              }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Video
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Showing {filteredVideos.length} of {videos.length} videos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                  onDelete={() => handleDeleteVideo(video.id)}
                  onDownload={() => handleDownload(video)}
                  isDeleting={isDeleting === video.id}
                />
              ))}
            </div>
          </>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedVideo(null)
            }}
            onDelete={() => {
              handleDeleteVideo(selectedVideo.id)
              setIsModalOpen(false)
              setSelectedVideo(null)
            }}
            onDownload={() => handleDownload(selectedVideo)}
          />
        )}
      </div>
    </div>
  )
}
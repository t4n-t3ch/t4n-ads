"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Video } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useVideos } from '@/hooks/useVideos'
import VideoCard from '@/components/VideoCard'
import VideoModal from '@/components/VideoModal'
import { FiVideo, FiFilter, FiSearch, FiTrash2, FiRefreshCw } from 'react-icons/fi'

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error loading videos</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiVideo className="text-orange-500" />
              Video Gallery
            </h1>
            <p className="text-gray-400 mt-2">
              {stats.total} total videos • {stats.completed} completed • {stats.processing} processing • {stats.failed} failed
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition"
            >
              <FiRefreshCw />
              Refresh
            </button>
            <button
              onClick={() => router.push('/generate')}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
            >
              Generate New Video
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Aspect Ratio Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Aspect Ratio</label>
            <select
              value={aspectRatioFilter}
              onChange={(e) => setAspectRatioFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Ratios</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration">Duration (Longest)</option>
            </select>
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <FiVideo className="text-6xl text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No videos found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all' || aspectRatioFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Generate your first video to get started'}
            </p>
            <button
              onClick={() => router.push('/generate')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
            >
              Generate Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
                onDelete={() => handleDeleteVideo(video.id)}
                onDownload={() => handleDownload(video)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={() => {
            handleDeleteVideo(selectedVideo.id)
            setIsModalOpen(false)
          }}
          onDownload={() => handleDownload(selectedVideo)}
        />
      )}
    </div>
  )
}
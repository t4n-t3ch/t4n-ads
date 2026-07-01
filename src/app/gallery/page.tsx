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
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition

Write the complete fixed file contents.
RULES:
- Output ONLY the raw file content
- First line must be the file path as a comment: // src/app/gallery/page.tsx
- No markdown, no backticks, no explanations
- "use client" MUST be written with double quotes exactly as: "use client" — never without quotes
- Make the minimal change needed to resolve the specific issue — do not restructure, rename, or rewrite unrelated parts of the file
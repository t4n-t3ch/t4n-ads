'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { VideoStatus } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useCredits } from '@/hooks/useCredits'
import { useVideos } from '@/hooks/useVideos'
import CreditsBadge from '@/components/CreditsBadge'
import StatusBadge from '@/components/StatusBadge'
import ProgressBar from '@/components/ProgressBar'

interface DashboardStats {
  totalVideos: number
  completedVideos: number
  processingVideos: number
  storageUsed: number
}

interface UserProfile {
  email: string
  credits: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { credits, loading: creditsLoading, refetch: refetchCredits } = useCredits()
  const { videos, loading: videosLoading, refetch: refetchVideos } = useVideos()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    completedVideos: 0,
    processingVideos: 0,
    storageUsed: 0
  })
  const [recentVideos, setRecentVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Fetch user profile
        const profileRes = await fetch('/api/user/profile')
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setProfile(profileData)
        }
        
        // Calculate stats from videos
        const totalVideos = videos.length
        const completedVideos = videos.filter(v => v.status === VideoStatus.COMPLETED).length
        const processingVideos = videos.filter(v => v.status === VideoStatus.PROCESSING).length
        const storageUsed = videos.reduce((acc, video) => acc + (video.fileSize || 0), 0)
        
        setStats({
          totalVideos,
          completedVideos,
          processingVideos,
          storageUsed: Math.round(storageUsed / (1024 * 1024) * 100) / 100 // Convert to MB
        })
        
        // Get recent videos (last 5)
        const sortedVideos = [...videos]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        
        setRecentVideos(sortedVideos)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (!videosLoading && !creditsLoading) {
      fetchDashboardData()
    }
  }, [user, videos, videosLoading, creditsLoading])

  const handleTopUpCredits = () => {
    router.push('/pricing')
  }

  const handleCreateVideo = () => {
    router.push('/generate')
  }

  const handleBrowseTemplates = () => {
    router.push('/templates')
  }

  const handleViewGallery = () => {
    router.push('/gallery')
  }

  const handleVideoClick = (videoId: string) => {
    router.push(`/gallery?video=${videoId}`)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {profile?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-400">
            Here&apos;s what&apos;s happening with your video ads
          </p>
        </div>

        {/* Credits Balance */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Credits</h2>
              <p className="text-gray-400">
                Use credits to generate AI video ads. Each video costs 1 credit.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <CreditsBadge />
              <button
                onClick={handleTopUpCredits}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Top Up Credits
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Videos</h3>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.totalVideos}</p>
            <p className="text-gray-400 text-sm mt-2">All time videos created</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Completed</h3>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.completedVideos}</p>
            <p className="text-gray-400 text-sm mt-2">Ready to use videos</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Processing</h3>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.processingVideos}</p>
            <p className="text-gray-400 text-sm mt-2">Currently generating</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Storage Used</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.storageUsed} MB</p>
            <p className="text-gray-400 text-sm mt-2">Total video storage</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleCreateVideo}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-orange-500 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-orange-500/10 rounded-lg mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Create New Video</h3>
                <p className="text-gray-400 text-sm">Generate a new AI video ad</p>
              </div>
            </button>

            <button
              onClick={handleBrowseTemplates}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-purple-500/10 rounded-lg mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Browse Templates</h3>
                <p className="text-gray-400 text-sm">Start from a pre-made template</p>
              </div>
            </button>

            <button
              onClick={handleViewGallery}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-500/10 rounded-lg mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">View Gallery</h3>
                <p className="text-gray-400 text-sm">See all your generated videos</p>
              </div>
            </button>

            <button
              onClick={handleTopUpCredits}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-green-500 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-green-500/10 rounded-lg mb-4 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9
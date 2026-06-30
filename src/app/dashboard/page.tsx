'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Video, VideoStatus } from '@/types'
import { formatDate, formatDuration, cn } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import ProgressBar from '@/components/ProgressBar'

interface UserProfile {
  email: string
  credits: number
}

interface DashboardStats {
  totalVideos: number
  completedVideos: number
  processingVideos: number
  storageUsed: number // in MB
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentVideos, setRecentVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user profile
      const profileRes = await fetch('/api/user/profile')
      if (!profileRes.ok) throw new Error('Failed to fetch profile')
      const profileData = await profileRes.json()
      setProfile(profileData)

      // Fetch recent videos
      const videosRes = await fetch('/api/gallery')
      if (!videosRes.ok) throw new Error('Failed to fetch videos')
      const videosData = await videosRes.json()
      setRecentVideos(videosData.slice(0, 5))

      // Calculate stats from videos
      const totalVideos = videosData.length
      const completedVideos = videosData.filter((v: Video) => v.status === VideoStatus.COMPLETED).length
      const processingVideos = videosData.filter((v: Video) => v.status === VideoStatus.PROCESSING).length
      
      // Calculate storage used (rough estimate: 10MB per completed video)
      const storageUsed = completedVideos * 10

      setStats({
        totalVideos,
        completedVideos,
        processingVideos,
        storageUsed
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTopUp = () => {
    router.push('/pricing')
  }

  const handleCreateVideo = () => {
    router.push('/generate')
  }

  const handleViewGallery = () => {
    router.push('/gallery')
  }

  const handleViewTemplates = () => {
    router.push('/templates')
  }

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
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
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Credits Balance</h2>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-orange-500">
                  {profile?.credits || 0}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  (profile?.credits || 0) < 10 
                    ? "bg-red-900/30 text-red-300 border border-red-700"
                    : "bg-green-900/30 text-green-300 border border-green-700"
                )}>
                  {(profile?.credits || 0) < 10 ? 'Low Balance' : 'Good Standing'}
                </div>
              </div>
              <p className="text-gray-400 mt-2">
                Each video generation uses 1 credit. Get more credits to continue creating.
              </p>
            </div>
            <button
              onClick={handleTopUp}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
            >
              Top Up Credits
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Videos"
            value={stats?.totalVideos || 0}
            icon="🎬"
            color="blue"
            description="All videos created"
          />
          <StatCard
            title="Completed"
            value={stats?.completedVideos || 0}
            icon="✅"
            color="green"
            description="Ready to use"
          />
          <StatCard
            title="Processing"
            value={stats?.processingVideos || 0}
            icon="⚙️"
            color="orange"
            description="In progress"
          />
          <StatCard
            title="Storage Used"
            value={`${stats?.storageUsed || 0} MB`}
            icon="💾"
            color="purple"
            description="Video storage"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Create New Video"
              description="Generate a new AI video ad"
              icon="✨"
              buttonText="Start Creating"
              onClick={handleCreateVideo}
              gradient="from-orange-600 to-orange-700"
            />
            <QuickActionCard
              title="Browse Templates"
              description="Start from a pre-made template"
              icon="📋"
              buttonText="View Templates"
              onClick={handleViewTemplates}
              gradient="from-blue-600 to-blue-700"
            />
            <QuickActionCard
              title="View Gallery"
              description="See all your generated videos"
              icon="📁"
              buttonText="Open Gallery"
              onClick={handleViewGallery}
              gradient="from-purple-600 to-purple-700"
            />
          </div>
        </div>

        {/* Recent Videos */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Videos</h2>
            <Link
              href="/gallery"
              className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentVideos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">No Videos Yet</h3>
              <p className="text-gray-400 mb-6">Create your first AI video ad to get started</p>
              <button
                onClick={handleCreateVideo}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
              >
                Create Your First Video
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVideos.map((video) => (
                    <tr key={video.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-gray-400">{video.aspectRatio}</div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={video.status} />
                      </td>
                      <td className="py-3 px-4">
                        {formatDuration(video.duration)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(video.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {video.status === VideoStatus.COMPLETED && video.videoUrl && (
                            <Link
                              href={video.videoUrl}
                              target="_blank"
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                            >
                              View
                            </Link>
                          )}
                          <Link
                            href={`/gallery?video=${video.id}`}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {stats?.processingVideos && stats.processingVideos > 0 && (
          <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Processing Videos</h2>
            <div className="space-y-4">
              {recentVideos
                .filter(v => v.status === VideoStatus.PROCESSING)
                .map(video => (
                  <div key={video.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{video.title}</div>
                      <div className="text-sm text-gray-400">{video.progress || 0}%</div>
                    </div>
                    <ProgressBar
                      value={video.progress || 0}
                      max={100}
                      label={`Processing ${video.title}`}
                      showPercentage={false}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple'
  description: string
}

function StatCard({ title, value, icon, color, description }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
    purple: 'from-purple-600 to-purple-700'
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-2xl font-bold">{typeof value === 'number' && value > 99 ? '99+' : value}</span>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: string
  buttonText: string
  onClick: () => void
  gradient: string
}

function QuickActionCard({ title, description, icon, buttonText, onClick, gradient }: QuickActionCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <button
        onClick={onClick}
        className={`w-full py-3 bg-gradient-to-r ${gradient} hover:opacity-90 rounded-lg font-medium transition-all active:scale-95`}
      >
        {buttonText}
      </button>
    </div>
  )
}
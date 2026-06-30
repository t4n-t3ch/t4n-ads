'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Template } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default function TemplatesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>(['all'])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    fetchTemplates()
  }, [user, authLoading, router])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`)
      }
      
      const data = await response.json()
      setTemplates(data)
      setFilteredTemplates(data)
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(data.map((t: Template) => t.category))]
      setCategories(uniqueCategories as string[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredTemplates(templates)
    } else {
      setFilteredTemplates(templates.filter(t => t.category === category))
    }
  }

  const handleUseTemplate = (template: Template) => {
    router.push(`/generate?template=${template.id}`)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'social':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'product':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'testimonial':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'brand':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'explainer':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getAspectRatioBadge = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '16:9':
        return 'bg-gray-800 text-gray-300'
      case '9:16':
        return 'bg-gray-800 text-gray-300'
      case '1:1':
        return 'bg-gray-800 text-gray-300'
      default:
        return 'bg-gray-800 text-gray-300'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="flex gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-800 rounded-lg w-24"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-900 rounded-xl p-6">
                  <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-800 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Templates</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={fetchTemplates}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video Templates</h1>
          <p className="text-gray-400">
            Choose from professionally designed templates to create stunning video ads in seconds
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={cn(
                'px-4 py-2 rounded-lg border transition-all duration-200',
                selectedCategory === category
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
              )}
            >
              {category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">Try selecting a different category</p>
            <button
              onClick={() => handleCategoryFilter('all')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Show All Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Template Preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">
                      {template.category === 'social' && '📱'}
                      {template.category === 'product' && '🛍️'}
                      {template.category === 'testimonial' && '⭐'}
                      {template.category === 'brand' && '🏢'}
                      {template.category === 'explainer' && '🎯'}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium border',
                      getCategoryColor(template.category)
                    )}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getAspectRatioBadge(template.aspectRatio)
                    )}>
                      {template.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                    <span className="text-sm text-gray-400">{template.duration}s</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags && template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {template.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {template.uses || 0} uses
                      </span>
                    </div>
                    <span className="text-orange-500 font-medium">
                      {template.creditsRequired || 1} credit
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-orange-500 text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
              <p className="text-gray-400 text-sm">
                Select a template, customize with your content, and generate in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-white mb-2">Fully Customizable</h3>
              <p className="text-gray-400 text-sm">
                Modify colors, text, and media to match your brand identity
              </p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 text-3xl mb-3">💾</div>
              <h3 className="text-lg font-semibold text-white mb-2">Save & Reuse</h3>
              <p className="text-gray-400 text-sm">
                Save your favorite templates for future projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
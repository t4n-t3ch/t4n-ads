'use client'

import { cn } from '@/lib/utils'

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
            >
              <div className="h-4 w-20 bg-gray-700 rounded-lg animate-pulse mb-2"></div>
              <div className="h-8 w-16 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-800 rounded-lg animate-pulse ml-auto"></div>
        </div>

        {/* Video grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden",
                "border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300",
                "animate-pulse"
              )}
            >
              {/* Thumbnail skeleton */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                </div>
              </div>

              {/* Content skeleton */}
              <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-700 rounded-lg mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded-lg mb-4"></div>

                {/* Metadata skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-12 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-700 rounded-lg"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
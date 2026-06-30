'use client'

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-800 rounded animate-pulse"></div>
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
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden animate-pulse"
            >
              {/* Thumbnail skeleton */}
              <div className="aspect-video bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 border-4 border-gray-700"></div>
                </div>
              </div>

              {/* Content skeleton */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 w-32 bg-gray-800 rounded"></div>
                  <div className="h-6 w-20 bg-gray-800 rounded-full"></div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-gray-800 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-12 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-800 rounded-lg"></div>
                    <div className="h-8 w-8 bg-gray-800 rounded-lg"></div>
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
          <div className="h-10 w-20 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { cn } from '@/lib/utils'

export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse mb-4"></div>
          <div className="h-4 w-96 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prompt input skeleton */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="h-6 w-32 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="h-32 bg-gray-900 rounded-xl animate-pulse mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-900 rounded-lg animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Aspect ratio selector skeleton */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="h-6 w-40 bg-gray-700 rounded-lg animate-pulse mb-6"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-gray-900 rounded-xl animate-pulse border-2 border-gray-700"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Duration slider skeleton */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="h-6 w-32 bg-gray-700 rounded-lg animate-pulse mb-6"></div>
              <div className="h-2 bg-gray-900 rounded-full animate-pulse mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-gray-900 rounded-lg animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-900 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Style selector skeleton */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="h-6 w-32 bg-gray-700 rounded-lg animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-900 rounded-xl animate-pulse border border-gray-700"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Generate button skeleton */}
            <div className="h-14 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl animate-pulse border border-gray-700"></div>
          </div>

          {/* Right column - Preview skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-40 bg-gray-700 rounded-lg animate-pulse mb-6"></div>
                
                {/* Video preview skeleton */}
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl animate-pulse mb-6 border-2 border-gray-700 flex items-center justify-center">
                  <div className="h-16 w-16 bg-gray-800 rounded-full animate-pulse"></div>
                </div>

                {/* Progress bar skeleton */}
                <div className="space-y-4">
                  <div className="h-2 bg-gray-900 rounded-full animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-900 rounded-lg animate-pulse"></div>
                </div>

                {/* Stats skeleton */}
                <div className="mt-8 pt-6 border-t border-gray-700 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="h-4 w-24 bg-gray-900 rounded-lg animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-900 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Credits skeleton */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="h-6 w-32 bg-gray-900 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-8 w-24 bg-gradient-to-r from-gray-900 to-black rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Tips skeleton */}
              <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-24 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="h-5 w-5 bg-gray-900 rounded-full animate-pulse mt-1"></div>
                      <div className="h-4 flex-1 bg-gray-900 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <div className="h-2 w-64 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full animate-pulse mb-4"></div>
          <div className="h-4 w-48 bg-gray-900 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
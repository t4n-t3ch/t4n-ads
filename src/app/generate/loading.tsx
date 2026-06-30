'use client'

export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Prompt and settings skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prompt section skeleton */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <div className="h-6 w-48 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-32 bg-gray-900 rounded-xl animate-pulse"></div>
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
            </div>

            {/* Settings grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aspect ratio skeleton */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-40 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-video bg-gray-900 rounded-lg animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Duration skeleton */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-32 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-900 rounded-full animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-12 bg-gray-900 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-900 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Style selector skeleton */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-36 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-900 rounded-lg animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Credits skeleton */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-28 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-900 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-900 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Preview skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="h-6 w-40 bg-gray-700 rounded-lg animate-pulse mb-6"></div>
                
                {/* Preview area skeleton */}
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl mb-6 flex items-center justify-center animate-pulse">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-gray-800 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Generate button skeleton */}
                <div className="h-12 bg-gray-900 rounded-xl animate-pulse mb-4"></div>

                {/* Progress bar skeleton */}
                <div className="space-y-3">
                  <div className="h-2 bg-gray-900 rounded-full animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-900 rounded animate-pulse"></div>
                </div>

                {/* Tips skeleton */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="h-5 w-32 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-900 rounded animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent videos skeleton */}
        <div className="mt-12">
          <div className="h-6 w-48 bg-gray-800 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800/30 rounded-xl p-4 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="aspect-video bg-gray-900 rounded-lg mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-900 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-900 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
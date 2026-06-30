'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-transparent border-r-transparent border-b-transparent border-l-orange-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-white animate-pulse">
            Loading T4N Ads
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Preparing your AI video generation experience...
          </p>
          
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mt-6">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 animate-loading-bar"></div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes loading-bar {
            0% {
              width: 0%;
              transform: translateX(-100%);
            }
            50% {
              width: 100%;
              transform: translateX(0%);
            }
            100% {
              width: 0%;
              transform: translateX(100%);
            }
          }
          
          .animate-loading-bar {
            animation: loading-bar 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  )
}
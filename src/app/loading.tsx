'use client'

import { cn } from '@/lib/utils'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-4 border-gray-800 border-t-orange-500 animate-spin"></div>
        
        {/* Middle ring */}
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full border-4 border-gray-800 border-r-orange-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner ring */}
        <div className="absolute top-12 left-12 w-8 h-8 rounded-full border-4 border-gray-800 border-b-orange-300 animate-spin" style={{ animationDuration: '1s' }}></div>
        
        {/* Center dot */}
        <div className="absolute top-14 left-14 w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 animate-pulse"></div>
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          T4N Ads
        </h1>
        
        <div className="space-y-2">
          <p className="text-gray-300 font-medium">Loading your experience...</p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full bg-gray-700",
                  "animate-pulse"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Loading stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
          {[
            { label: 'AI Models', value: 'Ready' },
            { label: 'Templates', value: 'Loading' },
            { label: 'Assets', value: 'Preparing' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800"
            >
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="mt-1 text-sm font-medium text-gray-300">
                {stat.value}
              </div>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-full",
                    "animate-pulse"
                  )}
                  style={{
                    animationDelay: `${index * 0.3}s`,
                    width: stat.value === 'Ready' ? '100%' : '60%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Tips */}
        <div className="mt-8 max-w-md">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Pro Tip
          </div>
          <div className="text-sm text-gray-400 italic">
            {[
              "Use specific prompts for better video results",
              "Try different aspect ratios for each platform",
              "Save your favorite templates for quick reuse"
            ][Math.floor(Date.now() / 3000) % 3]}
          </div>
        </div>
      </div>
    </div>
  )
}
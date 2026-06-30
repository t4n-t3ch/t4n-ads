'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Error code */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold tracking-tighter bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          You&apos;ll be redirected to the homepage in{' '}
          <span className="text-orange-500 font-bold">{countdown}</span> seconds.
        </p>

        {/* Illustration */}
        <div className="relative mb-12 mx-auto w-64 h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full text-gray-800"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
              <path
                d="M60 60L140 140M60 140L140 60"
                stroke="#f97316"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="40" fill="url(#gradient)" opacity="0.2" />
              <defs>
                <linearGradient id="gradient" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f97316" />
                  <stop offset="1" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className={cn(
              'px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500',
              'text-white font-semibold rounded-lg',
              'hover:from-orange-600 hover:to-red-600',
              'transition-all duration-300 transform hover:scale-105',
              'shadow-lg shadow-orange-500/25',
              'flex items-center gap-2'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>

          <Link
            href="/generate"
            className={cn(
              'px-8 py-3 bg-gray-800/50',
              'text-white font-semibold rounded-lg',
              'hover:bg-gray-800',
              'transition-all duration-300',
              'border border-gray-700',
              'flex items-center gap-2'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Video
          </Link>

          <Link
            href="/gallery"
            className={cn(
              'px-8 py-3 bg-gray-800/50',
              'text-white font-semibold rounded-lg',
              'hover:bg-gray-800',
              'transition-all duration-300',
              'border border-gray-700',
              'flex items-center gap-2'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Gallery
          </Link>
        </div>

        {/* Search suggestion */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800 max-w-md mx-auto">
          <p className="text-gray-400 mb-3">Can&apos;t find what you&apos;re looking for?</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for videos, templates, or help..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-gray-500 text-sm">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-orange-500 hover:text-orange-400 underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
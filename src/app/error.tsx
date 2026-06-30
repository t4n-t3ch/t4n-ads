'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 mb-6">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Error Details</h2>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-red-400 mb-2">{error.message}</p>
              {error.digest && (
                <p className="text-gray-500 text-xs">
                  Error ID: <span className="text-gray-400">{error.digest}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className={cn(
              'px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500',
              'text-white font-medium rounded-lg',
              'hover:from-orange-600 hover:to-red-600',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
          >
            Try Again
          </button>
          <Link
            href="/"
            className={cn(
              'px-6 py-3 bg-gray-800',
              'text-white font-medium rounded-lg',
              'hover:bg-gray-700',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
          >
            Go Home
          </Link>
          <Link
            href="/generate"
            className={cn(
              'px-6 py-3 border border-gray-700',
              'text-gray-300 font-medium rounded-lg',
              'hover:bg-gray-800/50 hover:border-gray-600',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900'
            )}
          >
            Back to Generator
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">Need immediate assistance?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:support@t4n-ads.com"
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
            >
              Contact Support
            </a>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Visit Dashboard
            </Link>
            <Link
              href="/gallery"
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Error icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
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
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs font-bold">!</span>
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Something went wrong
        </h1>
        
        <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred while processing your request.
        </p>

        {/* Error details (collapsible) */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
          <details className="cursor-pointer">
            <summary className="text-gray-300 font-medium hover:text-white transition-colors">
              Error details
            </summary>
            <div className="mt-4 text-left">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <p className="text-red-400 mb-2">{error.message}</p>
                {error.digest && (
                  <p className="text-gray-400 text-xs">
                    Error ID: <span className="text-gray-300">{error.digest}</span>
                  </p>
                )}
              </div>
            </div>
          </details>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/25 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-700 hover:border-gray-600 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go home
          </Link>

          <Link
            href="/generate"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-800 hover:border-gray-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Create video
          </Link>
        </div>

        {/* Support contact */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 mb-2">Need help?</p>
          <Link
            href="mailto:support@t4n-ads.com"
            className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
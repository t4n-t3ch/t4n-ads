import React from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 't4n-ads-video',
  description: 'Generate stunning video ads with AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center">
                  <span className="font-bold text-white">t4n</span>
                </div>
                <span className="text-xl font-bold">Ads Video</span>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="/generate" className="text-gray-300 hover:text-white transition-colors">Generate</a>
                <a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
                <a href="/login" className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors">Login</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-gray-800 py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-orange-500"></div>
                    <span className="font-bold">t4n-ads-video</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Create professional video ads in minutes</p>
                </div>
                <div className="text-gray-400 text-sm">
                  <p>© {new Date().getFullYear()} t4n-ads-video. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
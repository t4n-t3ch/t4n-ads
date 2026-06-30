"use client"

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const Navbar = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T4N</span>
              </div>
              <span className="text-white font-bold text-xl">T4N Ads</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/generate" className="text-gray-300 hover:text-white transition">
              Generate
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-white transition">
              Gallery
            </Link>
            <Link href="/templates" className="text-gray-300 hover:text-white transition">
              Templates
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  Credits: <span className="text-orange-500 font-bold">10</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.email?.substring(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300">{user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 hidden group-hover:block">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-3 space-y-3">
            <Link href="/generate" className="block text-gray-300 hover:text-white">
              Generate
            </Link>
            <Link href="/gallery" className="block text-gray-300 hover:text-white">
              Gallery
            </Link>
            <Link href="/templates" className="block text-gray-300 hover:text-white">
              Templates
            </Link>
            <Link href="/pricing" className="block text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/dashboard" className="block text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <div className="pt-3 border-t border-gray-800">
              {user ? (
                <div className="space-y-3">
                  <div className="text-gray-300">Logged in as: {user.email}</div>
                  <div className="text-gray-300">
                    Credits: <span className="text-orange-500">10</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left text-gray-300 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 text-orange-500 border border-orange-500 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/pricing"
                    className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
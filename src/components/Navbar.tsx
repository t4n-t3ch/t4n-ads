'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { CreditsBadge } from '@/components/CreditsBadge'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const navLinks = [
    { href: '/generate', label: 'Generate' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600">
                <span className="text-lg font-bold text-white">T4N</span>
              </div>
              <span className="text-xl font-bold text-white">Ads</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-orange-400',
                  pathname === link.href
                    ? 'text-orange-500'
                    : 'text-gray-300'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Auth & Credits */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="hidden md:block">
                      <CreditsBadge />
                    </div>
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isMobileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-800 bg-gray-900 py-1 shadow-xl">
                          <div className="border-b border-gray-800 px-4 py-3">
                            <p className="text-sm font-medium text-white">
                              {user.email}
                            </p>
                            <div className="mt-1 md:hidden">
                              <CreditsBadge compact />
                            </div>
                          </div>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/gallery"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            My Videos
                          </Link>
                          <Link
                            href="/pricing"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            Upgrade Plan
                          </Link>
                          <div className="border-t border-gray-800">
                            <button
                              onClick={handleSignOut}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hidden rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-amber-700 md:block"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/pricing"
                      className="hidden rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition-all hover:bg-orange-500/10 md:block"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-800 bg-gray-900 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-medium',
                  pathname === link.href
                    ? 'bg-gray-800 text-orange-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-800 px-4 py-3">
            {user ? (
              <>
                <div className="mb-3">
                  <CreditsBadge />
                </div>
                <div className="space-y-2">
                  <div className="rounded-md bg-gray-800 px-3 py-2">
                    <p className="text-sm font-medium text-white">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full rounded-md bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block rounded-md bg-gradient-to-r from-orange-500 to-amber-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="block rounded-md border border-orange-500 px-3 py-2 text-center text-sm font-semibold text-orange-500"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
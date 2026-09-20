'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/studios', label: 'Studios' },
  { href: '/generate', label: 'Generate' },
  { href: '/templates', label: 'Templates' },
  { href: '/gallery', label: 'Gallery' },
]

export default function AppHeader() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <span className="w-7 h-7 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs">
            T4N
          </span>
          <span>T4N Ads</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors',
                pathname?.startsWith(item.href) && 'text-foreground font-medium'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">
          Sign out
        </button>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'
import { CreditCard, AlertTriangle, Plus } from 'lucide-react'

interface CreditsBadgeProps {
  showLabel?: boolean
  showTopUp?: boolean
  className?: string
  compact?: boolean
}

export default function CreditsBadge({
  showLabel = true,
  showTopUp = true,
  className,
  compact = false,
}: CreditsBadgeProps) {
  const router = useRouter()
  const { credits, loading, error, refetch } = useCredits()
  const [isLow, setIsLow] = useState(false)

  useEffect(() => {
    if (credits !== null && credits <= 10) {
      setIsLow(true)
    } else {
      setIsLow(false)
    }
  }, [credits])

  const handleTopUp = () => {
    router.push('/pricing')
  }

  if (loading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-red-400">Error loading credits</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <CreditCard className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-white">{credits}</span>
        {isLow && (
          <AlertTriangle className="h-3 w-3 text-amber-500" />
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <CreditCard className="h-5 w-5 text-gray-400" />
          {isLow && (
            <div className="absolute -right-1 -top-1">
              <div className="relative">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <div className="absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-20"></div>
              </div>
            </div>
          )}
        </div>
        
        {showLabel && (
          <span className="text-sm font-medium text-gray-300">Credits:</span>
        )}
        
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-lg font-bold',
            isLow ? 'text-amber-400' : 'text-white'
          )}>
            {credits}
          </span>
          
          {isLow && (
            <div className="flex items-center gap-1 rounded-full bg-amber-900/30 px-2 py-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Low</span>
            </div>
          )}
        </div>
      </div>

      {showTopUp && (
        <button
          onClick={handleTopUp}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
            isLow
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          )}
        >
          <Plus className="h-4 w-4" />
          <span>Top Up</span>
        </button>
      )}
    </div>
  )
}
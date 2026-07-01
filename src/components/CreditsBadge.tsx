"use client"

import { useState, useEffect } from 'react'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'
import { CreditCard, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'

interface CreditsBadgeProps {
  showLabel?: boolean
  showWarning?: boolean
  className?: string
  compact?: boolean
}

export default function CreditsBadge({
  showLabel = true,
  showWarning = true,
  className,
  compact = false
}: CreditsBadgeProps) {
  const { credits, isLoading, error, refetch } = useCredits()
  const [isLow, setIsLow] = useState(false)

  useEffect(() => {
    if (credits !== null && credits <= 10) {
      setIsLow(true)
    } else {
      setIsLow(false)
    }
  }, [credits])

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 animate-pulse",
        className
      )}>
        <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
        {showLabel && !compact && (
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        )}
      </div>
    )
  }

  if (error || credits === null) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20",
        className
      )}>
        <CreditCard className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400">Error</span>
      </div>
    )
  }

  const badgeContent = (
    <>
      <div className="flex items-center gap-2">
        <CreditCard className={cn(
          "w-4 h-4",
          isLow ? "text-amber-400" : "text-gray-300"
        )} />
        
        {showLabel && !compact && (
          <span className="text-sm text-gray-300">Credits:</span>
        )}
        
        <span className={cn(
          "font-semibold",
          isLow ? "text-amber-400" : "text-white"
        )}>
          {credits.toLocaleString()}
        </span>

        {isLow && showWarning && (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        )}
      </div>

      {isLow && showWarning && !compact && (
        <div className="absolute top-full left-0 right-0 mt-1 px-2 py-1 text-xs bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-center">
          Low credits! Add more to continue.
        </div>
      )}
    </>
  )

  if (compact) {
    return (
      <div className={cn(
        "relative inline-flex items-center px-3 py-1.5 rounded-lg",
        isLow 
          ? "bg-amber-500/10 border border-amber-500/20" 
          : "bg-gray-800/50 border border-gray-700/50",
        className
      )}>
        {badgeContent}
      </div>
    )
  }

  return (
    <Link 
      href="/pricing" 
      className={cn(
        "group relative inline-flex items-center px-4 py-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
        isLow 
          ? "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15" 
     
PROJECT PLAN:
# Edit Plan
1. src/components/CreditsBadge.tsx — EDIT: Change `loading` to `isLoading` in two places to match the useCredits hook's return value
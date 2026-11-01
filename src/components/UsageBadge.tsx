"use client"

import { useUsage } from '@/hooks/useUsage'
import { cn } from '@/lib/utils'
import { CreditCard } from 'lucide-react'

interface UsageBadgeProps {
  className?: string
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function UsageBadge({ className }: UsageBadgeProps) {
  const { usage, isLoading, error } = useUsage()

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 animate-pulse",
        className
      )}>
        <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (error || !usage) {
    return null
  }

  return (
    <div
      title={`You: ${formatCents(usage.myCents)} across ${usage.myVideoCount} video${usage.myVideoCount === 1 ? '' : 's'}`}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300",
        className
      )}
    >
      <CreditCard className="w-4 h-4 text-gray-400" />
      <span>Spend: {formatCents(usage.totalCents)} ({usage.totalVideoCount} videos)</span>
    </div>
  )
}

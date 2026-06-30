'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const variantClasses = {
    default: 'bg-gray-700',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-orange-500 to-pink-500',
  }

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const baseClasses = 'w-full bg-gray-800 rounded-full overflow-hidden'
  const barClasses = cn(
    'h-full rounded-full transition-all duration-300 ease-out',
    variantClasses[variant],
    animated && 'animate-pulse-slow'
  )

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="text-gray-300 font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-gray-400 font-mono">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn(baseClasses, sizeClasses[size])}>
        <div
          className={barClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
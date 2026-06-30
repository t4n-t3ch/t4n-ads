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

const variantStyles = {
  default: 'bg-orange-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-orange-500 to-pink-500',
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-300 font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-gray-400 font-mono">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-800 rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantStyles[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CircularProgressBar({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  variant = 'default',
  label,
  showPercentage = true,
  className,
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  label?: string
  showPercentage?: boolean
  className?: string
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  const strokeColor = {
    default: '#f97316',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  }[variant]

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-gray-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none transition-all duration-300 ease-out"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-100 font-bold text-lg">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      
      {label && (
        <span className="mt-2 text-sm text-gray-400 font-medium">
          {label}
        </span>
      )}
    </div>
  )
}
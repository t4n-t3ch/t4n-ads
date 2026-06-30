'use client'

import { VideoStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: VideoStatus
  className?: string
  showLabel?: boolean
  pulse?: boolean
}

export default function StatusBadge({ 
  status, 
  className, 
  showLabel = true,
  pulse = true 
}: StatusBadgeProps) {
  const getStatusConfig = (status: VideoStatus) => {
    switch (status) {
      case VideoStatus.PROCESSING:
        return {
          label: 'Processing',
          color: 'bg-orange-500',
          textColor: 'text-orange-100',
          borderColor: 'border-orange-600',
          pulseColor: 'bg-orange-400'
        }
      case VideoStatus.COMPLETED:
        return {
          label: 'Completed',
          color: 'bg-green-500',
          textColor: 'text-green-100',
          borderColor: 'border-green-600',
          pulseColor: 'bg-green-400'
        }
      case VideoStatus.FAILED:
        return {
          label: 'Failed',
          color: 'bg-red-500',
          textColor: 'text-red-100',
          borderColor: 'border-red-600',
          pulseColor: 'bg-red-400'
        }
      case VideoStatus.DRAFT:
        return {
          label: 'Draft',
          color: 'bg-gray-500',
          textColor: 'text-gray-100',
          borderColor: 'border-gray-600',
          pulseColor: 'bg-gray-400'
        }
      case VideoStatus.QUEUED:
        return {
          label: 'Queued',
          color: 'bg-blue-500',
          textColor: 'text-blue-100',
          borderColor: 'border-blue-600',
          pulseColor: 'bg-blue-400'
        }
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-500',
          textColor: 'text-gray-100',
          borderColor: 'border-gray-600',
          pulseColor: 'bg-gray-400'
        }
    }
  }

  const config = getStatusConfig(status)
  const isProcessing = status === VideoStatus.PROCESSING
  const isPulsing = pulse && isProcessing

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn(
          'w-3 h-3 rounded-full border',
          config.color,
          config.borderColor,
          isPulsing && 'animate-pulse'
        )} />
        {isPulsing && (
          <div className={cn(
            'absolute inset-0 w-3 h-3 rounded-full animate-ping',
            config.pulseColor
          )} />
        )}
      </div>
      {showLabel && (
        <span className={cn(
          'text-sm font-medium',
          config.textColor
        )}>
          {config.label}
        </span>
      )}
    </div>
  )
}
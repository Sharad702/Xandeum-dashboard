'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger'
  className?: string
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const variantClasses = {
  default: 'bg-xandeum-500',
  gradient: 'bg-gradient-to-r from-xandeum-500 via-aurora-500 to-ember-400',
  success: 'bg-aurora-500',
  warning: 'bg-ember-500',
  danger: 'bg-red-500',
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
  variant = 'default',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-midnight-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-medium text-white">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-midnight-800 overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', variantClasses[variant])}
        />
      </div>
    </div>
  )
}


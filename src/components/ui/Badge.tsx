'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
  pulse?: boolean
}

const variantClasses = {
  default: 'bg-midnight-700 text-midnight-200 border-midnight-600',
  success: 'bg-aurora-500/20 text-aurora-400 border-aurora-500/30',
  warning: 'bg-ember-500/20 text-ember-400 border-ember-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-xandeum-500/20 text-xandeum-400 border-xandeum-500/30',
}

const dotClasses = {
  default: 'bg-midnight-400',
  success: 'bg-aurora-400',
  warning: 'bg-ember-400',
  danger: 'bg-red-400',
  info: 'bg-xandeum-400',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            dotClasses[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  )
}


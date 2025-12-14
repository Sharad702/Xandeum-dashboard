'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-xandeum-500 to-xandeum-600 text-white hover:from-xandeum-400 hover:to-xandeum-500 shadow-lg shadow-xandeum-500/25',
  secondary: 'bg-gradient-to-r from-aurora-500 to-aurora-600 text-white hover:from-aurora-400 hover:to-aurora-500 shadow-lg shadow-aurora-500/25',
  ghost: 'bg-transparent text-midnight-300 hover:text-white hover:bg-white/5',
  outline: 'border border-xandeum-500/50 text-xandeum-400 hover:bg-xandeum-500/10 hover:border-xandeum-500',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/25',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-xandeum-500/50 focus:ring-offset-2 focus:ring-offset-midnight-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  )
}


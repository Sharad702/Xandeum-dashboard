'use client'

import { memo, useState, useCallback } from 'react'
import { Activity, RefreshCw, ExternalLink, Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useConnectionStatus, useRefreshPNodes } from '@frontend/hooks/usePNodes'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

interface HeaderProps {
  onMenuToggle?: () => void
  menuOpen?: boolean
}

// Memoized connection badge to prevent unnecessary re-renders
const ConnectionBadge = memo(function ConnectionBadge() {
  const connectionStatus = useConnectionStatus()
  
  if (connectionStatus.isConnected) {
    return <Badge variant="success" dot pulse>Connected</Badge>
  }
  if (connectionStatus.error) {
    return <Badge variant="danger" dot>Error</Badge>
  }
  return <Badge variant="default">Connecting...</Badge>
})

// Memoized refresh button
const RefreshButton = memo(function RefreshButton() {
  const { refresh } = useRefreshPNodes()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [refresh])

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleRefresh} 
      className="text-midnight-400 hover:text-white" 
      icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
    >
      <span className="hidden sm:inline">Refresh</span>
    </Button>
  )
})

// Theme toggle button
const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-midnight-400 hover:text-white hover:bg-white/5 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
})

// Logo component with CSS rotation animation (doesn't cause re-renders)
const Logo = memo(function Logo() {
  return (
    <div className="relative animate-rotate-slow">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-xandeum-500 to-aurora-500 flex items-center justify-center">
        <Activity className="w-5 h-5 text-white" />
      </div>
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-xandeum-500/30 to-aurora-500/30 blur-md -z-10" />
    </div>
  )
})

export const Header = memo(function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-darker border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuToggle} 
              className="lg:hidden p-2 text-midnight-400 hover:text-white transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link href="/" className="flex items-center gap-3">
              <Logo />
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold gradient-text">Xandeum</h1>
                <p className="text-xs text-midnight-400 -mt-0.5">pNode Analytics</p>
              </div>
            </Link>
          </div>

          {/* Center - Connection Status */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-midnight-400">pRPC:</span>
              <ConnectionBadge />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <RefreshButton />
            <ThemeToggle />
            
            <a 
              href="https://xandeum.network" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-xandeum-400 hover:text-xandeum-300 transition-colors"
            >
              <span>Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
})

'use client'

import { memo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Server,
  BarChart3,
  Globe2,
  Settings,
  HelpCircle,
  Boxes,
  Zap,
  TrendingUp,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'pNodes', href: '/pnodes', icon: Server },
      { label: 'Network Stats', href: '/stats', icon: BarChart3 },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Storage', href: '/storage', icon: Boxes },
      { label: 'Performance', href: '/performance', icon: Zap },
      { label: 'Trends', href: '/trends', icon: TrendingUp },
    ],
  },
  {
    title: 'Network',
    items: [
      { label: 'Geography', href: '/geography', icon: Globe2 },
    ],
  },
]

const bottomNavItems = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help', href: '/help', icon: HelpCircle },
]

// Memoized NavLink component
const NavLink = memo(function NavLink({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: { label: string; href: string; icon: React.ElementType }
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-xandeum-500/20 text-xandeum-400 border border-xandeum-500/30'
          : 'text-midnight-400 hover:text-white hover:bg-white/5'
      )}
    >
      <Icon className="w-4.5 h-4.5" />
      <span>{item.label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-xandeum-400" />
      )}
    </Link>
  )
})

// Memoized sidebar content
const SidebarContent = memo(function SidebarContent({ 
  pathname, 
  onClose 
}: { 
  pathname: string
  onClose: () => void 
}) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-midnight-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink 
            key={item.href} 
            item={item} 
            isActive={pathname === item.href}
            onClick={onClose}
          />
        ))}
      </div>
    </div>
  )
})

export const Sidebar = memo(function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 glass-darker border-r border-white/5 z-40">
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <>
          <div
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          />
          <aside
            className="lg:hidden fixed left-0 top-16 bottom-0 w-64 glass-darker border-r border-white/5 z-50 transform transition-transform duration-200"
          >
            <SidebarContent pathname={pathname} onClose={onClose} />
          </aside>
        </>
      )}
    </>
  )
})

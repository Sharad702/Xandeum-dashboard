'use client'

import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * DashboardLayout is now a simple pass-through component.
 * The actual layout (Header, Sidebar) is handled by PersistentLayout in the root layout.
 * This component is kept for backward compatibility with existing pages.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>
}

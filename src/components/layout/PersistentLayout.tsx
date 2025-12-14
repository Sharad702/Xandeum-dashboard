'use client'

import { useState, ReactNode, memo, useCallback } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface PersistentLayoutProps {
  children: ReactNode
}

export const PersistentLayout = memo(function PersistentLayout({ children }: PersistentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className="min-h-screen mesh-pattern grid-lines">
      <Header 
        onMenuToggle={handleMenuToggle} 
        menuOpen={sidebarOpen}
      />
      <Sidebar open={sidebarOpen} onClose={handleClose} />
      
      <main className="pt-16 lg:pl-64">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
})

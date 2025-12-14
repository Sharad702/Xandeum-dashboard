'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SettingsContextType {
  refreshInterval: number // in seconds
  setRefreshInterval: (interval: number) => void
}

const defaultSettings: SettingsContextType = {
  refreshInterval: 30,
  setRefreshInterval: () => {},
}

const SettingsContext = createContext<SettingsContextType>(defaultSettings)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [refreshInterval, setRefreshIntervalState] = useState(30)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('xandeum-refresh-interval')
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && [30, 60, 120, 300].includes(parsed)) {
        setRefreshIntervalState(parsed)
      }
    }
  }, [])

  // Save to localStorage when changed
  const setRefreshInterval = (interval: number) => {
    setRefreshIntervalState(interval)
    if (mounted) {
      localStorage.setItem('xandeum-refresh-interval', interval.toString())
    }
  }

  return (
    <SettingsContext.Provider value={{ refreshInterval, setRefreshInterval }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}


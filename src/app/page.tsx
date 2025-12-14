'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid, QuickStats } from '@/components/dashboard/StatsGrid'
import { TopNodes } from '@/components/dashboard/TopNodes'
import { useNetworkStats } from '@frontend/hooks/usePNodes'
import { useSettings } from '@/contexts/SettingsContext'

function NetworkOverview() {
  const { data: stats, isLoading } = useNetworkStats()

  if (isLoading || !stats) {
    return (
      <div className="mb-6 p-4 rounded-xl glass animate-pulse">
        <div className="h-16 bg-midnight-800/50 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl glass border border-xandeum-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <p className="text-xs text-midnight-500 mb-0.5">Total pNodes</p>
          <p className="text-lg font-bold text-white">{stats.totalNodes}</p>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <div>
          <p className="text-xs text-midnight-500 mb-0.5">Active Now</p>
          <p className="text-sm font-medium text-aurora-400">{stats.activeNodes} nodes</p>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <div>
          <p className="text-xs text-midnight-500 mb-0.5">Public / Private</p>
          <p className="text-sm font-medium text-midnight-300">{stats.publicNodes} / {stats.privateNodes}</p>
        </div>
        <div className="w-px h-8 bg-white/10 hidden sm:block" />
        <div>
          <p className="text-xs text-midnight-500 mb-0.5">Versions</p>
          <p className="text-sm font-medium text-midnight-300">{Object.keys(stats.versions).length} active</p>
        </div>
      </div>

      <div className="flex-1 max-w-xs">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-midnight-500">Storage Utilization</span>
          <span className="text-xandeum-400 font-medium">{stats.averageStorageUsage.toFixed(4)}%</span>
        </div>
        <div className="h-2 rounded-full bg-midnight-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stats.averageStorageUsage * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-xandeum-500 to-aurora-500"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { refreshInterval } = useSettings()
  
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          pNode <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">
          Real-time analytics for Xandeum pNodes. Data fetched directly from the network using the official pRPC API.
        </p>
      </motion.div>

      <QuickStats />
      <NetworkOverview />
      <StatsGrid />
      <TopNodes />

      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center py-8 border-t border-white/5">
        <p className="text-sm text-midnight-500">
          Data refreshes automatically every {refreshInterval} seconds.{' '}
          <a href="https://xandeum.network" target="_blank" rel="noopener noreferrer" className="text-xandeum-400 hover:text-xandeum-300">
            Learn more about Xandeum →
          </a>
        </p>
      </motion.footer>
    </DashboardLayout>
  )
}

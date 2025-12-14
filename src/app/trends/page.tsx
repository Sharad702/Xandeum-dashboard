'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatBytes, formatUptime } from '@frontend/utils/formatters'
import { TrendingUp, Clock, Server, HardDrive } from 'lucide-react'

function CurrentSnapshot() {
  const { isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse"><div className="h-24 bg-midnight-800/50 rounded" /></Card>)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-xandeum-400" />
          <span className="text-xs text-midnight-400">Total pNodes</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalNodes}</p>
        <p className="text-xs text-midnight-500 mt-1">{stats.activeNodes} active</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-4 h-4 text-aurora-400" />
          <span className="text-xs text-midnight-400">Total Storage</span>
        </div>
        <p className="text-2xl font-bold text-white">{formatBytes(stats.totalStorageCommitted)}</p>
        <p className="text-xs text-midnight-500 mt-1">{formatBytes(stats.totalStorageUsed)} used</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-ember-400" />
          <span className="text-xs text-midnight-400">Avg Uptime</span>
        </div>
        <p className="text-2xl font-bold text-white">{formatUptime(stats.averageUptime)}</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-midnight-400">Versions</span>
        </div>
        <p className="text-2xl font-bold text-white">{Object.keys(stats.versions).length}</p>
        <p className="text-xs text-midnight-500 mt-1">unique versions</p>
      </Card>
    </div>
  )
}

function VersionBreakdown() {
  const { isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  if (isLoading || !stats) return null

  const versions = Object.entries(stats.versions).sort((a, b) => b[1] - a[1])

  return (
    <Card>
      <CardHeader><CardTitle>Version Breakdown (Current)</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.map(([version, count]) => {
            const percentage = (count / stats.totalNodes) * 100
            return (
              <div key={version} className="flex items-center gap-4">
                <span className="text-sm font-mono text-white w-40 truncate">{version}</span>
                <div className="flex-1 h-2 rounded-full bg-midnight-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-xandeum-500 to-aurora-500" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm text-midnight-400 w-24 text-right">{count} ({percentage.toFixed(1)}%)</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function TrendsPage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Network <span className="gradient-text">Trends</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">Current network snapshot from Xandeum pRPC.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Current Snapshot</h2>
        <CurrentSnapshot />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-xandeum-500/10 to-xandeum-600/5 border-xandeum-500/20">
          <CardContent className="py-12">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-xandeum-500/20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-xandeum-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Historical Trends</h2>
              <p className="text-midnight-300 mb-6">Historical trend data requires a database to store snapshots over time. Currently showing live data from Xandeum pRPC.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
        <VersionBreakdown />
      </motion.div>
    </DashboardLayout>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatBytes, formatUptime, cn } from '@frontend/utils/formatters'
import { HardDrive, Activity, TrendingUp, Server, Clock } from 'lucide-react'

function PerformanceOverview() {
  const { data: stats, isLoading } = useNetworkStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse"><div className="h-24 bg-midnight-800/50 rounded" /></Card>)}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-xandeum-500/10 to-xandeum-600/5 border-xandeum-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-xandeum-500/20"><Server className="w-5 h-5 text-xandeum-400" /></div>
            <span className="text-xs text-midnight-400">Total pNodes</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalNodes}</p>
        </Card>

        <Card className="bg-gradient-to-br from-aurora-500/10 to-aurora-600/5 border-aurora-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-aurora-500/20"><Activity className="w-5 h-5 text-aurora-400" /></div>
            <span className="text-xs text-midnight-400">Active Nodes</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeNodes}</p>
          <p className="text-xs text-midnight-400 mt-1">of {stats.totalNodes} total</p>
        </Card>

        <Card className="bg-gradient-to-br from-ember-500/10 to-ember-600/5 border-ember-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-ember-500/20"><HardDrive className="w-5 h-5 text-ember-400" /></div>
            <span className="text-xs text-midnight-400">Total Storage</span>
          </div>
          <p className="text-3xl font-bold text-white">{formatBytes(stats.totalStorageCommitted)}</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20"><Clock className="w-5 h-5 text-purple-400" /></div>
            <span className="text-xs text-midnight-400">Avg Uptime</span>
          </div>
          <p className="text-3xl font-bold text-white">{formatUptime(stats.averageUptime)}</p>
        </Card>
      </div>
    </motion.div>
  )
}

function TopPerformers() {
  const { data, isLoading } = usePNodes()
  const pnodes = data?.pods || []

  const topPerformers = useMemo(() => {
    return [...pnodes]
      .filter(p => p.status === 'online')
      .sort((a, b) => b.uptime - a.uptime)
      .slice(0, 10)
  }, [pnodes])

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Top Performing Nodes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-midnight-800/50 rounded animate-pulse" />)}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-aurora-400" />
            Top Performing Nodes (by Uptime)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((pnode, index) => (
              <div key={pnode.id} className="flex items-center gap-4 p-3 rounded-lg bg-midnight-900/50 dark:bg-midnight-900/50 light:bg-slate-100 hover:bg-midnight-900 dark:hover:bg-midnight-900 light:hover:bg-slate-200 transition-colors theme-row">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', index < 3 ? 'bg-aurora-500/20 text-aurora-400' : 'bg-midnight-700 dark:bg-midnight-700 text-midnight-300')}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-mono text-white dark:text-white truncate block">{pnode.pubkey.slice(0, 8)}...{pnode.pubkey.slice(-6)}</span>
                  <span className="text-xs text-midnight-400">v{pnode.version}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-aurora-400">{pnode.uptimeFormatted}</p>
                  <p className="text-xs text-midnight-400">uptime</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white dark:text-white">{pnode.storageCommittedFormatted}</p>
                  <p className="text-xs text-midnight-400">storage</p>
                </div>
                <Badge variant={pnode.isPublic ? 'success' : 'default'}>{pnode.isPublic ? 'Public' : 'Private'}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Performance <span className="gradient-text">Metrics</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">Real-time performance data from Xandeum pRPC. Sorted by uptime.</p>
      </motion.div>
      <div className="mb-8"><PerformanceOverview /></div>
      <TopPerformers />
    </DashboardLayout>
  )
}

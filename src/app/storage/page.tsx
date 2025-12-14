'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatBytes, shortenPubkey } from '@frontend/utils/formatters'
import { HardDrive, Database, TrendingUp, Server, BarChart3 } from 'lucide-react'

function StorageOverview() {
  const { data: stats, isLoading } = useNetworkStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-24 bg-midnight-800/50 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-xandeum-500/10 to-xandeum-600/5 border-xandeum-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-xandeum-500/20">
              <HardDrive className="w-5 h-5 text-xandeum-400" />
            </div>
            <span className="text-xs text-midnight-400">Total Committed</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatBytes(stats.totalStorageCommitted)}</p>
          <p className="text-xs text-midnight-500 mt-1">across {stats.totalNodes} pNodes</p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="bg-gradient-to-br from-aurora-500/10 to-aurora-600/5 border-aurora-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-aurora-500/20">
              <Database className="w-5 h-5 text-aurora-400" />
            </div>
            <span className="text-xs text-midnight-400">Storage Used</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatBytes(stats.totalStorageUsed)}</p>
          <p className="text-xs text-midnight-500 mt-1">actual data stored</p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-ember-500/10 to-ember-600/5 border-ember-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-ember-500/20">
              <TrendingUp className="w-5 h-5 text-ember-400" />
            </div>
            <span className="text-xs text-midnight-400">Utilization</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageStorageUsage.toFixed(4)}%</p>
          <p className="text-xs text-midnight-500 mt-1">average usage</p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-midnight-400">Active pNodes</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeNodes}</p>
          <p className="text-xs text-midnight-500 mt-1">providing storage</p>
        </Card>
      </motion.div>
    </div>
  )
}

function StorageDistribution() {
  const { data, isLoading } = usePNodes()
  const pnodes = data?.pods || []

  const topStorageNodes = useMemo(() => {
    return [...pnodes]
      .filter(p => p.storageCommitted > 0)
      .sort((a, b) => b.storageCommitted - a.storageCommitted)
      .slice(0, 15)
  }, [pnodes])

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Storage Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-midnight-800/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-xandeum-400" />
            Top Storage Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStorageNodes.map((node, index) => {
              const maxStorage = topStorageNodes[0]?.storageCommitted || 1
              const barPercentage = (node.storageCommitted / maxStorage) * 100
              
              // Format usage percentage with appropriate precision
              const usagePercent = node.storageUsagePercent
              const usageDisplay = usagePercent === 0 
                ? '0%' 
                : usagePercent < 0.01 
                  ? `${usagePercent.toFixed(4)}%`
                  : usagePercent < 1 
                    ? `${usagePercent.toFixed(2)}%`
                    : `${usagePercent.toFixed(1)}%`
              
              return (
                <div key={node.id} className="flex items-center gap-4">
                  <span className="text-sm text-midnight-400 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-mono text-white">{shortenPubkey(node.pubkey, 6)}</span>
                      <div className="text-right">
                        <span className="text-sm text-midnight-400">{node.storageCommittedFormatted}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-midnight-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPercentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-xandeum-500 to-aurora-500"
                      />
                    </div>
                  </div>
                  <div className="text-right w-24">
                    <span className="text-xs text-aurora-400">{node.storageUsedFormatted}</span>
                    <span className="text-xs text-midnight-500 block">{usageDisplay} used</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StorageByUsage() {
  const { data, isLoading } = usePNodes()
  const pnodes = data?.pods || []

  const usageGroups = useMemo(() => {
    const groups = {
      empty: 0,
      low: 0,
      medium: 0,
      high: 0,
    }
    
    pnodes.forEach(p => {
      if (p.storageUsagePercent === 0) groups.empty++
      else if (p.storageUsagePercent < 25) groups.low++
      else if (p.storageUsagePercent < 75) groups.medium++
      else groups.high++
    })
    
    return groups
  }, [pnodes])

  if (isLoading) return null

  const total = pnodes.length || 1

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-aurora-400" />
            Storage Usage Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-midnight-900/50">
              <p className="text-xs text-midnight-400 mb-1">Empty (0%)</p>
              <p className="text-2xl font-bold text-white">{usageGroups.empty}</p>
              <p className="text-xs text-midnight-500">{((usageGroups.empty / total) * 100).toFixed(1)}% of nodes</p>
            </div>
            <div className="p-4 rounded-lg bg-midnight-900/50">
              <p className="text-xs text-midnight-400 mb-1">Low (0-25%)</p>
              <p className="text-2xl font-bold text-aurora-400">{usageGroups.low}</p>
              <p className="text-xs text-midnight-500">{((usageGroups.low / total) * 100).toFixed(1)}% of nodes</p>
            </div>
            <div className="p-4 rounded-lg bg-midnight-900/50">
              <p className="text-xs text-midnight-400 mb-1">Medium (25-75%)</p>
              <p className="text-2xl font-bold text-ember-400">{usageGroups.medium}</p>
              <p className="text-xs text-midnight-500">{((usageGroups.medium / total) * 100).toFixed(1)}% of nodes</p>
            </div>
            <div className="p-4 rounded-lg bg-midnight-900/50">
              <p className="text-xs text-midnight-400 mb-1">High (75%+)</p>
              <p className="text-2xl font-bold text-red-400">{usageGroups.high}</p>
              <p className="text-xs text-midnight-500">{((usageGroups.high / total) * 100).toFixed(1)}% of nodes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function StoragePage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Storage <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">
          Real-time storage metrics from Xandeum pRPC. Track committed storage, usage, and distribution across pNodes.
        </p>
      </motion.div>

      <StorageOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageDistribution />
        <StorageByUsage />
      </div>
    </DashboardLayout>
  )
}

'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { NodeStatusChart, VersionDistributionChart, VisibilityChart } from '@/components/dashboard/Charts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatNumber, formatBytes, formatUptime } from '@frontend/utils/formatters'
import { Activity, HardDrive, Server, Clock } from 'lucide-react'

function NetworkMetricsCard() {
  const { data: stats, isLoading } = useNetworkStats()

  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader><CardTitle>Live Network Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-midnight-900/50 animate-pulse">
                <div className="h-16 bg-midnight-800/50 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    { label: 'Total pNodes', value: stats.totalNodes, icon: <Server className="w-4 h-4 text-xandeum-400" /> },
    { label: 'Active Nodes', value: stats.activeNodes, icon: <Activity className="w-4 h-4 text-aurora-400" /> },
    { label: 'Total Storage', value: formatBytes(stats.totalStorageCommitted), icon: <HardDrive className="w-4 h-4 text-ember-400" /> },
    { label: 'Avg Uptime', value: formatUptime(stats.averageUptime), icon: <Clock className="w-4 h-4 text-purple-400" /> },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardHeader><CardTitle>Live Network Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="p-4 rounded-lg bg-midnight-900/50">
                <div className="flex items-center gap-2 mb-2">
                  {metric.icon}
                  <span className="text-xs text-midnight-400">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold text-white font-mono">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function StatsPage() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Network <span className="gradient-text">Statistics</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">Live analytics from Xandeum pRPC. All data is real-time.</p>
      </motion.div>

      <StatsGrid />

      <div className="mb-8"><NetworkMetricsCard /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NodeStatusChart />
        <VersionDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisibilityChart />
      </div>
    </DashboardLayout>
  )
}

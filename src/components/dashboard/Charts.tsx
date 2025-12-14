'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'

const COLORS = {
  primary: '#0ca5eb',
  secondary: '#22c566',
  warning: '#f97316',
  danger: '#ef4444',
  purple: '#a855f7',
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="glass rounded-lg p-3 border border-white/10 shadow-xl">
      {label && <p className="text-xs text-midnight-400 mb-2">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-white font-medium">{entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function VersionDistributionChart() {
  const { data, isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  const chartData = useMemo(() => {
    if (!stats?.versions) return []
    return Object.entries(stats.versions)
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [stats])

  if (isLoading) return <CardSkeleton />

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Version Distribution</CardTitle></CardHeader>
        <CardContent><div className="h-64 flex items-center justify-center text-midnight-400">No version data</div></CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader><CardTitle>Version Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
                <XAxis type="number" tick={{ fill: '#656593', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis type="category" dataKey="version" tick={{ fill: '#b0b0cb', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} name="Nodes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function NodeStatusChart() {
  const { data, isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  const chartData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Active', value: stats.activeNodes, color: COLORS.secondary },
      { name: 'Inactive', value: stats.totalNodes - stats.activeNodes, color: COLORS.danger },
    ].filter(d => d.value > 0)
  }, [stats])

  if (isLoading) return <CardSkeleton />

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Node Status</CardTitle></CardHeader>
        <CardContent><div className="h-64 flex items-center justify-center text-midnight-400">No status data</div></CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader><CardTitle>Node Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#656593' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function VisibilityChart() {
  const { data, isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  const chartData = useMemo(() => {
    if (!stats) return []
    return [
      { name: 'Public', value: stats.publicNodes, color: COLORS.secondary },
      { name: 'Private', value: stats.privateNodes, color: COLORS.purple },
    ].filter(d => d.value > 0)
  }, [stats])

  if (isLoading) return <CardSkeleton />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card>
        <CardHeader><CardTitle>Public vs Private Nodes</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#656593' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Aliases for backward compatibility
export const RegionDistributionChart = NodeStatusChart
export const StorageUtilizationChart = VisibilityChart
export const StorageChart = VisibilityChart
export const StakeDistributionChart = VersionDistributionChart
export const CommissionDistributionChart = VersionDistributionChart
export const UptimeDistributionChart = VersionDistributionChart
export const NetworkActivityChart = VersionDistributionChart

'use client'

import { motion } from 'framer-motion'
import { Server, HardDrive, Clock, Globe, CheckCircle2, XCircle, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatBytes, formatUptime } from '@frontend/utils/formatters'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'orange' | 'purple'
  delay?: number
}

const colorClasses = {
  blue: 'from-xandeum-500/20 to-xandeum-600/10 border-xandeum-500/30',
  green: 'from-aurora-500/20 to-aurora-600/10 border-aurora-500/30',
  orange: 'from-ember-500/20 to-ember-600/10 border-ember-500/30',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
}

const iconColorClasses = {
  blue: 'text-xandeum-400 bg-xandeum-500/20',
  green: 'text-aurora-400 bg-aurora-500/20',
  orange: 'text-ember-400 bg-ember-500/20',
  purple: 'text-purple-400 bg-purple-500/20',
}

function StatCard({ title, value, subtitle, icon, color = 'blue', delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br ${colorClasses[color]} overflow-hidden relative h-full flex flex-col`} hover>
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
        <div className="relative flex flex-col flex-1 min-h-0">
          <div className="flex items-start justify-between mb-3 flex-shrink-0">
            <div className={`p-2.5 rounded-lg ${iconColorClasses[color]}`}>{icon}</div>
          </div>
          <p className="text-xs text-midnight-400 font-medium uppercase tracking-wider mb-1 flex-shrink-0">{title}</p>
          <motion.p className="text-2xl sm:text-3xl font-bold text-white font-display flex-shrink-0 mb-2" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: delay + 0.2 }}>
            {value}
          </motion.p>
          <div className="mt-auto pt-1 h-[32px] flex items-end flex-shrink-0">
            {subtitle && <p className="text-xs text-midnight-400 leading-tight">{subtitle}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function StatsGrid() {
  const { isLoading, isError } = usePNodes()
  const { data: stats } = useNetworkStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={{ gridAutoRows: '1fr' }}>
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-8">
        <p className="text-red-400">Failed to fetch pNode data.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={{ gridAutoRows: '1fr' }}>
      {/* Position 1: Total pNodes */}
      <StatCard title="Total pNodes" value={stats.totalNodes} subtitle={`${stats.activeNodes} active`} icon={<Server className="w-5 h-5" />} color="blue" delay={0} />
      {/* Position 2: Public Nodes */}
      <StatCard title="Public Nodes" value={stats.publicNodes} subtitle={`${stats.privateNodes} private`} icon={<Globe className="w-5 h-5" />} color="purple" delay={0.1} />
      {/* Position 3: Total Storage */}
      <StatCard title="Total Storage" value={formatBytes(stats.totalStorageCommitted)} subtitle={`${formatBytes(stats.totalStorageUsed)} used`} icon={<HardDrive className="w-5 h-5" />} color="green" delay={0.2} />
      {/* Position 4: Avg Uptime */}
      <StatCard title="Avg Uptime" value={formatUptime(stats.averageUptime)} subtitle="Network reliability" icon={<Clock className="w-5 h-5" />} color="orange" delay={0.3} />
    </div>
  )
}

export function QuickStats() {
  const { isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  if (isLoading || !stats) return null

  const quickStats = [
    { label: 'Active', value: stats.activeNodes, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-aurora-400' },
    { label: 'Inactive', value: stats.totalNodes - stats.activeNodes, icon: <XCircle className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Public', value: stats.publicNodes, icon: <Globe className="w-4 h-4" />, color: 'text-xandeum-400' },
    { label: 'Private', value: stats.privateNodes, icon: <Lock className="w-4 h-4" />, color: 'text-ember-400' },
  ]

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
      {quickStats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2">
          <span className={stat.color}>{stat.icon}</span>
          <span className="text-sm text-midnight-400">{stat.label}:</span>
          <span className="text-sm font-semibold text-white">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PNodeTable } from '@/components/dashboard/PNodeTable'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { formatBytes, formatUptime } from '@frontend/utils/formatters'
import { Server, HardDrive, Clock, Globe } from 'lucide-react'

function StatBox({ 
  icon, 
  label, 
  value, 
  subValue,
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string | number
  subValue?: string
  color: string
}) {
  return (
    <div className={`p-4 rounded-xl glass border ${color}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-xs text-midnight-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {subValue && <p className="text-xs text-midnight-500">{subValue}</p>}
        </div>
      </div>
    </div>
  )
}

export default function PNodesPage() {
  const { isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          pNode <span className="gradient-text">Directory</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">
          Browse all pNodes from the Xandeum network. 
          Data is fetched live from pRPC API.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatBox
            icon={<Server className="w-5 h-5 text-xandeum-400" />}
            label="Total pNodes"
            value={isLoading ? '...' : stats?.totalNodes || 0}
            subValue={`${stats?.activeNodes || 0} active`}
            color="border-xandeum-500/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatBox
            icon={<HardDrive className="w-5 h-5 text-aurora-400" />}
            label="Total Storage"
            value={formatBytes(stats?.totalStorageCommitted)}
            subValue={`${formatBytes(stats?.totalStorageUsed)} used`}
            color="border-aurora-500/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatBox
            icon={<Clock className="w-5 h-5 text-ember-400" />}
            label="Avg Uptime"
            value={formatUptime(stats?.averageUptime)}
            subValue="Network reliability"
            color="border-ember-500/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatBox
            icon={<Globe className="w-5 h-5 text-purple-400" />}
            label="Public Nodes"
            value={stats?.publicNodes || 0}
            subValue={`${stats?.privateNodes || 0} private`}
            color="border-purple-500/30"
          />
        </motion.div>
      </div>

      {/* Node Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PNodeTable />
      </motion.div>
    </DashboardLayout>
  )
}

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
    <div className={`p-4 rounded-xl glass border ${color} h-full flex flex-col`}>
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
          {icon}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xs text-midnight-400 mb-1 flex-shrink-0">{label}</p>
          <p className="text-xl font-bold text-white flex-shrink-0 mb-1">{value}</p>
          <div className="mt-auto h-[18px] flex-shrink-0">
            {subValue && <p className="text-xs text-midnight-500 leading-tight text-left">{subValue}</p>}
          </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={{ gridAutoRows: '1fr' }}>
        {/* Position 1: Total pNodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          <StatBox
            icon={<Server className="w-5 h-5 text-xandeum-400" />}
            label="Total pNodes"
            value={isLoading ? '...' : stats?.totalNodes || 0}
            subValue={`${stats?.activeNodes || 0} active`}
            color="border-xandeum-500/30"
          />
        </motion.div>

        {/* Position 2: Public Nodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="h-full"
        >
          <StatBox
            icon={<Globe className="w-5 h-5 text-purple-400" />}
            label="Public Nodes"
            value={stats?.publicNodes || 0}
            subValue={`${stats?.privateNodes || 0} private`}
            color="border-purple-500/30"
          />
        </motion.div>

        {/* Position 3: Total Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <StatBox
            icon={<HardDrive className="w-5 h-5 text-aurora-400" />}
            label="Total Storage"
            value={formatBytes(stats?.totalStorageCommitted)}
            subValue={`${formatBytes(stats?.totalStorageUsed)} used`}
            color="border-aurora-500/30"
          />
        </motion.div>

        {/* Position 4: Avg Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="h-full"
        >
          <StatBox
            icon={<Clock className="w-5 h-5 text-ember-400" />}
            label="Avg Uptime"
            value={formatUptime(stats?.averageUptime)}
            subValue="Network reliability"
            color="border-ember-500/30"
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

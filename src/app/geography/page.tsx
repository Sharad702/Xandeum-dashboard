'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { usePNodes, useNetworkStats } from '@frontend/hooks/usePNodes'
import { shortenPubkey } from '@frontend/utils/formatters'
import { Globe2, Server, Lock, Globe } from 'lucide-react'

export default function GeographyPage() {
  const { data, isLoading } = usePNodes()
  const { data: stats } = useNetworkStats()
  const pnodes = data?.pods || []

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Geographic <span className="gradient-text">Distribution</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">Node location data from the network.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-xandeum-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-xandeum-400" />
              <span className="text-xs text-midnight-400">Total pNodes</span>
            </div>
            <p className="text-2xl font-bold text-white">{isLoading ? '...' : stats?.totalNodes || 0}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-aurora-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-aurora-400" />
              <span className="text-xs text-midnight-400">Public</span>
            </div>
            <p className="text-2xl font-bold text-white">{isLoading ? '...' : stats?.publicNodes || 0}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-ember-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-ember-400" />
              <span className="text-xs text-midnight-400">Private</span>
            </div>
            <p className="text-2xl font-bold text-white">{isLoading ? '...' : stats?.privateNodes || 0}</p>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-xandeum-500/10 to-xandeum-600/5 border-xandeum-500/20">
          <CardContent className="py-12">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-xandeum-500/20 flex items-center justify-center mx-auto mb-6">
                <Globe2 className="w-10 h-10 text-xandeum-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Geographic Data</h2>
              <p className="text-midnight-300 mb-6">
                Geographic location data would require IP geolocation services.
                Currently showing IP addresses from gossip protocol.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
        <Card>
          <CardHeader><CardTitle>pNode Addresses (Sample)</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-midnight-800/50 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pnodes.slice(0, 20).map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-2 rounded bg-midnight-900/50">
                    <span className="font-mono text-sm text-midnight-300">{shortenPubkey(node.pubkey, 8)}</span>
                    <span className="font-mono text-sm text-xandeum-400">{node.address}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-midnight-500 mt-4">Showing first 20 nodes.</p>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}

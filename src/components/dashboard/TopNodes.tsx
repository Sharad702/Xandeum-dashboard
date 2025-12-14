'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { usePNodes } from '@frontend/hooks/usePNodes'
import { shortenPubkey } from '@frontend/utils/formatters'
import { TrendingUp, Server, HardDrive, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function TopNodes() {
  const { data, isLoading } = usePNodes()
  const pnodes = data?.pods || []

  const topByUptime = useMemo(() => {
    return [...pnodes]
      .filter(p => p.status === 'online')
      .sort((a, b) => b.uptime - a.uptime)
      .slice(0, 5)
  }, [pnodes])

  const topByStorage = useMemo(() => {
    return [...pnodes]
      .filter(p => p.storageCommitted > 0)
      .sort((a, b) => b.storageCommitted - a.storageCommitted)
      .slice(0, 5)
  }, [pnodes])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <div className="h-64 bg-midnight-800/50 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top by Uptime */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-aurora-400" />
              Top by Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByUptime.map((node, index) => (
                <div 
                  key={node.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-aurora-500/20 text-aurora-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-white truncate">{shortenPubkey(node.pubkey, 6)}</p>
                    <p className="text-xs text-midnight-500">{node.address}</p>
                  </div>
                  <Badge variant="success" className="text-xs">{node.uptimeFormatted}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top by Storage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-xandeum-400" />
              Top by Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByStorage.map((node, index) => (
                <div 
                  key={node.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-xandeum-500/20 text-xandeum-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-white truncate">{shortenPubkey(node.pubkey, 6)}</p>
                    <p className="text-xs text-midnight-500">{node.address}</p>
                  </div>
                  <Badge variant="info" className="text-xs">{node.storageCommittedFormatted}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-2 text-center"
      >
        <Link href="/pnodes">
          <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            View All {pnodes.length} pNodes
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}


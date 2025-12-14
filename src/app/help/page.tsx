'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  ExternalLink,
  Server,
  Database,
  Activity,
  Globe2
} from 'lucide-react'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <h4 className="text-sm font-medium text-white mb-2">{question}</h4>
      <p className="text-sm text-midnight-400">{answer}</p>
    </div>
  )
}

function ResourceCard({ 
  icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card hover className="h-full">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-xandeum-500/10 text-xandeum-400">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white">{title}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-midnight-500" />
            </div>
            <p className="text-sm text-midnight-400 mt-1">{description}</p>
          </div>
        </div>
      </Card>
    </a>
  )
}

export default function HelpPage() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Help & <span className="gradient-text">Documentation</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">
          Learn how to use the Xandeum pNode Analytics dashboard and find answers to common questions.
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <ResourceCard
          icon={<Book className="w-5 h-5" />}
          title="Documentation"
          description="Official Xandeum pRPC documentation"
          href="https://xandeum.network/docs"
        />
        <ResourceCard
          icon={<MessageCircle className="w-5 h-5" />}
          title="Discord Community"
          description="Join the Xandeum Discord server"
          href="https://discord.gg/uqRSmmM5m"
        />
        <ResourceCard
          icon={<Globe2 className="w-5 h-5" />}
          title="Xandeum Website"
          description="Learn more about Xandeum"
          href="https://xandeum.network"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-xandeum-400" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-midnight-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-xandeum-500/20 flex items-center justify-center text-sm font-bold text-xandeum-400">1</div>
                  <h4 className="font-medium text-white">Explore the Dashboard</h4>
                </div>
                <p className="text-sm text-midnight-400 ml-11">
                  The main dashboard provides an overview of network health, including total pNodes, storage capacity, and uptime metrics.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-midnight-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-xandeum-500/20 flex items-center justify-center text-sm font-bold text-xandeum-400">2</div>
                  <h4 className="font-medium text-white">Browse pNodes</h4>
                </div>
                <p className="text-sm text-midnight-400 ml-11">
                  Navigate to the pNodes page to see a complete list of all storage providers. Filter by status, region, or search by pubkey.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-midnight-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-xandeum-500/20 flex items-center justify-center text-sm font-bold text-xandeum-400">3</div>
                  <h4 className="font-medium text-white">Analyze Trends</h4>
                </div>
                <p className="text-sm text-midnight-400 ml-11">
                  Use the Trends and Statistics pages to monitor network growth, performance patterns, and geographic distribution.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-aurora-400" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FAQItem
                question="What is a pNode?"
                answer="A pNode (provider node) is a storage provider in the Xandeum network. pNodes store data off-chain while maintaining integrity through the Solana blockchain, enabling scalable decentralized storage for dApps."
              />
              <FAQItem
                question="How often is the data refreshed?"
                answer="Data is automatically refreshed every 60 seconds. You can also manually refresh by clicking the Refresh button in the header."
              />
              <FAQItem
                question="What do the status indicators mean?"
                answer="Online (green) means the pNode is actively serving requests. Syncing (orange) indicates the node is catching up. Offline (red) means the node is not responding."
              />
              <FAQItem
                question="How is uptime calculated?"
                answer="Uptime is calculated based on successful health check responses over the past epoch. A 99%+ uptime is considered excellent."
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Glossary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-ember-400" />
                Glossary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-4 h-4 text-xandeum-400" />
                    <h4 className="font-medium text-white text-sm">pNode</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    Provider node that stores data in the Xandeum storage layer
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-aurora-400" />
                    <h4 className="font-medium text-white text-sm">Storage Capacity</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    Total available storage space on a pNode
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-ember-400" />
                    <h4 className="font-medium text-white text-sm">Skip Rate</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    Percentage of slots where the node failed to produce a block
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe2 className="w-4 h-4 text-purple-400" />
                    <h4 className="font-medium text-white text-sm">Gossip</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    Protocol for nodes to discover and communicate with each other
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-xandeum-400" />
                    <h4 className="font-medium text-white text-sm">Epoch</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    A period of ~2-3 days used for staking and rewards
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-midnight-900/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-aurora-400" />
                    <h4 className="font-medium text-white text-sm">TPS</h4>
                  </div>
                  <p className="text-xs text-midnight-400">
                    Transactions per second processed by the network
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}


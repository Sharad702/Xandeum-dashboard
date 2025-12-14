'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { RefreshCw, Globe2, Palette, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSettings } from '@/contexts/SettingsContext'

function SettingRow({ 
  title, 
  description, 
  children 
}: { 
  title: string
  description: string
  children: React.ReactNode 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-midnight-400 mt-0.5">{description}</p>
      </div>
      <div className="sm:text-right">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { refreshInterval, setRefreshInterval } = useSettings()

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-midnight-400 max-w-2xl">
          Configure your dashboard preferences and network connections.
        </p>
      </motion.div>

      <div className="grid gap-6 max-w-3xl">
        {/* Network Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-xandeum-400" />
                Network Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SettingRow
                title="Network"
                description="Current network connection"
              >
                <Badge variant="success" dot pulse>
                  Mainnet
                </Badge>
              </SettingRow>

              <SettingRow
                title="Connection Status"
                description="Real-time connection to pRPC endpoint"
              >
                <Badge variant="success">Connected</Badge>
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Refresh Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-aurora-400" />
                Data Refresh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SettingRow
                title="Auto Refresh Interval"
                description="How often to fetch new pNode data (in seconds)"
              >
                <div className="flex gap-2">
                  {[30, 60, 120, 300].map((interval) => (
                    <Button
                      key={interval}
                      variant={refreshInterval === interval ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setRefreshInterval(interval)}
                    >
                      {interval}s
                    </Button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow
                title="Cache Duration"
                description="How long to cache data before refetching"
              >
                <span className="text-sm text-midnight-300">{refreshInterval} seconds</span>
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-ember-400" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SettingRow
                title="Theme"
                description="Dashboard color theme"
              >
                <div className="flex gap-2">
                  <Button 
                    variant={theme === 'dark' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTheme('dark')}
                    icon={<Moon className="w-4 h-4" />}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={theme === 'light' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTheme('light')}
                    icon={<Sun className="w-4 h-4" />}
                  >
                    Light
                  </Button>
                </div>
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </DashboardLayout>
  )
}


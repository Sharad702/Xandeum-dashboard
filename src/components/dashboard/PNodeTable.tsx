'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronDown, ChevronUp, Copy, Check, Server, Globe, Lock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { usePNodes } from '@frontend/hooks/usePNodes'
import { shortenPubkey, copyToClipboard, cn } from '@frontend/utils/formatters'
import type { PNode } from '@frontend/types'

type SortField = 'uptime' | 'storage' | 'lastSeen'
type SortDirection = 'asc' | 'desc'
type StatusFilter = 'all' | 'online' | 'offline' | 'syncing'
type VisibilityFilter = 'all' | 'public' | 'private'

function PNodeRow({ pnode, index }: { pnode: PNode; index: number }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (await copyToClipboard(pnode.pubkey)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusVariant = pnode.status === 'online' ? 'success' : pnode.status === 'syncing' ? 'warning' : 'danger'

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)} 
        className="group border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
        style={{ animation: `fadeIn 0.2s ease-out ${index * 0.02}s both` }}
      >
        <td className="py-4 pl-4 pr-2">
          <div className="flex items-center gap-3">
            <div className={cn('w-2 h-2 rounded-full', pnode.status === 'online' && 'bg-aurora-400 shadow-lg shadow-aurora-400/50', pnode.status === 'syncing' && 'bg-ember-400', pnode.status === 'offline' && 'bg-red-400')} />
            <div className="p-2 rounded-lg bg-midnight-800/50"><Server className="w-4 h-4 text-midnight-400" /></div>
          </div>
        </td>
        <td className="py-4 px-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-white">{shortenPubkey(pnode.pubkey, 6)}</span>
            <button onClick={handleCopy} className="p-1 text-midnight-500 hover:text-xandeum-400">
              {copied ? <Check className="w-3.5 h-3.5 text-aurora-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs text-midnight-500 mt-0.5">{pnode.address}</p>
        </td>
        <td className="py-4 px-3"><Badge variant={statusVariant} dot>{pnode.status}</Badge></td>
        <td className="py-4 px-3 hidden md:table-cell">
          <div className="flex items-center gap-1.5">
            {pnode.isPublic ? <><Globe className="w-3.5 h-3.5 text-aurora-400" /><span className="text-sm text-aurora-400">Public</span></> : <><Lock className="w-3.5 h-3.5 text-midnight-400" /><span className="text-sm text-midnight-400">Private</span></>}
          </div>
        </td>
        <td className="py-4 px-3 hidden md:table-cell"><span className="text-sm text-midnight-300">{pnode.version}</span></td>
        <td className="py-4 px-3 hidden lg:table-cell">
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-midnight-400">{pnode.storageUsedFormatted}</span>
              <span className="text-midnight-500">{pnode.storageCommittedFormatted}</span>
            </div>
            <Progress value={pnode.storageUsagePercent} size="sm" variant={pnode.storageUsagePercent > 90 ? 'danger' : pnode.storageUsagePercent > 70 ? 'warning' : 'success'} />
          </div>
        </td>
        <td className="py-4 px-3 hidden xl:table-cell"><span className="text-sm text-midnight-300">{pnode.uptimeFormatted}</span></td>
        <td className="py-4 pl-3 pr-4"><button className="p-1.5 text-midnight-500 hover:text-white">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button></td>
      </tr>
      {expanded && (
        <tr className="bg-midnight-900/50">
          <td colSpan={8} className="border-b border-white/5">
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-midnight-500 mb-1">Full Pubkey</p><p className="text-xs font-mono text-midnight-300 break-all">{pnode.pubkey}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">IP Address</p><p className="text-sm text-midnight-300">{pnode.ip}:{pnode.port}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">RPC Port</p><p className="text-sm text-midnight-300">{pnode.rpcPort}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">Version</p><p className="text-sm text-midnight-300">{pnode.version}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">Storage Committed</p><p className="text-sm text-midnight-300">{pnode.storageCommittedFormatted}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">Storage Used</p><p className="text-sm text-midnight-300">{pnode.storageUsedFormatted}</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">Usage</p><p className="text-sm text-midnight-300">{pnode.storageUsagePercent.toFixed(4)}%</p></div>
              <div><p className="text-xs text-midnight-500 mb-1">Uptime</p><p className="text-sm text-midnight-300">{pnode.uptimeFormatted}</p></div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function PNodeTable() {
  const { data, isLoading, isError, error } = usePNodes()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
  const [sortField, setSortField] = useState<SortField>('uptime')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const pnodes = data?.pods || []

  // Count nodes by status for filter buttons
  const statusCounts = useMemo(() => {
    return {
      all: pnodes.length,
      online: pnodes.filter(p => p.status === 'online').length,
      syncing: pnodes.filter(p => p.status === 'syncing').length,
      offline: pnodes.filter(p => p.status === 'offline').length,
    }
  }, [pnodes])

  // Count nodes by visibility
  const visibilityCounts = useMemo(() => {
    return {
      all: pnodes.length,
      public: pnodes.filter(p => p.isPublic === true).length,
      private: pnodes.filter(p => p.isPublic === false).length,
    }
  }, [pnodes])

  const filteredPNodes = useMemo(() => {
    let result = [...pnodes]
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(p => 
        p.pubkey?.toLowerCase().includes(q) || 
        p.address?.toLowerCase().includes(q) || 
        p.version?.toLowerCase().includes(q) ||
        p.ip?.toLowerCase().includes(q)
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }
    
    // Visibility filter
    if (visibilityFilter !== 'all') {
      result = result.filter(p => visibilityFilter === 'public' ? p.isPublic === true : p.isPublic === false)
    }
    
    // Sorting
    result.sort((a, b) => {
      let aVal: number, bVal: number
      switch (sortField) {
        case 'uptime':
          aVal = a.uptime || 0
          bVal = b.uptime || 0
          break
        case 'storage':
          aVal = a.storageCommitted || 0
          bVal = b.storageCommitted || 0
          break
        case 'lastSeen':
        default:
          aVal = a.lastSeen || 0
          bVal = b.lastSeen || 0
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
    
    return result
  }, [pnodes, searchQuery, statusFilter, visibilityFilter, sortField, sortDirection])

  // Pagination calculations
  const totalPages = Math.ceil(filteredPNodes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPNodes = filteredPNodes.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = (type: 'status' | 'visibility' | 'search', value: string) => {
    setCurrentPage(1)
    if (type === 'status') setStatusFilter(value as StatusFilter)
    if (type === 'visibility') setVisibilityFilter(value as VisibilityFilter)
    if (type === 'search') setSearchQuery(value)
  }

  if (isError) return <Card className="p-8 text-center"><p className="text-red-400 mb-2">Failed to load pNode data</p><p className="text-sm text-midnight-400">{error?.message}</p></Card>

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-white/5 !mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>pNode Directory</CardTitle>
            <p className="text-sm text-midnight-400 mt-1">{filteredPNodes.length} of {pnodes.length} pNodes<span className="text-aurora-400 ml-2">• Live from Xandeum pRPC</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input placeholder="Search..." icon={<Search className="w-4 h-4" />} value={searchQuery} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full sm:w-64" />
            <Button variant="outline" size="md" icon={<Filter className="w-4 h-4" />} onClick={() => setShowFilters(!showFilters)}>Filters</Button>
          </div>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-6">
                <div>
                  <label className="text-xs text-midnight-500 mb-1.5 block">Status</label>
                  <div className="flex gap-2">
                    {(['all', 'online', 'syncing', 'offline'] as StatusFilter[]).map(s => (
                      <Button 
                        key={s} 
                        variant={statusFilter === s ? 'primary' : 'ghost'} 
                        size="sm" 
                        onClick={() => handleFilterChange('status', s)}
                      >
                        {s} <span className="ml-1 opacity-60">({statusCounts[s]})</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-midnight-500 mb-1.5 block">Visibility</label>
                  <div className="flex gap-2">
                    {(['all', 'public', 'private'] as VisibilityFilter[]).map(v => (
                      <Button 
                        key={v} 
                        variant={visibilityFilter === v ? 'primary' : 'ghost'} 
                        size="sm" 
                        onClick={() => handleFilterChange('visibility', v)}
                      >
                        {v} <span className="ml-1 opacity-60">({visibilityCounts[v]})</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      {isLoading ? <div className="p-4"><TableSkeleton rows={10} /></div> : (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[#13131f] shadow-[0_-10px_0_0_#13131f]">
              <tr className="border-b border-midnight-700">
                <th className="text-left py-4 pl-4 pr-2 text-xs font-semibold text-midnight-300 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider">pNode</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider">State</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider hidden md:table-cell">Visibility</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider hidden md:table-cell">Version</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider hidden lg:table-cell">Storage</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-midnight-300 uppercase tracking-wider hidden xl:table-cell">Uptime</th>
                <th className="text-left py-4 pl-3 pr-4 text-xs font-semibold text-midnight-300 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody key={`${statusFilter}-${visibilityFilter}-${searchQuery}-${currentPage}`}>
              {paginatedPNodes.map((pnode, i) => (
                <PNodeRow key={`${pnode.id}-${pnode.pubkey}`} pnode={pnode} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination Controls */}
      {!isLoading && filteredPNodes.length > 0 && (
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-midnight-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPNodes.length)} of {filteredPNodes.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-midnight-500">Per page:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-midnight-800 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-xandeum-500"
              >
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="min-w-[36px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
      
      {!isLoading && filteredPNodes.length === 0 && (
        <div className="p-12 text-center">
          <Server className="w-12 h-12 text-midnight-600 mx-auto mb-4" />
          <p className="text-midnight-400">No pNodes found.</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setVisibilityFilter('all'); setCurrentPage(1); }}>Clear filters</Button>
        </div>
      )}
    </Card>
  )
}

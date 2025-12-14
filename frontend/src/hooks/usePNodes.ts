/**
 * usePNodes Hook
 */

'use client';

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPNodes, checkHealth } from '../api/client';
import type { PNode, NetworkStats, ConnectionStatus } from '../types';

const CACHE_STALE_TIME = 10000;
const DEFAULT_REFETCH_INTERVAL = 30000;

export const queryKeys = {
  pnodes: ['pnodes'] as const,
  health: ['health'] as const,
};

// Hook to get refresh interval from localStorage (works on client only)
function getRefreshInterval(): number {
  if (typeof window === 'undefined') return DEFAULT_REFETCH_INTERVAL;
  const saved = localStorage.getItem('xandeum-refresh-interval');
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed)) return parsed * 1000; // Convert to milliseconds
  }
  return DEFAULT_REFETCH_INTERVAL;
}

export function usePNodes() {
  const refetchInterval = getRefreshInterval();
  
  return useQuery({
    queryKey: queryKeys.pnodes,
    queryFn: async () => {
      const { pods, stats, endpoint } = await fetchPNodes(true);
      return { pods, stats, endpoint };
    },
    staleTime: CACHE_STALE_TIME,
    refetchInterval: refetchInterval,
  });
}

export function usePNode(id: string) {
  const { data, ...rest } = usePNodes();
  const pnode = data?.pods.find((p: PNode) => p.id === id || p.pubkey === id);
  return { data: pnode, ...rest };
}

export function useNetworkStats() {
  const { data, ...rest } = usePNodes();
  return { data: data?.stats as NetworkStats | undefined, ...rest };
}

export function useConnectionHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: checkHealth,
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

export function useConnectionStatus(): ConnectionStatus {
  const { data, error, isLoading } = usePNodes();

  return useMemo(() => {
    if (isLoading) {
      return { isConnected: false, endpoint: null, lastUpdate: null, error: null };
    }

    if (error) {
      return {
        isConnected: false,
        endpoint: null,
        lastUpdate: null,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }

    return {
      isConnected: true,
      endpoint: data?.endpoint || null,
      lastUpdate: data?.stats?.lastUpdated || null,
      error: null,
    };
  }, [data?.endpoint, data?.stats?.lastUpdated, error, isLoading]);
}

export function useRefreshPNodes() {
  const queryClient = useQueryClient();
  return {
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.pnodes }),
    refreshAll: () => queryClient.invalidateQueries(),
  };
}

export function useVersionDistribution() {
  const { data, ...rest } = usePNodes();
  const versions = data?.stats?.versions || {};
  const distribution = Object.entries(versions)
    .map(([version, count]) => ({ version, count: count as number }))
    .sort((a, b) => b.count - a.count);
  return { data: distribution, ...rest };
}

export function useFilteredPNodes(
  search: string = '',
  statusFilter: 'all' | 'online' | 'offline' | 'syncing' = 'all',
  visibilityFilter: 'all' | 'public' | 'private' = 'all'
) {
  const { data, ...rest } = usePNodes();
  let filtered = data?.pods || [];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p: PNode) =>
        p.pubkey.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower) ||
        p.ip.toLowerCase().includes(searchLower) ||
        p.version.toLowerCase().includes(searchLower)
    );
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter((p: PNode) => p.status === statusFilter);
  }

  if (visibilityFilter !== 'all') {
    filtered = filtered.filter((p: PNode) =>
      visibilityFilter === 'public' ? p.isPublic : !p.isPublic
    );
  }

  return {
    data: filtered,
    totalCount: data?.pods.length || 0,
    filteredCount: filtered.length,
    ...rest,
  };
}


/**
 * Data Transformer Service
 * Transforms raw pRPC data into frontend-friendly formats
 */

import type { RawPodData, PNodeData, NetworkStats } from '../types/pnode';

function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds: number | null | undefined): string {
  if (!seconds) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function determineStatus(lastSeenTimestamp: number, uptime: number | null): 'online' | 'offline' | 'syncing' {
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastSeen = now - lastSeenTimestamp;
  if (timeSinceLastSeen < 120) {
    if (uptime !== null && uptime < 300) return 'syncing';
    return 'online';
  }
  if (timeSinceLastSeen < 600) return 'syncing';
  return 'offline';
}

function parseAddress(address: string): { ip: string; port: number } {
  const [ip, portStr] = address.split(':');
  return { ip: ip || 'unknown', port: parseInt(portStr) || 0 };
}

export function transformPodData(raw: RawPodData): PNodeData {
  const { ip, port } = parseAddress(raw.address);
  const status = determineStatus(raw.last_seen_timestamp, raw.uptime);

  return {
    id: raw.pubkey || raw.address,
    pubkey: raw.pubkey || 'Unknown',
    address: raw.address,
    ip,
    port,
    version: raw.version || 'unknown',
    isPublic: raw.is_public ?? false,
    lastSeen: raw.last_seen_timestamp,
    lastSeenFormatted: formatRelativeTime(raw.last_seen_timestamp),
    uptime: raw.uptime || 0,
    uptimeFormatted: formatUptime(raw.uptime),
    storageCommitted: raw.storage_committed || 0,
    storageCommittedFormatted: formatBytes(raw.storage_committed),
    storageUsed: raw.storage_used || 0,
    storageUsedFormatted: formatBytes(raw.storage_used),
    storageUsagePercent: (raw.storage_usage_percent || 0) * 100,
    status,
    rpcPort: raw.rpc_port || 6000,
  };
}

export function transformPodsArray(pods: RawPodData[]): PNodeData[] {
  return pods
    .map(transformPodData)
    .sort((a, b) => {
      const statusOrder = { online: 0, syncing: 1, offline: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.storageCommitted - a.storageCommitted;
    });
}

export function calculateNetworkStats(pods: RawPodData[]): NetworkStats {
  const now = Math.floor(Date.now() / 1000);
  const activeThreshold = 120;

  let totalStorageCommitted = 0;
  let totalStorageUsed = 0;
  let totalUptime = 0;
  let activeNodes = 0;
  let publicNodes = 0;
  let privateNodes = 0;
  const versions: Record<string, number> = {};

  for (const pod of pods) {
    totalStorageCommitted += pod.storage_committed || 0;
    totalStorageUsed += pod.storage_used || 0;
    totalUptime += pod.uptime || 0;
    if (now - pod.last_seen_timestamp < activeThreshold) activeNodes++;
    if (pod.is_public) publicNodes++;
    else privateNodes++;
    const version = pod.version || 'unknown';
    versions[version] = (versions[version] || 0) + 1;
  }

  return {
    totalNodes: pods.length,
    activeNodes,
    publicNodes,
    privateNodes,
    totalStorageCommitted,
    totalStorageUsed,
    averageStorageUsage: pods.length > 0 
      ? (totalStorageUsed / totalStorageCommitted) * 100 || 0
      : 0,
    averageUptime: pods.length > 0 ? totalUptime / pods.length : 0,
    versions,
    lastUpdated: Date.now(),
  };
}


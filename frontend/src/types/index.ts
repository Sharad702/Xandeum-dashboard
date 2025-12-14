/**
 * Frontend Types
 */

export interface PNode {
  id: string;
  pubkey: string;
  address: string;
  ip: string;
  port: number;
  version: string;
  isPublic: boolean;
  lastSeen: number;
  lastSeenFormatted: string;
  uptime: number;
  uptimeFormatted: string;
  storageCommitted: number;
  storageCommittedFormatted: string;
  storageUsed: number;
  storageUsedFormatted: string;
  storageUsagePercent: number;
  status: 'online' | 'offline' | 'syncing';
  rpcPort: number;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  publicNodes: number;
  privateNodes: number;
  totalStorageCommitted: number;
  totalStorageUsed: number;
  averageStorageUsage: number;
  averageUptime: number;
  versions: Record<string, number>;
  lastUpdated: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  endpoint?: string;
}

export type SortField = 
  | 'pubkey' 
  | 'address' 
  | 'version' 
  | 'uptime' 
  | 'storageCommitted' 
  | 'storageUsed' 
  | 'storageUsagePercent' 
  | 'status';

export type SortDirection = 'asc' | 'desc';

export interface PNodeFilters {
  search: string;
  status: 'all' | 'online' | 'offline' | 'syncing';
  visibility: 'all' | 'public' | 'private';
  version: string | 'all';
}

export interface ConnectionStatus {
  isConnected: boolean;
  endpoint: string | null;
  lastUpdate: number | null;
  error: string | null;
}


/**
 * Backend Types for pNode Data
 * These types represent the raw data from the Xandeum pRPC API
 */

/**
 * Raw pNode data from get-pods-with-stats RPC response
 */
export interface RawPodData {
  address: string;
  is_public: boolean | null;
  last_seen_timestamp: number;
  pubkey: string | null;
  rpc_port: number | null;
  storage_committed: number | null;
  storage_usage_percent: number | null;
  storage_used: number | null;
  uptime: number | null;
  version: string;
}

/**
 * Response from get-pods-with-stats RPC call
 */
export interface GetPodsWithStatsResponse {
  pods: RawPodData[];
  total_count: number;
}

/**
 * JSON-RPC 2.0 Response wrapper
 */
export interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
  _endpoint?: string;
}

/**
 * Processed pNode data for frontend consumption
 */
export interface PNodeData {
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

/**
 * Network statistics aggregated from all pNodes
 */
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

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  endpoint?: string;
  nodeCount?: number;
  message?: string;
}


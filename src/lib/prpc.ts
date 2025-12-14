/**
 * pRPC - Re-exports from backend and frontend
 */
export type { PNode } from '@frontend/types';
export type { RawPodData, GetPodsWithStatsResponse, PNodeData, NetworkStats } from '@backend/types/pnode';
export { formatBytes, formatUptime } from '@frontend/utils/formatters';
export { prpcClient, PRpcClient } from '@backend/services/prpc-client';

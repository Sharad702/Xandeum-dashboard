/**
 * Backend Configuration
 * Centralized configuration for pRPC endpoints and settings
 */

/**
 * Public pNode endpoints with pRPC access
 * These are Xandeum network nodes running the pRPC service
 */
export const PNODE_ENDPOINTS = [
  'http://173.212.203.145:6000/rpc',
  'http://173.212.220.65:6000/rpc',
  'http://161.97.97.41:6000/rpc',
  'http://192.190.136.36:6000/rpc',
  'http://192.190.136.37:6000/rpc',
  'http://192.190.136.38:6000/rpc',
  'http://192.190.136.28:6000/rpc',
  'http://192.190.136.29:6000/rpc',
  'http://207.244.255.1:6000/rpc',
] as const;

/**
 * RPC Methods available on Xandeum pNodes
 */
export const RPC_METHODS = {
  GET_PODS_WITH_STATS: 'get-pods-with-stats',
} as const;

/**
 * Request timeout settings (in milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT: 15000,
  HEALTH_CHECK: 5000,
} as const;

/**
 * Cache settings (in milliseconds)
 */
export const CACHE = {
  PNODE_DATA_TTL: 30000, // 30 seconds
  STALE_TIME: 10000,     // 10 seconds
} as const;


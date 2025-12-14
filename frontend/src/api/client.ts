/**
 * Frontend API Client
 */

import type { PNode, NetworkStats } from '../types';

const API_BASE = '/api';

interface ApiResponse<T> {
  result?: T;
  error?: { code: number; message: string };
  _endpoint?: string;
}

interface PNodesResponse {
  pods: PNode[];
  stats: NetworkStats;
  total_count: number;
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'error';
  endpoint?: string;
  nodeCount?: number;
  message?: string;
  timestamp: number;
}

export async function fetchPNodes(transform: boolean = true): Promise<{
  pods: PNode[];
  stats: NetworkStats;
  endpoint: string;
}> {
  const response = await fetch(`${API_BASE}/prpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'get-pods-with-stats',
      id: Date.now(),
      transform,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: ApiResponse<PNodesResponse> = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.result) {
    throw new Error('No data received from API');
  }

  return {
    pods: data.result.pods,
    stats: data.result.stats,
    endpoint: data._endpoint || 'unknown',
  };
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/prpc`, { method: 'GET' });
  return response.json();
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async getPNodes(transform: boolean = true) {
    return fetchPNodes(transform);
  }

  async getHealth() {
    return checkHealth();
  }
}

export const apiClient = new ApiClient();


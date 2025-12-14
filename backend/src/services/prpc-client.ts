/**
 * pRPC Client Service
 * Handles all communication with Xandeum pNode RPC endpoints
 */

import http from 'http';
import { PNODE_ENDPOINTS, TIMEOUTS, RPC_METHODS } from '../config/endpoints';
import type { 
  GetPodsWithStatsResponse, 
  JsonRpcResponse,
  HealthCheckResponse 
} from '../types/pnode';

/**
 * Makes an HTTP request using native Node.js http module
 */
function makeHttpRequest<T>(
  urlString: string, 
  payload: object, 
  timeout: number = TIMEOUTS.DEFAULT
): Promise<{ data: JsonRpcResponse<T>; endpoint: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      port: parseInt(url.port) || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Accept': 'application/json',
      },
      timeout,
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ data: jsonData, endpoint: urlString });
        } catch {
          reject(new Error(`Invalid JSON response: ${body.substring(0, 100)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

/**
 * pRPC Client Class
 */
export class PRpcClient {
  private endpoints: readonly string[];
  private currentEndpointIndex: number = 0;

  constructor(endpoints: readonly string[] = PNODE_ENDPOINTS) {
    this.endpoints = endpoints;
  }

  /**
   * Try each endpoint until one succeeds
   */
  private async tryEndpoints<T>(
    method: string,
    params?: object,
    id: number = 1
  ): Promise<{ data: JsonRpcResponse<T>; endpoint: string }> {
    const payload = {
      jsonrpc: '2.0',
      id,
      method,
      ...(params ? { params } : {}),
    };

    const errors: string[] = [];

    for (let i = 0; i < this.endpoints.length; i++) {
      const endpointIndex = (this.currentEndpointIndex + i) % this.endpoints.length;
      const endpoint = this.endpoints[endpointIndex];

      try {
        console.log(`[PRpcClient] Trying endpoint: ${endpoint}`);
        const result = await makeHttpRequest<T>(endpoint, payload);
        this.currentEndpointIndex = endpointIndex;
        console.log(`[PRpcClient] Success from ${endpoint}`);
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`[PRpcClient] Endpoint ${endpoint} failed:`, errorMsg);
        errors.push(`${endpoint}: ${errorMsg}`);
      }
    }

    throw new Error(`All endpoints failed: ${errors.join(', ')}`);
  }

  /**
   * Get all pods with their statistics
   */
  async getPodsWithStats(id: number = 1): Promise<JsonRpcResponse<GetPodsWithStatsResponse>> {
    const { data, endpoint } = await this.tryEndpoints<GetPodsWithStatsResponse>(
      RPC_METHODS.GET_PODS_WITH_STATS,
      undefined,
      id
    );
    
    return { ...data, _endpoint: endpoint };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const { data, endpoint } = await this.tryEndpoints<GetPodsWithStatsResponse>(
        RPC_METHODS.GET_PODS_WITH_STATS,
        undefined,
        1
      );

      return {
        status: 'ok',
        endpoint,
        nodeCount: data.result?.pods?.length || data.result?.total_count || 0,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }

  getEndpoints(): readonly string[] {
    return this.endpoints;
  }

  getCurrentEndpoint(): string {
    return this.endpoints[this.currentEndpointIndex];
  }
}

export const prpcClient = new PRpcClient();


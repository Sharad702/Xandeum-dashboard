/**
 * pRPC API Route
 * Proxies requests to Xandeum pNode RPC endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { prpcClient } from '@backend/services/prpc-client';
import { transformPodsArray, calculateNetworkStats } from '@backend/services/data-transformer';
import type { RawPodData } from '@backend/types/pnode';

/**
 * POST /api/prpc
 */
export async function POST(request: NextRequest) {
  console.log('[API] POST /api/prpc');

  try {
    const body = await request.json();
    const { method, id, transform = false } = body;

    const response = await prpcClient.getPodsWithStats(id || 1);

    if (response.error) {
      return NextResponse.json(response, { status: 400 });
    }

    if (transform && response.result?.pods) {
      const processedPods = transformPodsArray(response.result.pods as RawPodData[]);
      const networkStats = calculateNetworkStats(response.result.pods as RawPodData[]);

      return NextResponse.json({
        jsonrpc: '2.0',
        id: id || 1,
        result: {
          pods: processedPods,
          stats: networkStats,
          total_count: response.result.total_count,
        },
        _endpoint: response._endpoint,
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error:', errorMsg);

    return NextResponse.json(
      { error: { code: -1, message: errorMsg }, jsonrpc: '2.0', id: 1 },
      { status: 503 }
    );
  }
}

/**
 * GET /api/prpc - Health check
 */
export async function GET() {
  try {
    const health = await prpcClient.healthCheck();
    
    if (health.status === 'ok') {
      return NextResponse.json({
        status: 'healthy',
        endpoint: health.endpoint,
        nodeCount: health.nodeCount,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { status: 'unhealthy', message: health.message, timestamp: Date.now() },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Health check failed', timestamp: Date.now() },
      { status: 500 }
    );
  }
}

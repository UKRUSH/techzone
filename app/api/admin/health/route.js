import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Quick health check with very short timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Health check timeout')), 1000)
    );

    const healthPromise = prisma.product.count({ take: 1 });

    await Promise.race([healthPromise, timeoutPromise]);

    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: true,
      status: 'degraded',
      database: 'disconnected',
      message: 'Using fallback data',
      timestamp: new Date().toISOString()
    });
  }
}

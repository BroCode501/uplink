import { NextRequest, NextResponse } from 'next/server';
import { getDomainStats, getCurrentDomain } from '@/lib/domain-config';

/**
 * GET /api/config/domains
 * 
 * Returns domain configuration information
 * Safe to call from frontend (no sensitive data exposed)
 */
export async function GET(request: NextRequest) {
  try {
    const stats = getDomainStats();
    const currentDomain = getCurrentDomain(request);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        currentDomain,
        isPrimary: stats.isPrimary(currentDomain),
      },
    });
  } catch (error) {
    console.error('Error getting domain config:', error);
    return NextResponse.json(
      { error: 'Failed to get domain configuration' },
      { status: 500 }
    );
  }
}

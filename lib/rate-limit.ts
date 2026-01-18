import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory rate limiter
// Note: For production with multiple instances, consider Redis
const store: RateLimitStore = {};

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a client
 * Returns success: false if limit exceeded
 */
export function checkRateLimit(
  request: NextRequest,
  config?: Partial<RateLimitConfig>
): RateLimitResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const clientIp = getClientIp(request);
  const now = Date.now();

  // Get or create client record
  let record = store[clientIp];

  if (!record || now >= record.resetTime) {
    // Reset window
    record = {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    };
    store[clientIp] = record;

    return {
      success: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests - 1,
      resetTime: record.resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= finalConfig.maxRequests) {
    return {
      success: false,
      limit: finalConfig.maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;

  return {
    success: true,
    limit: finalConfig.maxRequests,
    remaining: finalConfig.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Middleware to handle rate limit responses
 * Adds rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

  return response;
}

/**
 * Create a rate limit error response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: `Rate limit exceeded. Max ${result.limit} requests per minute.`,
    },
    { status: 429 }
  );

  return addRateLimitHeaders(response, result);
}

/**
 * Cleanup old records periodically (called from cron or manual cleanup)
 */
export function cleanupOldRecords(): void {
  const now = Date.now();
  const twoHours = 2 * 60 * 60 * 1000;

  Object.keys(store).forEach((key) => {
    if (now - store[key].resetTime > twoHours) {
      delete store[key];
    }
  });
}

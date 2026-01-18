import { createClient } from "@/lib/supabase/server";
import { generateShortCode, isValidUrl, isValidCustomSlug, calculateExpiration } from "@/lib/urlShortener";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, addRateLimitHeaders, createRateLimitResponse } from "@/lib/rate-limit";
import { extractToken, hashToken } from "@/lib/token-utils";

/**
 * Simple Public API for creating shortened URLs
 * 
 * POST /api/v1/shorten
 * 
 * Request body:
 * {
 *   "url": "https://example.com/very/long/url",
 *   "slug": "optional-custom-slug",
 *   "permanent": true
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "shortUrl": "https://meetra.live/abc123",
 *   "code": "abc123",
 *   "originalUrl": "https://example.com/very/long/url",
 *   "permanent": true,
 *   "expiresAt": "2025-01-26T19:22:05.000Z"
 * }
 * 
 * Error Response (400, 409, 500):
 * {
 *   "success": false,
 *   "error": "Error message"
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = checkRateLimit(request, {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Get and validate token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Authorization header. Use: Authorization: Bearer uplink_xxx",
        },
        { status: 401 }
      );
    }

    const token = extractToken(authHeader);
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Authorization header format. Use: Authorization: Bearer uplink_xxx",
        },
        { status: 401 }
      );
    }

    // Verify token in database
    const supabase = await createClient();
    const tokenHash = hashToken(token);

    const { data: tokenRecord, error: tokenError } = await supabase
      .from("api_tokens")
      .select("id, user_id, is_active, expires_at")
      .eq("token_hash", tokenHash)
      .single();

    if (tokenError || !tokenRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid API token",
        },
        { status: 401 }
      );
    }

    // Check if token is active
    if (!tokenRecord.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "API token is disabled",
        },
        { status: 401 }
      );
    }

    // Check if token has expired
    if (tokenRecord.expires_at) {
      const expiresAt = new Date(tokenRecord.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          {
            success: false,
            error: "API token has expired",
          },
          { status: 401 }
        );
      }
    }

    // Update last_used_at (async, don't wait)
    void supabase
      .from("api_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", tokenRecord.id);

    const body = await request.json();

    const { url, slug, permanent } = body;

    // Validate required field
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "URL is required. Use 'url' field in request body.",
        },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL format. Must start with http:// or https://",
        },
        { status: 400 }
      );
    }

    // Determine the short code
    let shortCode: string = "";
    if (slug) {
      // Validate custom slug
      if (!isValidCustomSlug(slug)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid slug. Use 2-50 alphanumeric characters, hyphens, or underscores.",
          },
          { status: 400 }
        );
      }

      // Check if custom slug already exists
      const { data: existing } = await supabase
        .from("short_urls")
        .select("id")
        .eq("short_code", slug)
        .single();

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "This slug is already taken. Try a different one.",
          },
          { status: 409 }
        );
      }

      shortCode = slug;
    } else {
      // Generate unique short code
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        const code = generateShortCode(8);
        const { data: existing } = await supabase
          .from("short_urls")
          .select("id")
          .eq("short_code", code)
          .single();

        if (!existing) {
          shortCode = code;
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to generate unique short code. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    // Calculate expiration
    const expiresAt = calculateExpiration(permanent === true);

    // Create short URL - now associated with authenticated user
    const { data, error } = await supabase
      .from("short_urls")
      .insert({
        user_id: tokenRecord.user_id,
        original_url: url,
        short_code: shortCode,
        custom_slug: slug || null,
        is_permanent: permanent === true,
        expires_at: expiresAt,
        click_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create short URL. Please try again.",
        },
        { status: 500 }
      );
    }

    // Get the current domain from request
    const host = request.headers.get("host") || "meetra.live";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const shortUrl = `${protocol}://${host}/${shortCode}`;

    const response = NextResponse.json(
      {
        success: true,
        shortUrl,
        code: shortCode,
        originalUrl: url,
        permanent: permanent === true,
        expiresAt: expiresAt,
      },
      { status: 201 }
    );

    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Uplink Simple API v1",
      endpoint: "POST /api/v1/shorten",
      description: "Create shortened URLs without authentication",
      example: {
        request: {
          method: "POST",
          url: "/api/v1/shorten",
          body: {
            url: "https://example.com/very/long/url",
            slug: "optional-custom-slug",
            permanent: true,
          },
        },
        response: {
          success: true,
          shortUrl: "https://meetra.live/abc123",
          code: "abc123",
          originalUrl: "https://example.com/very/long/url",
          permanent: true,
          expiresAt: "2025-01-26T19:22:05.000Z",
        },
      },
    },
    { status: 200 }
  );
}

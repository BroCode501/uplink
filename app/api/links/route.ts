import { createClient } from "@/lib/supabase/server";
import { generateShortCode, isValidUrl, isValidCustomSlug, calculateExpiration } from "@/lib/urlShortener";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { originalUrl, customSlug, isPermanent } = body;

    // Validate input
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Determine the short code
    let shortCode: string = "";
    if (customSlug) {
      if (!isValidCustomSlug(customSlug)) {
        return NextResponse.json(
          { error: "Invalid custom slug. Use 2-50 alphanumeric characters, hyphens, or underscores." },
          { status: 400 }
        );
      }

      // Check if custom slug already exists
      const { data: existing } = await supabase
        .from("short_urls")
        .select("id")
        .eq("short_code", customSlug)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "This custom slug is already taken" },
          { status: 400 }
        );
      }

      shortCode = customSlug;
    } else {
      // Generate unique short code
      let isUnique = false;
      while (!isUnique) {
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
      }
    }

    // Calculate expiration
    const expiresAt = calculateExpiration(isPermanent);

    // Create short URL
    const { data, error } = await supabase
      .from("short_urls")
      .insert({
        user_id: user.id,
        original_url: originalUrl,
        short_code: shortCode,
        custom_slug: customSlug || null,
        is_permanent: isPermanent || false,
        expires_at: expiresAt,
        click_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create short URL" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's short URLs
    const { data, error } = await supabase
      .from("short_urls")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch links" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

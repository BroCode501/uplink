import { createClient } from "@/lib/supabase/server";
import { generateToken, hashToken } from "@/lib/token-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/tokens - List all API tokens for the current user
 * POST /api/tokens - Create a new API token
 * DELETE /api/tokens/:id - Delete an API token
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all tokens for this user (don't return the hashes)
    const { data: tokens, error } = await supabase
      .from("api_tokens")
      .select("id, name, description, created_at, last_used_at, expires_at, is_active")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch tokens" },
        { status: 500 }
      );
    }

    return NextResponse.json(tokens);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, expiresIn } = body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Token name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Token name must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: "Token description must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Generate token and hash
    const token = generateToken();
    const tokenHash = hashToken(token);

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresIn) {
      const validPeriods: { [key: string]: number } = {
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
        "1y": 365 * 24 * 60 * 60 * 1000,
      };

      if (!validPeriods[expiresIn]) {
        return NextResponse.json(
          { error: "Invalid expiresIn. Valid options: 7d, 30d, 90d, 1y" },
          { status: 400 }
        );
      }

      expiresAt = new Date(Date.now() + validPeriods[expiresIn]).toISOString();
    }

    // Store token in database
    const { data: newToken, error } = await supabase
      .from("api_tokens")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        name: name.trim(),
        description: description?.trim() || null,
        expires_at: expiresAt,
      })
      .select("id, name, description, created_at, expires_at, is_active")
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create token" },
        { status: 500 }
      );
    }

    // Return token only once (user must save it)
    return NextResponse.json(
      {
        token, // Plain token - show only once
        ...newToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

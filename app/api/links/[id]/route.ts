import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify ownership
    const { data: link } = await supabase
      .from("short_urls")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!link || link.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete associated clicks first
    await supabase
      .from("url_clicks")
      .delete()
      .eq("short_url_id", id);

    // Delete the short URL
    const { error } = await supabase
      .from("short_urls")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete link" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get link with clicks
    const { data: link } = await supabase
      .from("short_urls")
      .select("*")
      .eq("id", id)
      .single();

    if (!link || link.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get recent clicks
    const { data: clicks } = await supabase
      .from("url_clicks")
      .select("*")
      .eq("short_url_id", id)
      .order("clicked_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      ...link,
      recentClicks: clicks,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

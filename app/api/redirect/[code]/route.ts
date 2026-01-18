import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();
    const shortCode = code;

    // Find the short URL
    const { data: link, error } = await supabase
      .from("short_urls")
      .select("*")
      .eq("short_code", shortCode)
      .single();

    if (error || !link) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Check if link is expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Short URL has expired" },
        { status: 410 }
      );
    }

    // Record the click
    const referrer = request.headers.get("referer");
    const userAgent = request.headers.get("user-agent");

    await supabase.from("url_clicks").insert({
      short_url_id: link.id,
      referrer: referrer,
      user_agent: userAgent,
    });

    // Increment click count
    await supabase
      .from("short_urls")
      .update({
        click_count: link.click_count + 1,
      })
      .eq("id", link.id);

    // Return redirect response
    return NextResponse.redirect(link.original_url, { status: 301 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/tokens/:id - Delete an API token
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tokenId = id;

    // Verify the token belongs to the current user
    const { data: token, error: fetchError } = await supabase
      .from("api_tokens")
      .select("id, user_id")
      .eq("id", tokenId)
      .single();

    if (fetchError || !token) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }

    if (token.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this token" },
        { status: 403 }
      );
    }

    // Delete the token
    const { error: deleteError } = await supabase
      .from("api_tokens")
      .delete()
      .eq("id", tokenId);

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete token" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Token deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

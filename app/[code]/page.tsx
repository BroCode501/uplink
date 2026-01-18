import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Link Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The short URL you're looking for doesn't exist or has expired.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  // Check if link is expired
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Link Expired</h1>
          <p className="text-muted-foreground mb-6">
            This short URL has expired and is no longer available.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  // Record the click
  const referrer = null; // Can't get headers in Server Component easily
  const userAgent = null;

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

  // Redirect to original URL
  redirect(link.original_url);
}

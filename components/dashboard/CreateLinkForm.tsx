"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export default function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [shortUrlBase, setShortUrlBase] = useState("");

  // Auto-detect domain on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShortUrlBase(window.location.origin);
    }
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl,
          customSlug: customSlug || null,
          isPermanent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create link");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCreatedLink(data);
      setOriginalUrl("");
      setCustomSlug("");
      setIsPermanent(false);
      toast.success("Link created successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const shortUrl = createdLink
    ? `${shortUrlBase}/${createdLink.short_code}`
    : "";

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (createdLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link Created!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original URL</label>
            <p className="text-sm text-muted-foreground break-all">
              {createdLink.original_url}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short URL</label>
            <div className="flex gap-2">
              <Input
                value={shortUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={createdLink.is_permanent ? "default" : "secondary"}>
              {createdLink.is_permanent ? "Permanent" : "Temporary (30 days)"}
            </Badge>
          </div>

           <Button
             onClick={() => setCreatedLink(null)}
             className="w-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
           >
             Create Another
           </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
        <CardDescription>Enter a long URL to shorten it</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateLink} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Long URL
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Custom Slug (Optional)
            </label>
            <Input
              id="slug"
              type="text"
              placeholder="my-link (2-50 characters)"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for auto-generated code
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="permanent"
              type="checkbox"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
              disabled={loading}
              className="rounded"
            />
            <label htmlFor="permanent" className="text-sm font-medium cursor-pointer">
              Make permanent (no expiration)
            </label>
          </div>

           <Button type="submit" disabled={loading} className="w-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">
             {loading ? "Creating..." : "Create Short Link"}
           </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Copy, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AnalyticsData {
  id: string;
  original_url: string;
  short_code: string;
  is_permanent: boolean;
  click_count: number;
  created_at: string;
  recentClicks: Array<{
    id: string;
    clicked_at: string;
    referrer: string | null;
    user_agent: string | null;
  }>;
}

export default function LinkAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/links/${params.id}`);
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        } else if (response.status === 404) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnalytics();
    }
  }, [params.id, router]);

  const shortUrl = data
    ? `${process.env.NEXT_PUBLIC_SHORT_URL_BASE || "https://uplink.neopanda.tech"}/${data.short_code}`
    : "";

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground">Link not found</p>
      </div>
    );
  }

  const createdDate = new Date(data.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Link Analytics</h1>
          <p className="text-muted-foreground">
            Track performance and clicks for your shortened URL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Short URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Link</p>
                <div className="flex gap-2 items-center">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1 truncate">
                    {shortUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Original URL</p>
                <p className="text-sm break-all text-primary hover:underline">
                  {data.original_url}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
                <p className="text-3xl font-bold flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  {data.click_count}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium">{createdDate}</p>
              </div>
              <div>
                <Badge variant={data.is_permanent ? "default" : "secondary"}>
                  {data.is_permanent ? "Permanent" : "Temporary (30-day)"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {data.recentClicks && data.recentClicks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Clicks</CardTitle>
              <CardDescription>
                Last 50 clicks on your shortened URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentClicks.map((click) => (
                      <TableRow key={click.id}>
                        <TableCell className="text-sm">
                          {new Date(click.clicked_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {click.referrer || "Direct"}
                        </TableCell>
                        <TableCell className="text-sm max-w-sm truncate text-muted-foreground">
                          {click.user_agent ? click.user_agent.substring(0, 50) : "Unknown"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {(!data.recentClicks || data.recentClicks.length === 0) && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                No clicks yet. Share your link to start tracking!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

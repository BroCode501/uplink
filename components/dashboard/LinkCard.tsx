"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, Eye, Check, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import QRCodeModal from "./QRCodeModal";

interface LinkCardProps {
  id: string;
  original_url: string;
  short_code: string;
  is_permanent: boolean;
  click_count: number;
  created_at: string;
  onDelete: () => void;
}

export default function LinkCard({
  id,
  original_url,
  short_code,
  is_permanent,
  click_count,
  created_at,
  onDelete,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shortUrlBase, setShortUrlBase] = useState("");

  // Auto-detect domain on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShortUrlBase(window.location.origin);
    }
  }, []);

  const shortUrl = shortUrlBase ? `${shortUrlBase}/${short_code}` : `https://uplink.neopanda.tech/${short_code}`;

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete link");
        setDeleting(false);
        return;
      }

      toast.success("Link deleted successfully!");
      onDelete();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete link");
      setDeleting(false);
    }
  };

  const createdDate = new Date(created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

   return (
     <>
      <Card className="border-l-4 border-l-amber-700 dark:border-l-amber-400">
       <CardContent className="pt-6">
         <div className="space-y-4">
           <div className="space-y-1">
             <div className="flex items-start justify-between gap-2">
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline cursor-pointer truncate">
                   {shortUrl}
                 </p>
                 <p className="text-xs text-muted-foreground truncate">
                   {original_url}
                 </p>
               </div>
             </div>
           </div>

           <div className="flex items-center justify-between flex-wrap gap-2">
             <div className="flex items-center gap-2">
               <Badge variant="outline">
                 <Eye className="w-3 h-3 mr-1" />
                 {click_count} clicks
               </Badge>
               <Badge variant={is_permanent ? "default" : "secondary"}>
                 {is_permanent ? "Permanent" : "30-day"}
               </Badge>
               <span className="text-xs text-muted-foreground">{createdDate}</span>
             </div>

              <div className="flex gap-2">
                <Link href={`/links/${id}`}>
                  <Button size="sm" variant="outline" className="hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-700 dark:hover:border-amber-400">
                    Analytics
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQrModalOpen(true)}
                  className="hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-700 dark:hover:border-amber-400"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyToClipboard}
                  className="hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-700 dark:hover:border-amber-400"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <QRCodeModal
        shortUrl={shortUrl}
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
      />
    </>
    );
}

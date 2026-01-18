"use client";

import { useEffect, useState } from "react";
import LinkCard from "./LinkCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Link {
  id: string;
  original_url: string;
  short_code: string;
  is_permanent: boolean;
  click_count: number;
  created_at: string;
}

interface LinkListProps {
  refreshTrigger: number;
}

export default function LinkList({ refreshTrigger }: LinkListProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/links");
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground">
            No links yet. Create your first short link!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          {...link}
          onDelete={fetchLinks}
        />
      ))}
    </div>
  );
}

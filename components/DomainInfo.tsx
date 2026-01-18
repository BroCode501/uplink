"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

interface DomainConfig {
  totalDomains: number;
  domains: string[];
  currentDomain: string | null;
  isPrimary: boolean;
}

/**
 * Component to display current domain information
 * Shows which domain the user is currently accessing from
 */
export default function DomainInfo() {
  const [config, setConfig] = useState<DomainConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomainConfig = async () => {
      try {
        const response = await fetch("/api/config/domains");
        if (response.ok) {
          const json = await response.json();
          setConfig(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch domain config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainConfig();
  }, []);

  if (loading || !config) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-amber-700 dark:border-l-amber-400">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          Instance Domains
        </CardTitle>
        <CardDescription>
          You're accessing from: <span className="font-semibold">{config.currentDomain}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Configured Domains ({config.totalDomains})</p>
            <div className="flex flex-wrap gap-2">
              {config.domains.map((domain) => (
                <Badge
                  key={domain}
                  variant={config.currentDomain === domain ? "default" : "outline"}
                  className={
                    config.currentDomain === domain
                      ? "bg-amber-700 dark:bg-amber-600"
                      : ""
                  }
                >
                  {domain}
                  {config.isPrimary && domain === config.domains[0] && " (Primary)"}
                  {domain === config.currentDomain && " (Current)"}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Short links work seamlessly across all configured domains. Links created on any domain
            are accessible from all domains.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

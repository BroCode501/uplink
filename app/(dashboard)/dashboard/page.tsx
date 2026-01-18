"use client";

import { useState } from "react";
import CreateLinkForm from "@/components/dashboard/CreateLinkForm";
import LinkList from "@/components/dashboard/LinkList";
import { TokenManagement } from "@/components/dashboard/TokenManagement";
import DomainInfo from "@/components/DomainInfo";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"links" | "tokens">("links");

  const handleLinkCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your links and API tokens
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <Button
            variant={activeTab === "links" ? "default" : "ghost"}
            className={`rounded-none border-b-2 px-4 py-2 ${
              activeTab === "links"
                ? "border-amber-700 dark:border-amber-400 bg-transparent"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("links")}
          >
            Your Links
          </Button>
          <Button
            variant={activeTab === "tokens" ? "default" : "ghost"}
            className={`rounded-none border-b-2 px-4 py-2 ${
              activeTab === "tokens"
                ? "border-amber-700 dark:border-amber-400 bg-transparent"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("tokens")}
          >
            API Tokens
          </Button>
        </div>

        {/* Links Tab */}
        {activeTab === "links" && (
          <div>
            {/* Domain Info - Shows current domain and all configured domains */}
            <div className="mb-6">
              <DomainInfo />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CreateLinkForm onSuccess={handleLinkCreated} />
              </div>
              <div className="lg:col-span-2">
                <LinkList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </div>
        )}

        {/* Tokens Tab */}
        {activeTab === "tokens" && (
          <div>
            <TokenManagement />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import CreateLinkForm from "@/components/dashboard/CreateLinkForm";
import LinkList from "@/components/dashboard/LinkList";
import DomainInfo from "@/components/DomainInfo";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Links</h1>
          <p className="text-muted-foreground">
            Create and manage your shortened URLs
          </p>
        </div>

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
    </div>
  );
}

"use client";

import { ActivityLog } from "@/components/admin/ActivityLog";
import { HealthPanel } from "@/components/admin/HealthPanel";

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <HealthPanel />
      <ActivityLog />
    </div>
  );
}

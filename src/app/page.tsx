"use client";

import { HeroSection } from "@/components/admin/HeroSection";
import BentoDashboard from "@/components/ui/bento-dashboard";

export default function DashboardPage() {
  return (
    <div className="-mx-4 -mt-6 sm:-mx-6">
      <HeroSection>
        <BentoDashboard />
      </HeroSection>
    </div>
  );
}

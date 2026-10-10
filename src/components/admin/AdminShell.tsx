"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/lib/store";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const copy: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Executive analytics",
    subtitle: "Review volume, pass rate, and violation mix across the firm",
  },
  "/users": {
    title: "Users & RBAC",
    subtitle: "Search, paginate, and assign granular module permissions",
  },
  "/rules": {
    title: "Compliance policy manager",
    subtitle: "Activate SEC/FINRA rules, edit severity, and add custom policies",
  },
  "/health": {
    title: "System health & activity",
    subtitle: "Latency, error rates, and a filterable live audit stream",
  },
  "/flags": {
    title: "Feature flags",
    subtitle: "Toggle platform capabilities without a code deployment",
  },
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { toasts } = useAdmin();
  const meta = copy[pathname] ?? copy["/"];

  return (
    <div className="admin-theme flex min-h-screen bg-background text-foreground">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[17rem]">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenu={() => setOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

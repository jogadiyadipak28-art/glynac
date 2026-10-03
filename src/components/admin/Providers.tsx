"use client";

import { AdminProvider } from "@/lib/store";
import { AdminShell } from "@/components/admin/AdminShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

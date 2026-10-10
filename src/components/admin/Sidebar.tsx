"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Flag,
  LayoutDashboard,
  ScrollText,
  Shield,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Analytics", icon: LayoutDashboard },
  { href: "/users", label: "Users & RBAC", icon: Users },
  { href: "/rules", label: "Policy Manager", icon: ScrollText },
  { href: "/health", label: "Health & Logs", icon: Activity },
  { href: "/flags", label: "Feature Flags", icon: Flag },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-text transition-transform duration-300",
          "lg:inset-y-4 lg:left-4 lg:h-[calc(100vh-2rem)] lg:rounded-2xl lg:border lg:shadow-2xl overflow-hidden",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-4 flex items-center justify-between border-b border-border bg-sidebar px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-slate-950 shadow-lg shadow-fuchsia-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground leading-none">
                Glynac
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[.18em] text-muted">
                Admin Control
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg border border-border bg-card p-1 text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 stroke-[3px]" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  active
                    ? "border-fuchsia-300/20 bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/10 text-slate-900 dark:text-white shadow-lg shadow-fuchsia-950/20"
                    : "border-transparent text-sidebar-text hover:border-border hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "" : "stroke-[2.5px]")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-xl border border-cyan-200/20 bg-gradient-to-br from-indigo-400/10 to-fuchsia-400/10 p-4 text-sidebar-text">
          <p className="mb-2 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-100">Task 3 · FE-3</p>
          <p className="text-xs leading-relaxed">
            Mock enterprise admin for wealth compliance. No live production databases.
          </p>
        </div>
      </aside>
    </>
  );
}

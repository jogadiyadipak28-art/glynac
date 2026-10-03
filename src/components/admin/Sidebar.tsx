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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-sidebar text-sidebar-text transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                Glynac
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Admin Control
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-400 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-200">Task 3 · FE-3</p>
          <p className="mt-1 leading-5">
            Mock enterprise admin for wealth compliance. No live production
            databases.
          </p>
        </div>
      </aside>
    </>
  );
}

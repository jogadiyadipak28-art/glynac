"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/store";
import type { ActivityLevel } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";

const modules = ["All", "RBAC", "Rules", "Flags", "Health", "VDR", "Chat", "Admin"];

export function ActivityLog() {
  const { activity, liveLogs, setLiveLogs } = useAdmin();
  const [module, setModule] = useState("All");
  const [level, setLevel] = useState<ActivityLevel | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return activity.filter((event) => {
      const matchesModule = module === "All" || event.module === module;
      const matchesLevel = level === "all" || event.severity === level;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        event.action.toLowerCase().includes(q) ||
        event.user.toLowerCase().includes(q);
      return matchesModule && matchesLevel && matchesQuery;
    });
  }, [activity, level, module, query]);

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Audit stream</h2>
          {liveLogs ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-300">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          ) : (
            <span className="text-xs text-muted">Paused</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter actions…"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          />
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          >
            {modules.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as ActivityLevel | "all")}
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
          >
            <option value="all">All levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <button
            type="button"
            onClick={() => setLiveLogs(!liveLogs)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            {liveLogs ? "Pause stream" : "Resume stream"}
          </button>
        </div>
      </div>
      <ol className="max-h-[28rem] overflow-y-auto">
        {rows.length === 0 ? (
          <li className="p-8 text-center text-sm text-muted">
            No audit events match these filters.
          </li>
        ) : (
          rows.map((event) => (
            <li
              key={event.id}
              className="flex gap-3 border-t border-border px-4 py-3 text-sm"
            >
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  event.severity === "info" && "bg-teal-500",
                  event.severity === "warning" && "bg-amber-500",
                  event.severity === "critical" && "bg-rose-500"
                )}
              />
              <div className="min-w-0 flex-1">
                <p>{event.action}</p>
                <p className="text-xs text-muted">
                  {event.user} · {event.module} · {formatRelative(event.timestamp)}
                </p>
              </div>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

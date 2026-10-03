"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/store";
import { useGlobalSearch } from "@/lib/globalSearch";
import { cn } from "@/lib/utils";

export function FeatureFlags() {
  const { flags, toggleFlag } = useAdmin();
  const [query, setQuery] = useState("");
  useGlobalSearch(setQuery);
  const filteredFlags = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return flags.filter((flag) =>
      !needle || [flag.name, flag.key, flag.description].some((value) => value.toLowerCase().includes(needle))
    );
  }, [flags, query]);
  const enabled = flags.filter((flag) => flag.enabled).length;

  return (
    <section className="space-y-4">
      <div className="panel flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium">Runtime configuration</p>
          <p className="text-xs text-muted">
            Changes apply immediately in this workspace (local state).
          </p>
        </div>
        <p className="text-sm">
          <span className="font-semibold text-accent">{enabled}</span> / {flags.length}{" "}
          active
        </p>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter feature flags"
        aria-label="Filter feature flags"
        className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none ring-accent/30 focus:ring-2 sm:w-80"
      />
      <div className="grid gap-3">
        {filteredFlags.map((flag) => (
          <article key={flag.id} className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{flag.name}</h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted">
                  {flag.environment}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    flag.enabled
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                  )}
                >
                  {flag.enabled ? "Active" : "Off"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{flag.description}</p>
              <p className="mt-1 font-mono text-[11px] text-muted">{flag.key}</p>
            </div>
            <button
              type="button"
              className="toggle shrink-0"
              data-on={flag.enabled}
              onClick={() => toggleFlag(flag.id)}
              aria-pressed={flag.enabled}
              aria-label={`Toggle ${flag.name}`}
            >
              <span className="toggle-knob" />
            </button>
          </article>
        ))}
        {filteredFlags.length === 0 ? (
          <p className="panel p-8 text-center text-sm text-muted">No feature flags match that search.</p>
        ) : null}
      </div>
    </section>
  );
}

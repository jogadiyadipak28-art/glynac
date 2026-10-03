"use client";

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  suffix,
  delta,
  icon: Icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: LucideIcon;
}) {
  const up = delta >= 0;
  return (
    <article className="panel p-4 transition duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <span className="rounded-lg bg-accent-soft p-2 text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {suffix === "%" ? value.toFixed(1) : formatNumber(value)}
        {suffix ? <span className="text-base text-muted">{suffix}</span> : null}
      </p>
      <p
        className={cn(
          "mt-2 inline-flex items-center gap-1 text-xs font-medium",
          up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        )}
      >
        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        {up ? "+" : ""}
        {delta}
        {suffix === "%" || suffix === "m" ? suffix : "%"} vs prior period
      </p>
    </article>
  );
}

"use client";

import { Clock3, FileSearch, Percent, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { ReviewTrendChart, ViolationBarChart } from "@/components/admin/Charts";
import { metrics, trends, violationDistribution } from "@/lib/mockAnalytics";
import type { ChartRange } from "@/lib/types";

const ranges: { id: ChartRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

export default function DashboardPage() {
  const [range, setRange] = useState<ChartRange>("12m");
  const data = useMemo(() => trends[range], [range]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Documents reviewed"
          value={metrics.documentsReviewed}
          delta={metrics.documentsDelta}
          icon={FileSearch}
        />
        <MetricCard
          label="Violations flagged"
          value={metrics.violationsFlagged}
          delta={metrics.violationsDelta}
          icon={ShieldAlert}
        />
        <MetricCard
          label="Pass rate"
          value={metrics.passRate}
          suffix="%"
          delta={metrics.passRateDelta}
          icon={Percent}
        />
        <MetricCard
          label="Avg review time"
          value={metrics.avgReviewMinutes}
          suffix="m"
          delta={metrics.avgReviewDelta}
          icon={Clock3}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Filter charts by period. Reviews (teal) vs violations (rose).
        </p>
        <div className="flex rounded-xl border border-border bg-card p-1">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                range === item.id
                  ? "bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <section className="panel p-4 xl:col-span-3">
          <h2 className="mb-2 font-semibold">Review trends</h2>
          <ReviewTrendChart data={data} />
        </section>
        <section className="panel p-4 xl:col-span-2">
          <h2 className="mb-2 font-semibold">Violation distribution</h2>
          <ViolationBarChart data={violationDistribution} />
        </section>
      </div>
    </div>
  );
}

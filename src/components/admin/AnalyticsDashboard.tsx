"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { metrics, trends, violationDistribution } from "@/lib/mockAnalytics";
import type { ChartRange } from "@/lib/types";
import { cn } from "@/lib/utils";

const ranges: { id: ChartRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

function MetricCard({ label, value, delta, suffix = "" }: { label: string, value: number, delta: number, suffix?: string }) {
  const isPositive = delta > 0;
  return (
    <div className="panel p-5 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
      <span className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">{label}</span>
      <div className="flex items-end justify-between mt-auto">
        <span className="text-3xl font-bold text-foreground">
          {value.toLocaleString()}{suffix}
        </span>
        <div className={cn(
          "px-2 py-1 rounded-md text-xs font-bold",
          isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
        )}>
          {isPositive ? "+" : ""}{delta}%
        </div>
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState<ChartRange>("12m");
  const data = useMemo(() => trends[range], [range]);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Platform Analytics</h2>
          <p className="text-sm font-medium text-muted mt-1">Review activity and compliance trends</p>
        </div>
        
        <div className="flex rounded-lg border border-border bg-card p-1">
          {ranges.map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={cn(
                "px-4 py-1.5 text-sm font-semibold transition-colors duration-200 rounded-md",
                range === item.id 
                  ? "bg-accent text-white shadow-md" 
                  : "text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Documents Reviewed"
          value={metrics.documentsReviewed}
          delta={metrics.documentsDelta}
        />
        <MetricCard
          label="Violations Flagged"
          value={metrics.violationsFlagged}
          delta={metrics.violationsDelta}
        />
        <MetricCard
          label="Pass Rate"
          value={metrics.passRate}
          suffix="%"
          delta={metrics.passRateDelta}
        />
        <MetricCard
          label="Avg Review Time"
          value={metrics.avgReviewMinutes}
          suffix="m"
          delta={metrics.avgReviewDelta}
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <div className="panel p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Review Volume Trends</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => String(v)} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                  labelStyle={{ color: 'var(--muted)', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="reviews" name="Reviews" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorReviews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Bar Chart */}
        <div className="panel p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Top Rule Violations</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationDistribution.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="rule" type="category" stroke="var(--foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'var(--border)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="count" name="Violations" fill="var(--accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

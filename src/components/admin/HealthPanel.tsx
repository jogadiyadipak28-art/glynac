"use client";

import { useAdmin } from "@/lib/store";
import type { HealthStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

function statusLabel(status: HealthStatus) {
  return status === "operational"
    ? "Operational"
    : status === "degraded"
      ? "Degraded"
      : "Down";
}

export function HealthPanel() {
  const { health } = useAdmin();
  const down = health.filter((s) => s.status === "down").length;
  const degraded = health.filter((s) => s.status === "degraded").length;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Services</p>
          <p className="mt-1 text-2xl font-semibold">{health.length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Degraded</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-300">
            {degraded}
          </p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Incidents</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600 dark:text-rose-300">
            {down}
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {health.map((service) => (
          <article key={service.id} className="panel p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-xs text-muted">Uptime {service.uptime}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  service.status === "operational" &&
                    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  service.status === "degraded" &&
                    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  service.status === "down" &&
                    "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    service.status === "operational" && "live-dot bg-emerald-500",
                    service.status === "degraded" && "live-dot bg-amber-500",
                    service.status === "down" && "bg-rose-500"
                  )}
                />
                {statusLabel(service.status)}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">API latency</dt>
                <dd className="font-mono text-lg">{service.latencyMs}ms</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Error rate</dt>
                <dd className="font-mono text-lg">{service.errorRate}%</dd>
              </div>
            </dl>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  service.status === "operational" && "bg-teal-500",
                  service.status === "degraded" && "bg-amber-500",
                  service.status === "down" && "bg-rose-500"
                )}
                style={{
                  width: `${Math.min(100, service.status === "down" ? 8 : 100 - service.errorRate * 8)}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import type { HealthService } from "./types";

export const mockHealth: HealthService[] = [
  {
    id: "h-api",
    name: "Review API",
    status: "operational",
    latencyMs: 142,
    errorRate: 0.21,
    uptime: "99.98%",
  },
  {
    id: "h-db",
    name: "Primary Database",
    status: "operational",
    latencyMs: 18,
    errorRate: 0.02,
    uptime: "99.99%",
  },
  {
    id: "h-search",
    name: "Search Indexer",
    status: "degraded",
    latencyMs: 410,
    errorRate: 1.64,
    uptime: "99.41%",
  },
  {
    id: "h-ai",
    name: "AI Assistant Gateway",
    status: "operational",
    latencyMs: 268,
    errorRate: 0.44,
    uptime: "99.92%",
  },
  {
    id: "h-archive",
    name: "Immutable Archive",
    status: "operational",
    latencyMs: 88,
    errorRate: 0.05,
    uptime: "100%",
  },
  {
    id: "h-notify",
    name: "Alert Dispatcher",
    status: "down",
    latencyMs: 0,
    errorRate: 12.4,
    uptime: "97.10%",
  },
];

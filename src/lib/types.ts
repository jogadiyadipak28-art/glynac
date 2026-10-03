export type UserStatus = "Active" | "Pending" | "Suspended";
export type Role = "Admin" | "Compliance Officer" | "Advisor" | "Auditor";
export type ModuleKey = "vdr" | "chat" | "admin" | "tree";
export type Permission = "Read" | "Write" | "Approve" | "Admin";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type ChartRange = "7d" | "30d" | "90d" | "12m";
export type HealthStatus = "operational" | "degraded" | "down";
export type ActivityLevel = "info" | "warning" | "critical";

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "vdr", label: "Virtual Data Room" },
  { key: "chat", label: "Compliance Chat" },
  { key: "admin", label: "Admin Panel" },
  { key: "tree", label: "Tree Editor" },
];

export const PERMISSIONS: Permission[] = ["Read", "Write", "Approve", "Admin"];
export const ROLES: Role[] = [
  "Admin",
  "Compliance Officer",
  "Advisor",
  "Auditor",
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
  department: string;
  avatarInitials: string;
  permissions: Record<ModuleKey, Permission[]>;
}

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: Severity;
  active: boolean;
  lastUpdated: string;
  owner: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: "Production" | "Staging" | "All";
}

export interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  severity: ActivityLevel;
}

export interface HealthService {
  id: string;
  name: string;
  status: HealthStatus;
  latencyMs: number;
  errorRate: number;
  uptime: string;
}

export interface TrendPoint {
  label: string;
  reviews: number;
  violations: number;
  avgMinutes: number;
}

export interface ViolationSlice {
  rule: string;
  count: number;
}

export interface Metrics {
  documentsReviewed: number;
  violationsFlagged: number;
  passRate: number;
  avgReviewMinutes: number;
  documentsDelta: number;
  violationsDelta: number;
  passRateDelta: number;
  avgReviewDelta: number;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { liveActivityPool, mockActivity } from "./mockActivity";
import { mockFlags } from "./mockFlags";
import { mockHealth } from "./mockHealth";
import { mockRules } from "./mockRules";
import { mockUsers } from "./mockUsers";
import type {
  ActivityEvent,
  ActivityLevel,
  ComplianceRule,
  FeatureFlag,
  HealthService,
  Permission,
  Role,
  Severity,
  User,
} from "./types";

interface Toast {
  id: string;
  message: string;
}

interface AdminState {
  users: User[];
  rules: ComplianceRule[];
  flags: FeatureFlag[];
  activity: ActivityEvent[];
  health: HealthService[];
  liveLogs: boolean;
  toasts: Toast[];
  updateUser: (
    id: string,
    patch: Partial<Pick<User, "role" | "status" | "permissions">>
  ) => void;
  toggleRule: (id: string) => void;
  updateRuleSeverity: (id: string, severity: Severity) => void;
  addRule: (rule: Omit<ComplianceRule, "id" | "lastUpdated">) => void;
  toggleFlag: (id: string) => void;
  setLiveLogs: (value: boolean) => void;
  pushToast: (message: string) => void;
}

const AdminContext = createContext<AdminState | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [rules, setRules] = useState<ComplianceRule[]>(mockRules);
  const [flags, setFlags] = useState<FeatureFlag[]>(mockFlags);
  const [activity, setActivity] = useState<ActivityEvent[]>(mockActivity);
  const [health, setHealth] = useState<HealthService[]>(mockHealth);
  const [liveLogs, setLiveLogs] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string) => {
    const id = uid("t");
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const log = useCallback(
    (event: Omit<ActivityEvent, "id" | "timestamp">) => {
      setActivity((prev) => [
        {
          ...event,
          id: uid("a"),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const updateUser = useCallback(
    (
      id: string,
      patch: Partial<Pick<User, "role" | "status" | "permissions">>
    ) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...patch } : user))
      );
      const target = users.find((u) => u.id === id);
      log({
        user: "You",
        action: `Updated ${target?.name ?? "user"} role/permissions`,
        module: "RBAC",
        severity: "info",
      });
      pushToast("User permissions saved");
    },
    [log, pushToast, users]
  );

  const toggleRule = useCallback(
    (id: string) => {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === id
            ? {
                ...rule,
                active: !rule.active,
                lastUpdated: new Date().toISOString().slice(0, 10),
              }
            : rule
        )
      );
      const rule = rules.find((r) => r.id === id);
      log({
        user: "You",
        action: `Toggled ${rule?.code ?? "rule"} to ${rule?.active ? "inactive" : "active"}`,
        module: "Rules",
        severity: "warning",
      });
    },
    [log, rules]
  );

  const updateRuleSeverity = useCallback(
    (id: string, severity: Severity) => {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === id
            ? {
                ...rule,
                severity,
                lastUpdated: new Date().toISOString().slice(0, 10),
              }
            : rule
        )
      );
      pushToast("Rule severity updated");
    },
    [pushToast]
  );

  const addRule = useCallback(
    (input: Omit<ComplianceRule, "id" | "lastUpdated">) => {
      const next: ComplianceRule = {
        ...input,
        id: uid("r"),
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
      setRules((prev) => [next, ...prev]);
      log({
        user: "You",
        action: `Created custom rule ${next.code}`,
        module: "Rules",
        severity: "info",
      });
      pushToast(`${next.code} added to policy set`);
    },
    [log, pushToast]
  );

  const toggleFlag = useCallback(
    (id: string) => {
      setFlags((prev) =>
        prev.map((flag) =>
          flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
        )
      );
      const flag = flags.find((f) => f.id === id);
      const nextEnabled = !flag?.enabled;
      log({
        user: "You",
        action: `${nextEnabled ? "Enabled" : "Disabled"} ${flag?.name ?? "flag"}`,
        module: "Flags",
        severity: "info",
      });
      pushToast(
        `${flag?.name ?? "Flag"} is now ${nextEnabled ? "on" : "off"}`
      );
    },
    [flags, log, pushToast]
  );

  useEffect(() => {
    if (!liveLogs) return;
    const timer = window.setInterval(() => {
      const sample =
        liveActivityPool[Math.floor(Math.random() * liveActivityPool.length)];
      setActivity((prev) => [
        {
          ...sample,
          id: uid("live"),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [liveLogs]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHealth((prev) =>
        prev.map((service) => {
          if (service.status === "down") return service;
          const jitter = Math.round((Math.random() - 0.4) * 24);
          const latency = Math.max(8, service.latencyMs + jitter);
          const error = Math.max(
            0,
            Number((service.errorRate + (Math.random() - 0.5) * 0.08).toFixed(2))
          );
          let status = service.status;
          if (latency > 380 || error > 1.2) status = "degraded";
          else status = "operational";
          return { ...service, latencyMs: latency, errorRate: error, status };
        })
      );
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const value = useMemo(
    () => ({
      users,
      rules,
      flags,
      activity,
      health,
      liveLogs,
      toasts,
      updateUser,
      toggleRule,
      updateRuleSeverity,
      addRule,
      toggleFlag,
      setLiveLogs,
      pushToast,
    }),
    [
      users,
      rules,
      flags,
      activity,
      health,
      liveLogs,
      toasts,
      updateUser,
      toggleRule,
      updateRuleSeverity,
      addRule,
      toggleFlag,
      pushToast,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function defaultPermissionsForRole(
  role: Role
): User["permissions"] {
  if (role === "Admin") {
    return {
      vdr: ["Read", "Write", "Approve", "Admin"],
      chat: ["Read", "Write", "Approve", "Admin"],
      admin: ["Read", "Write", "Approve", "Admin"],
      tree: ["Read", "Write", "Approve", "Admin"],
    };
  }
  if (role === "Compliance Officer") {
    return {
      vdr: ["Read", "Write", "Approve"],
      chat: ["Read", "Write", "Approve"],
      admin: ["Read"],
      tree: ["Read", "Write"],
    };
  }
  if (role === "Auditor") {
    return {
      vdr: ["Read"],
      chat: ["Read"],
      admin: ["Read"],
      tree: ["Read"],
    };
  }
  return {
    vdr: ["Read", "Write"],
    chat: ["Read", "Write"],
    admin: ["Read"],
    tree: ["Read"],
  };
}

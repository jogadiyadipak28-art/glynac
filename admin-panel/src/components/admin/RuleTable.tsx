"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/store";
import { useGlobalSearch } from "@/lib/globalSearch";
import type { Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const severities: Severity[] = ["Low", "Medium", "High", "Critical"];

function severityClass(severity: Severity) {
  return {
    Low: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
    Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    High: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    Critical: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  }[severity];
}

export function RuleTable() {
  const { rules, toggleRule, updateRuleSeverity, addRule } = useAdmin();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  useGlobalSearch(setQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter(
      (rule) =>
        !q ||
        rule.code.toLowerCase().includes(q) ||
        rule.name.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q) ||
        rule.owner.toLowerCase().includes(q)
    );
  }, [query, rules]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    addRule({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || "Custom firm policy.",
      severity,
      active: true,
      owner: "You",
    });
    setCode("");
    setName("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by code, name, owner…"
          className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none ring-accent/30 focus:ring-2 sm:w-80"
        />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white dark:bg-teal-500 dark:text-slate-950"
        >
          {showForm ? "Close form" : "Add custom rule"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={submit} className="panel grid gap-3 p-4 sm:grid-cols-2">
          <label className="text-sm">
            Rule code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="CUST-18"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Annuity illustration review"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              required
            />
          </label>
          <label className="text-sm sm:col-span-2">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Severity
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            >
              {severities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
            >
              Save rule
            </button>
          </div>
        </form>
      ) : null}

      {filtered.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-muted">
          No policies match that search.
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rule) => (
                <tr key={rule.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-accent">{rule.code}</p>
                    <p className="font-medium">{rule.name}</p>
                    <p className="max-w-md text-xs text-muted">{rule.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={rule.severity}
                      onChange={(e) =>
                        updateRuleSeverity(rule.id, e.target.value as Severity)
                      }
                      className={cn(
                        "rounded-full border-0 px-2 py-1 text-xs font-medium",
                        severityClass(rule.severity)
                      )}
                    >
                      {severities.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="toggle"
                      data-on={rule.active}
                      onClick={() => toggleRule(rule.id)}
                      aria-pressed={rule.active}
                      aria-label={`Toggle ${rule.code}`}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </td>
                  <td className="px-4 py-3">{rule.owner}</td>
                  <td className="px-4 py-3 text-muted">{rule.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

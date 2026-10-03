"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/store";
import { useGlobalSearch } from "@/lib/globalSearch";
import type { User, UserStatus } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import { RoleEditorModal } from "./RoleEditorModal";

type SortKey = "name" | "role" | "status" | "lastActive";

const PAGE_SIZE = 5;

function StatusBadge({ status }: { status: UserStatus }) {
  const map = {
    Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    Suspended: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", map[status])}>
      {status}
    </span>
  );
}

export function UserTable() {
  const { users, updateUser } = useAdmin();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<User | null>(null);
  useGlobalSearch(setQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter(
      (user) =>
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [query, sortDir, sortKey, users]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Directory</h2>
          <p className="text-xs text-muted">{filtered.length} people across the firm</p>
        </div>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search name, email, role…"
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none ring-accent/30 focus:ring-2 sm:w-72"
        />
      </div>
      {rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted">
          No users match that filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase tracking-wide text-muted">
              <tr>
                {(["name", "role", "status", "lastActive"] as SortKey[]).map((key) => (
                  <th key={key} className="px-4 py-3">
                    <button type="button" onClick={() => toggleSort(key)} className="hover:text-foreground">
                      {key === "lastActive" ? "Last active" : key}
                      {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <tr key={user.id} className="border-t border-border transition hover:bg-accent-soft/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-xs font-semibold text-teal-800 dark:text-teal-200">
                        {user.avatarInitials}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatRelative(user.lastActive)}</td>
                  <td className="px-4 py-3">{user.department}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(user)}
                      className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium hover:border-accent"
                    >
                      Edit role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
        <p className="text-muted">
          Page {safePage + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-border p-1 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-border p-1 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {editing ? (
        <RoleEditorModal
          user={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateUser(editing.id, patch);
            setEditing(null);
          }}
        />
      ) : null}
    </section>
  );
}

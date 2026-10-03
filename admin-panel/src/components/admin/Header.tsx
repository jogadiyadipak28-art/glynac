"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { useAdmin } from "@/lib/store";
import { formatRelative } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

type SearchResult = { label: string; detail: string; href: string };

export function Header({
  title,
  subtitle,
  onMenu,
}: {
  title: string;
  subtitle: string;
  onMenu: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { users, rules, flags, activity } = useAdmin();
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!needle) return [];
    const matches: SearchResult[] = [
      ...users
        .filter((user) =>
          [user.name, user.email, user.role, user.department].some((value) =>
            value.toLowerCase().includes(needle)
          )
        )
        .map((user) => ({
          label: user.name,
          detail: `${user.role} · ${user.email}`,
          href: "/users",
        })),
      ...rules
        .filter((rule) =>
          [rule.code, rule.name, rule.description].some((value) =>
            value.toLowerCase().includes(needle)
          )
        )
        .map((rule) => ({
          label: rule.code,
          detail: rule.name,
          href: "/rules",
        })),
      ...flags
        .filter((flag) =>
          [flag.name, flag.key, flag.description].some((value) =>
            value.toLowerCase().includes(needle)
          )
        )
        .map((flag) => ({
          label: flag.name,
          detail: `Feature flag · ${flag.enabled ? "Active" : "Off"}`,
          href: "/flags",
        })),
    ];
    return matches.slice(0, 6);
  }, [flags, needle, rules, users]);

  const notifications = activity
    .filter((event) => event.severity === "warning" || event.severity === "critical")
    .slice(0, 5);
  const unreadCount = notifications.filter((event) => !readIds.includes(event.id)).length;

  function openResult(result: SearchResult) {
    const searchTerm = query.trim();
    setQuery("");
    if (pathname === result.href) {
      window.dispatchEvent(
        new CustomEvent("glynac-admin-search", { detail: searchTerm })
      );
    } else {
      window.sessionStorage.setItem("glynac-admin-search", searchTerm);
      router.push(result.href);
    }
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          <p className="hidden truncate text-xs text-muted sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
                if (event.key === "Enter" && results[0]) openResult(results[0]);
              }}
              placeholder="Search admin"
              aria-label="Search users, rules, and feature flags"
              aria-expanded={needle.length > 0}
              className="h-9 w-36 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none ring-accent/30 transition focus:ring-2 sm:w-48 lg:w-64"
            />
          </label>
          {needle ? (
            <div className="absolute right-0 top-11 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              {results.length ? (
                <ul aria-label="Search results">
                  {results.map((result, index) => (
                    <li key={`${result.href}-${result.label}-${index}`}>
                      <button
                        type="button"
                        onClick={() => openResult(result)}
                        className="w-full px-4 py-3 text-left transition hover:bg-accent-soft/50 focus:bg-accent-soft/50"
                      >
                        <span className="block truncate text-sm font-medium">{result.label}</span>
                        <span className="block truncate text-xs text-muted">{result.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-muted">No matching users, rules, or flags.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? (
            <section className="absolute right-0 top-11 z-40 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl" aria-label="Recent alerts">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold">Recent alerts</h2>
                  <p className="text-xs text-muted">Warnings and critical audit events</p>
                </div>
                <button
                  type="button"
                  disabled={unreadCount === 0}
                  onClick={() => setReadIds((ids) => [...new Set([...ids, ...notifications.map((event) => event.id)])])}
                  className="text-xs font-medium text-accent disabled:opacity-40"
                >
                  Mark read
                </button>
              </div>
              {notifications.length ? (
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((event) => (
                    <li key={event.id} className="border-b border-border last:border-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          router.push("/health");
                        }}
                        className="flex w-full gap-3 px-4 py-3 text-left hover:bg-background"
                      >
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${event.severity === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm">{event.action}</span>
                          <span className="mt-1 block text-xs text-muted">{event.user} · {formatRelative(event.timestamp)}</span>
                        </span>
                        {!readIds.includes(event.id) ? <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" /> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-center text-sm text-muted">No active alerts.</p>
              )}
            </section>
          ) : null}
        </div>
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300">
            EV
          </div>
          <span className="text-xs font-medium">Elena Vasquez</span>
        </div>
      </div>
    </header>
  );
}

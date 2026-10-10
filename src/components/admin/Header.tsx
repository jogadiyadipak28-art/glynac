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
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 stroke-[3px]" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-100">{title}</h1>
          <p className="hidden truncate text-xs font-bold uppercase tracking-widest text-zinc-800/70 dark:text-zinc-100/70 sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <div className="relative">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 stroke-[3px] text-zinc-800/50 dark:text-zinc-100/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
                if (event.key === "Enter" && results[0]) openResult(results[0]);
              }}
              placeholder="SEARCH ADMIN"
              aria-label="Search users, rules, and feature flags"
              aria-expanded={needle.length > 0}
              className="h-10 w-36 rounded-xl border border-border bg-card/80 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:w-48 lg:w-64 placeholder:text-muted"
            />
          </label>
          {needle ? (
            <div className="glass-panel absolute right-0 top-14 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden">
              {results.length ? (
                <ul aria-label="Search results">
                  {results.map((result, index) => (
                    <li key={`${result.href}-${result.label}-${index}`}>
                      <button
                        type="button"
                        onClick={() => openResult(result)}
                        className="w-full border-b border-border px-4 py-3 text-left transition hover:bg-fuchsia-400/10 focus:bg-fuchsia-400/10 last:border-0"
                      >
                        <span className="block truncate text-sm font-black uppercase text-zinc-800 dark:text-zinc-100">{result.label}</span>
                        <span className="block truncate text-xs font-bold uppercase tracking-widest opacity-70 text-zinc-800 dark:text-zinc-100">{result.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm font-black uppercase text-center text-zinc-800 dark:text-zinc-100">No matching records.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 text-foreground transition hover:border-accent"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-5 w-5 stroke-[3px]" />
            {unreadCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border-[3px] border-black bg-rose-500 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {unreadCount}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? (
            <section className="glass-panel absolute right-0 top-14 z-40 w-[min(23rem,calc(100vw-2rem))] overflow-hidden" aria-label="Recent alerts">
              <div className="flex items-center justify-between border-b border-border bg-card/70 px-4 py-3">
                <div>
                  <h2 className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-100">Recent Alerts</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800/70 dark:text-zinc-100/70">Warnings and critical audit events</p>
                </div>
                <button
                  type="button"
                  disabled={unreadCount === 0}
                  onClick={() => setReadIds((ids) => [...new Set([...ids, ...notifications.map((event) => event.id)])])}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold uppercase tracking-widest text-foreground hover:border-accent disabled:opacity-40"
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
                        className="flex w-full gap-3 px-4 py-3 text-left hover:bg-white/5"
                      >
                        <span className={`mt-1 h-3 w-3 shrink-0 border-2 border-black dark:border-white ${event.severity === "critical" ? "bg-rose-500" : "bg-amber-400"}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold uppercase text-zinc-800 dark:text-zinc-100">{event.action}</span>
                          <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-800/70 dark:text-zinc-100/70">{event.user} · {formatRelative(event.timestamp)}</span>
                        </span>
                        {!readIds.includes(event.id) ? <span className="mt-1 h-3 w-3 shrink-0 border-2 border-black dark:border-white bg-teal-400" /> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-center text-sm font-black uppercase text-zinc-800 dark:text-zinc-100">No active alerts.</p>
              )}
            </section>
          ) : null}
        </div>

        <div className="hidden items-center gap-3 rounded-xl border border-border bg-card/80 p-1 pr-4 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-xs font-bold text-slate-950">
            EV
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Elena V.</span>
        </div>
      </div>
    </header>
  );
}

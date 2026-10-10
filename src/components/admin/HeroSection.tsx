import React from "react";

export function HeroSection({ children }: { children?: React.ReactNode }) {
  return (
    <section className="dashboard-backdrop relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(183,203,255,.7)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -left-24 top-28 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[.28em] text-cyan-200/80">Glynac · Compliance intelligence</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Executive analytics</h1>
            <p className="mt-1 text-sm text-indigo-100/65">Live compliance and health data across the firm</p>
          </div>
          <span className="rounded-full border border-cyan-200/20 bg-cyan-200/5 px-3 py-1.5 text-xs text-cyan-100/80">● Platform overview</span>
        </div>
        <div id="dashboard" className="relative">{children}</div>
      </div>
    </section>
  );
}

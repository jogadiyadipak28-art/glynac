# Glynac Admin Panel (Task 3 · FE-3)

Enterprise admin dashboard for the Glynac wealth-management compliance platform. Built from scratch with **Next.js App Router**, **TypeScript**, and **TailwindCSS**. All data is mocked in local state — no live production databases.

## Run locally

```bash
cd admin-panel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is included

| Area | Route | Behavior |
| --- | --- | --- |
| Analytics dashboard | `/` | Metric cards + Recharts trends with 7d / 30d / 90d / 12m filters |
| Users & RBAC | `/users` | Searchable, sortable, paginated table + role/permission modal |
| Policy manager | `/rules` | Severity edits, active toggles, custom rule form |
| Health & logs | `/health` | Live latency/error indicators + filterable audit stream |
| Feature flags | `/flags` | Toggles with instant toast feedback and activity logging |

Dark/light mode is persisted in `localStorage`.

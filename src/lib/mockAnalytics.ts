import type { ChartRange, Metrics, TrendPoint, ViolationSlice } from "./types";

export const metrics: Metrics = {
  documentsReviewed: 18420,
  violationsFlagged: 312,
  passRate: 94.7,
  avgReviewMinutes: 6.4,
  documentsDelta: 8.2,
  violationsDelta: -3.1,
  passRateDelta: 1.4,
  avgReviewDelta: -0.6,
};

export const trends: Record<ChartRange, TrendPoint[]> = {
  "7d": [
    { label: "Sun", reviews: 420, violations: 11, avgMinutes: 6.8 },
    { label: "Mon", reviews: 610, violations: 14, avgMinutes: 6.2 },
    { label: "Tue", reviews: 588, violations: 9, avgMinutes: 5.9 },
    { label: "Wed", reviews: 640, violations: 16, avgMinutes: 6.5 },
    { label: "Thu", reviews: 702, violations: 12, avgMinutes: 6.1 },
    { label: "Fri", reviews: 655, violations: 10, avgMinutes: 6.0 },
    { label: "Sat", reviews: 210, violations: 4, avgMinutes: 7.2 },
  ],
  "30d": Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    reviews: 420 + ((i * 37) % 220),
    violations: 6 + ((i * 5) % 14),
    avgMinutes: Number((5.8 + ((i * 3) % 14) / 10).toFixed(1)),
  })),
  "90d": Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    reviews: 2800 + ((i * 190) % 900),
    violations: 40 + ((i * 11) % 28),
    avgMinutes: Number((6.1 + ((i * 2) % 9) / 10).toFixed(1)),
  })),
  "12m": [
    { label: "Nov", reviews: 11240, violations: 198, avgMinutes: 7.4 },
    { label: "Dec", reviews: 10110, violations: 176, avgMinutes: 7.1 },
    { label: "Jan", reviews: 12480, violations: 221, avgMinutes: 6.9 },
    { label: "Feb", reviews: 13102, violations: 208, avgMinutes: 6.8 },
    { label: "Mar", reviews: 14220, violations: 244, avgMinutes: 6.7 },
    { label: "Apr", reviews: 15040, violations: 231, avgMinutes: 6.6 },
    { label: "May", reviews: 15890, violations: 255, avgMinutes: 6.5 },
    { label: "Jun", reviews: 16110, violations: 248, avgMinutes: 6.5 },
    { label: "Jul", reviews: 16780, violations: 270, avgMinutes: 6.4 },
    { label: "Aug", reviews: 17240, violations: 266, avgMinutes: 6.4 },
    { label: "Sep", reviews: 17890, violations: 301, avgMinutes: 6.3 },
    { label: "Oct", reviews: 18420, violations: 312, avgMinutes: 6.4 },
  ],
};

export const violationDistribution: ViolationSlice[] = [
  { rule: "FINRA-2210", count: 84 },
  { rule: "SEC-206-4", count: 61 },
  { rule: "DISC-09", count: 47 },
  { rule: "AML-03", count: 39 },
  { rule: "SUIT-04", count: 33 },
  { rule: "PII-12", count: 28 },
  { rule: "ARCH-21", count: 20 },
];

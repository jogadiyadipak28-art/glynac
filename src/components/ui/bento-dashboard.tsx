"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { metrics, trends, violationDistribution } from "@/lib/mockAnalytics";
import type { ChartRange } from "@/lib/types";

// =========================================
// 0. BRUTALIST METRIC CARDS
// =========================================
const BrutalistMetricCard = ({ label, value, delta, suffix = "" }: { label: string, value: number, delta: number, suffix?: string }) => {
  const isPositive = delta > 0;
  return (
    <div className="glass-panel p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 cursor-default">
      <span className="text-xs font-black uppercase tracking-widest text-zinc-800/70 dark:text-zinc-100/70 mb-2">{label}</span>
      <div className="flex items-end justify-between mt-auto">
        <span className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-zinc-100">
          {value.toLocaleString()}{suffix}
        </span>
        <div className={cn(
          "px-2 py-0.5 border-2 text-[10px] md:text-xs font-bold font-mono",
          isPositive ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-rose-100 border-rose-500 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
        )}>
          {isPositive ? "+" : ""}{delta}%
        </div>
      </div>
    </div>
  );
};


// =========================================
// 1. BRUTALIST BAR CHART (Violations)
// =========================================
const BrutalistBarChart = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  const top5Violations = violationDistribution.slice(0, 5);
  const maxViolation = Math.max(...top5Violations.map(v => v.count));
  const BAR_DATA = top5Violations.map((v, i) => ({
    label: v.rule.split("-")[0],
    fullLabel: v.rule,
    value: Math.round((v.count / maxViolation) * 100),
    realValue: v.count,
    color: ["bg-fuchsia-400", "bg-cyan-400", "bg-violet-400", "bg-sky-400", "bg-pink-400"][i],
  }));

  return (
    <div className="glass-panel relative flex h-full w-full flex-col p-6 transition-colors duration-200">
      <h3 className="glass-heading mb-6 border-b pb-2 text-xl font-semibold">
        Top Violations
      </h3>
      <div className="flex justify-between items-end flex-1 gap-2 sm:gap-4 min-h-[150px]">
        {BAR_DATA.map((item, i) => (
          <div key={i} className="relative flex-1 h-full flex items-end group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.value}%` }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: i * 0.1,
              }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className={cn(
                "w-full rounded-t-lg border border-white/20 relative z-10 cursor-pointer origin-bottom flex items-center justify-center overflow-hidden",
                item.color
              )}
              whileHover={{ scaleY: 1.1, scaleX: 1.05 }}
              whileTap={{ scaleY: 0.95 }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]"
              />
              <span className="relative z-20 font-bold text-xs font-mono text-zinc-800/80 dark:text-zinc-800/80 group-hover:text-zinc-900 transition-colors" title={item.fullLabel}>
                {item.label}
              </span>
            </motion.div>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full -mb-2 left-1/2 -translate-x-1/2 rounded-lg bg-indigo-950 text-white px-3 py-1 text-sm font-semibold whitespace-nowrap border border-indigo-300/30 z-30 pointer-events-none"
                >
                  {item.realValue}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. BRUTALIST RADAR CHART (Health/Metrics)
// ==========================================
const RADAR_DATA = [
  { label: "PASS", value: Math.round(metrics.passRate), color: "#55e1cf" },
  { label: "SPEED", value: Math.max(10, Math.round(100 - (metrics.avgReviewMinutes * 8))), color: "#28c7f7" },
  { label: "VOLUME", value: Math.min(100, Math.round((metrics.documentsReviewed / 20000) * 100)), color: "#aa8bfa" },
  { label: "FLAGS", value: Math.min(100, Math.round((metrics.violationsFlagged / 500) * 100)), color: "#f14fd0" },
  { label: "UPTIME", value: 99, color: "#ffc477" },
];

const NUM_AXES = RADAR_DATA.length;
const RADAR_SIZE = 200;
const CENTER = RADAR_SIZE / 2;
const RADIUS = 80;

const angleToRad = (angle: number) => (Math.PI / 180) * angle;
const getCoords = (value: number, index: number) => {
  const angle = angleToRad((360 / NUM_AXES) * index - 90);
  const r = (value / 100) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
};

const BrutalistRadarChart = () => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const pathData =
    RADAR_DATA.map((d, i) => {
      const coords = getCoords(d.value, i);
      return `${i === 0 ? "M" : "L"} ${coords.x} ${coords.y}`;
    }).join(" ") + " Z";

  const gridLevels = [100, 75, 50, 25];

  return (
    <div className="glass-panel relative flex h-full w-full flex-col gap-6 overflow-hidden p-6 transition-colors duration-200 sm:flex-row">
      {/* LEFT: CHART AREA */}
      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10">
          <span className="text-8xl font-black uppercase text-zinc-800 dark:text-zinc-100">
            HLTH
          </span>
        </div>

        <svg
          viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
          className="w-full h-full max-w-75 overflow-visible"
        >
          {/* Grid Background */}
          {gridLevels.map((level, lvlIdx) => (
            <path
              key={lvlIdx}
              d={
                RADAR_DATA.map((_, i) => {
                  const c = getCoords(level, i);
                  return `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`;
                }).join(" ") + " Z"
              }
              fill="none"
              className="stroke-black/10 dark:stroke-white/10"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}

          {/* Axes Lines */}
          {RADAR_DATA.map((_, i) => {
            const outer = getCoords(100, i);
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                className="stroke-black/10 dark:stroke-white/10"
                strokeWidth="2"
              />
            );
          })}

          {/* The Data Polygon */}
          <motion.path
            d={pathData}
      fill="rgba(241, 79, 208, 0.3)"
      className="stroke-fuchsia-300"
            strokeWidth="4"
            strokeLinejoin="round"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Interactive Points */}
          {RADAR_DATA.map((d, i) => {
            const coords = getCoords(d.value, i);
            const isHovered = hoveredMetric === d.label;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredMetric(d.label)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="cursor-pointer"
              >
                {/* 1. Invisible Hit Area */}
                <circle cx={coords.x} cy={coords.y} r="20" fill="transparent" />

                {/* 2. Visible Dot with Animation */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="6"
                  fill={isHovered ? d.color : "currentColor"}
                  className="fill-white dark:fill-zinc-900 stroke-black dark:stroke-white"
                  strokeWidth="3"
                  animate={{
                    scale: isHovered ? 2 : 1,
                    strokeWidth: isHovered ? 4 : 3,
                    fill: isHovered ? d.color : "var(--dot-bg, white)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* RIGHT: STATS LIST */}
      <div className="w-full sm:w-40 flex flex-col justify-center gap-2 z-10">
        <h3 className="glass-heading mb-2 border-b pb-2 text-xl font-semibold">
          Platform Health
        </h3>
        {RADAR_DATA.map((item, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setHoveredMetric(item.label)}
            onMouseLeave={() => setHoveredMetric(null)}
            className="flex items-center justify-between rounded-lg border border-transparent p-2 hover:border-border hover:bg-white/5 cursor-pointer transition-colors"
            animate={{
              x: hoveredMetric === item.label ? 10 : 0,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 border-2 border-black dark:border-white"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">
                {item.label}
              </span>
            </div>
            <span className="font-black text-sm text-zinc-800 dark:text-zinc-100">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =========================================
// 3. BRUTALIST DONUT CHART (Trend Volume)
// =========================================
const springConfig = { type: "spring" as const, stiffness: 300, damping: 20 };
const getPieCoords = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const BrutalistDonut = ({ data }: { data: { label: string; reviews: number }[] }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Take up to the last 4 data points to fit the 4 colors of the donut nicely
  const displayData = data.slice(-4);
  const totalReviews = displayData.reduce((sum, item) => sum + item.reviews, 0);
  
  let runningSum = 0;
  const PIE_DATA = displayData.map((item, i) => {
    let val = Math.round((item.reviews / totalReviews) * 100);
    if (i === displayData.length - 1) val = 100 - runningSum;
    runningSum += val;
    return {
      label: item.label,
      value: val,
      realValue: item.reviews,
      color: ["#f14fd0", "#28c7f7", "#aa8bfa", "#55e1cf"][i] || "#a78bfa"
    };
  });

  let cumulativePercent = 0;

  return (
    <div className="glass-panel relative flex h-full w-full flex-col items-center justify-between overflow-hidden p-6 transition-colors duration-200">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:12px_12px]"
      />
      <h3 className="glass-heading z-10 mb-8 w-full border-b pb-2 text-center text-2xl font-semibold tracking-tight">
        Review Volume
      </h3>
      <div className="z-10 flex flex-col items-center w-full h-full justify-center">
        <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
          <motion.svg
            viewBox="-1.2 -1.2 2.4 2.4"
            className="-rotate-90 overflow-visible w-full h-full"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: -90, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
          >
            {PIE_DATA.map((slice) => {
              const startPercent = cumulativePercent;
              const endPercent = cumulativePercent + slice.value / 100;
              cumulativePercent = endPercent;
              const [startX, startY] = getPieCoords(startPercent);
              const [endX, endY] = getPieCoords(endPercent);
              const largeArcFlag = slice.value / 100 > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");
              const isHovered = hoveredSlice === slice.label;
              const isDimmed = hoveredSlice !== null && !isHovered;

              return (
                <motion.path
                  key={slice.label}
                  d={pathData}
                  fill={slice.color}
                  className="stroke-black dark:stroke-white"
                  strokeWidth="0.04"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    translateX: isHovered ? (startX + endX) * 0.1 : 0,
                    translateY: isHovered ? (startY + endY) * 0.1 : 0,
                    scale: isHovered ? 1.05 : 1,
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? "grayscale(80%)" : "grayscale(0%)",
                  }}
                  transition={springConfig}
                  onMouseEnter={() => setHoveredSlice(slice.label)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
            <motion.circle
              cx="0"
              cy="0"
              r="0.55"
              className="fill-white dark:fill-zinc-900 stroke-black dark:stroke-white"
              strokeWidth="0.04"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, ...springConfig }}
            />
          </motion.svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <AnimatePresence mode="popLayout">
              {hoveredSlice ? (
                <motion.div
                  key="hover-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-xl font-black leading-none text-zinc-800 dark:text-zinc-100">
                    {PIE_DATA.find((d) => d.label === hoveredSlice)?.value}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-zinc-800 px-1 mt-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {hoveredSlice}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-2xl md:text-3xl font-black leading-none text-zinc-800 dark:text-zinc-100">
                    {totalReviews.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    TOTAL
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full mt-6 grid grid-cols-2 gap-2">
          {PIE_DATA.map((item) => (
            <motion.div
              key={item.label}
              onMouseEnter={() => setHoveredSlice(item.label)}
              onMouseLeave={() => setHoveredSlice(null)}
              animate={{
                opacity: hoveredSlice && hoveredSlice !== item.label ? 0.3 : 1,
                scale: hoveredSlice === item.label ? 1.05 : 1,
              }}
              className="flex items-center justify-between gap-2 rounded-lg border border-transparent p-2 hover:border-border hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-3 h-3 flex-shrink-0 border-2 border-black dark:border-white"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-lg md:text-2xl font-bold uppercase text-zinc-800 dark:text-zinc-100 truncate">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-bold text-zinc-800/70 dark:text-zinc-100/70 hidden md:block">
                {item.realValue.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================
// 4. MAIN BENTO LAYOUT (THE PAGE)
// =========================================
const ranges: { id: ChartRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

export default function BentoDashboard() {
  const [range, setRange] = useState<ChartRange>("12m");
  const data = useMemo(() => trends[range], [range]);

  return (
    <div className="w-full font-sans transition-colors duration-200">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-100">Analytics Overview</h2>
          <p className="text-sm font-bold tracking-widest text-zinc-800/70 dark:text-zinc-100/70 uppercase mt-1">Live Compliance & Health Data</p>
        </div>
        
        {/* RANGE FILTER - Brutalist style */}
        <div className="flex rounded-xl border border-border bg-slate-950/30 p-1">
          {ranges.map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-colors duration-200",
                range === item.id 
                  ? "rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-lg shadow-fuchsia-950/40" 
                  : "text-indigo-100/60 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <BrutalistMetricCard
          label="Docs Reviewed"
          value={metrics.documentsReviewed}
          delta={metrics.documentsDelta}
        />
        <BrutalistMetricCard
          label="Violations"
          value={metrics.violationsFlagged}
          delta={metrics.violationsDelta}
        />
        <BrutalistMetricCard
          label="Pass Rate"
          value={metrics.passRate}
          suffix="%"
          delta={metrics.passRateDelta}
        />
        <BrutalistMetricCard
          label="Review Time"
          value={metrics.avgReviewMinutes}
          suffix="m"
          delta={metrics.avgReviewDelta}
        />
      </div>

      {/* MAIN GRID TAKES REMAINING HEIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[minmax(0,1fr)]">
        {/* COLUMN 1 (LEFT): STACKED BAR + RADAR */}
        <div className="flex flex-col gap-6">
          <div className="w-full min-h-[400px]">
            <BrutalistBarChart />
          </div>
          <div className="w-full min-h-[400px]">
            <BrutalistRadarChart />
          </div>
        </div>

        {/* COLUMN 2 (RIGHT): FULL HEIGHT DONUT */}
        <div className="h-full min-h-[500px] lg:h-auto flex">
          <div className="w-full h-full">
            <BrutalistDonut data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/cn";

const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function WaveTooltip({ active, payload, label, series, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-xl border border-line bg-card p-3 text-sm shadow-[0_12px_32px_-12px_rgba(11,19,36,0.3)]">
      <p className="mb-1.5 text-[13px] font-bold text-muted">{label}</p>
      <ul className="flex flex-col gap-1">
        {[...series].reverse().map((s) => {
          const item = payload.find((p) => p.dataKey === s.key);
          if (!item) return null;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span className="size-2.5 flex-none rounded-full" style={{ background: s.color }} aria-hidden="true" />
              <span className="flex-1 text-body">{s.label}</span>
              <span className="font-mono font-semibold">{format(item.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Smooth, layered "wave" area chart.
 *
 * series: { key, label, color }[]  drawn back to front (put the lighter wave first)
 * baseline: "auto" zooms the vertical axis to the data so the waves stay readable;
 *           "zero" starts at 0 (use for counts that can reach zero)
 * summary: plain-text description for screen readers
 */
export default function WaveChart({
  data,
  series,
  format = (v) => v,
  axisFormat = format,
  height,
  className,
  axes = true,
  baseline = "auto",
  summary,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const domain =
    baseline === "zero"
      ? [0, (max) => Math.max(4, Math.ceil(max * 1.15))]
      : [(min) => Math.max(0, Math.floor((min * 0.75) / 1000) * 1000), (max) => Math.ceil((max * 1.08) / 1000) * 1000];

  return (
    <figure role="img" aria-label={summary} className={cn("m-0 w-full min-w-0", className)} style={height ? { height } : undefined}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: axes ? 0 : 12 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={i === series.length - 1 ? 0.5 : 0.32} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-divider)" strokeDasharray="3 6" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--color-muted)", fontSize: 13, fontWeight: 600 }} padding={{ left: 8, right: 8 }} />
          {axes ? (
            <YAxis
              width={46}
              tickCount={baseline === "zero" ? 5 : 4}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              domain={domain}
              tickFormatter={axisFormat}
              tick={{ fill: "var(--color-faint)", fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}
            />
          ) : (
            <YAxis hide domain={domain} />
          )}
          <Tooltip cursor={{ stroke: "var(--color-faint)", strokeDasharray: "4 4" }} content={<WaveTooltip series={series} format={format} />} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              fill={`url(#${uid}-${s.key})`}
              dot={false}
              connectNulls={false}
              activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--color-card)", fill: s.color }}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={900}
              animationEasing="ease-out"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </figure>
  );
}

/** Small colour key shown above or beside a chart. */
export function ChartLegend({ series }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold text-body">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

import { cn } from "@/lib/cn";

// Lightweight CSS bar chart. Highlights the last bar. Swap for Recharts when real data arrives.
export default function BarChart({ data, height = 200, format = (v) => v, highlightLast = true, showValues = true, summary }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div role="img" aria-label={summary ?? data.map((d) => `${d.label}: ${format(d.value)}`).join(", ")}>
      <div className="flex items-end gap-3 border-b border-line pb-1" style={{ height }}>
        {data.map((d, i) => {
          const last = highlightLast && i === data.length - 1;
          const h = Math.max((d.value / max) * (height - 28), 4);
          return (
            <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center justify-end gap-2">
              {showValues && (
                <span className={cn("font-mono text-[13px]", last ? "font-semibold text-brand-dark" : "text-muted")}>
                  {format(d.value)}
                </span>
              )}
              <div
                className={cn("w-full max-w-12 rounded-t-lg", last ? "bg-brand" : d.value ? "bg-brand/30" : "bg-line")}
                style={{ height: h }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d, i) => (
          <span key={`${d.label}-l-${i}`} className="flex-1 text-center text-[13px] font-semibold text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

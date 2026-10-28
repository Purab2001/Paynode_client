import Card from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const hintTones = { ok: "text-ok", warn: "text-warn", muted: "text-muted" };
const iconTones = {
  brand: "bg-brand-soft text-brand-dark",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  neutral: "bg-surface text-body",
};

/**
 * A headline number with context.
 * The footer (progress bar and/or hint) sits at the bottom, so cards in the same row line up
 * even when one has more to say than its neighbours. `highlight` marks a card that needs attention.
 */
export default function StatCard({ label, value, hint, hintTone = "muted", progress, icon: Icon, iconTone = "brand", highlight = false }) {
  const hasFooter = typeof progress === "number" || hint;
  return (
    <Card className={cn("flex flex-col gap-4 p-5", highlight && "border-warn/50 ring-1 ring-warn/20")}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className={cn("grid size-10 flex-none place-items-center rounded-xl", iconTones[iconTone])}>
            <Icon size={20} aria-hidden="true" />
          </span>
        )}
        <p className="text-sm font-bold text-muted">{label}</p>
      </div>
      <p className="font-mono text-[34px] font-semibold leading-none tracking-tight">{value}</p>
      {hasFooter && (
        <div className="mt-auto flex flex-col gap-2.5 border-t border-divider pt-3.5">
          {typeof progress === "number" && (
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-soft" role="presentation">
              <div className="h-full rounded-full bg-brand transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          )}
          {hint && <p className={cn("text-[13px] font-semibold", hintTones[hintTone])}>{hint}</p>}
        </div>
      )}
    </Card>
  );
}

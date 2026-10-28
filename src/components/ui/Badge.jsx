import { cn } from "@/lib/cn";

const tones = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  brand: "bg-brand-soft text-brand-dark",
  bad: "bg-bad-soft text-bad",
  neutral: "bg-surface text-body",
};

export const statusTone = { approved: "ok", paid: "ok", pending: "warn", rejected: "bad" };
export const statusLabel = { approved: "Approved", paid: "Paid", pending: "Pending", rejected: "Rejected" };

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-bold", tones[tone], className)}>
      {children}
    </span>
  );
}

import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import { Mono } from "@/components/ui/Table";
import { money } from "@/lib/format";

const PARTS = [
  { key: "paid", label: "Paid", bar: "bg-green-500" },
  { key: "pending", label: "Pending", bar: "bg-amber-400" },
  { key: "rejected", label: "Rejected", bar: "bg-red-400" },
];

/** Turn the API's `{ pending: { count, amount }, paid, rejected }` into rows for the breakdown. */
export const partsFromTotals = (totals) => PARTS.map((part) => ({ ...part, ...(totals?.[part.key] ?? { count: 0, amount: 0 }) }));

/** Stacked bar plus a row per status (count and amount). Fills the height of its row. */
export default function StatusBreakdown({ title, subtitle, parts, link }) {
  const total = parts.reduce((sum, p) => sum + p.count, 0);
  const summary = parts.map((p) => `${p.count} ${p.label.toLowerCase()}`).join(", ");

  return (
    <Card className="flex flex-col gap-5 p-6">
      <CardHeader title={title} subtitle={subtitle ?? `${total} ${total === 1 ? "request" : "requests"}`} />
      <div className="flex h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={summary}>
        {parts.map((p) => p.count > 0 && <div key={p.key} className={p.bar} style={{ width: `${(p.count / total) * 100}%` }} />)}
      </div>
      <ul className="flex flex-col divide-y divide-divider">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center gap-3 py-3 text-[15px]">
            <span className={`size-2.5 flex-none rounded-full ${p.bar}`} aria-hidden="true" />
            <span className="flex-1 font-semibold">{p.label}</span>
            <span className="text-sm text-muted">{p.count} {p.count === 1 ? "request" : "requests"}</span>
            <Mono className="w-24 text-right">{money(p.amount)}</Mono>
          </li>
        ))}
      </ul>
      {link && (
        <Link to={link.to} className="mt-auto inline-flex min-h-9 items-center gap-1.5 text-sm font-bold text-brand-dark hover:underline">
          {link.label} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </Card>
  );
}

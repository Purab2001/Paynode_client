import Badge from "@/components/ui/Badge";
import { Mono, UserCell } from "@/components/ui/Table";

const stats = [
  { label: "Employees", value: "42" },
  { label: "Paid in Oct", value: "$38,400" },
  { label: "Awaiting", value: "4" },
];

const bars = [46, 52, 49, 61, 58, 70, 66, 78];
const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const rows = [
  { name: "Lina Karim", sub: "HR · Dhaka", amount: "$5,900", status: "Approved", tone: "ok" },
  { name: "Daniel Kim", sub: "Engineering", amount: "$6,100", status: "Pending", tone: "warn" },
  { name: "Maya Torres", sub: "Support", amount: "$3,750", status: "Pending", tone: "warn" },
];

/** Static, decorative render of the admin overview, framed like a browser window. */
export default function DashboardPreview() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[20px] border border-line bg-card shadow-[0_24px_60px_-24px_rgba(11,19,36,0.28)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-3">
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 rounded-md bg-card px-3 py-0.5 text-xs text-muted">app.paynode.app/dashboard</span>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-subtle px-3 py-3">
              <p className="truncate text-[11px] font-semibold text-muted sm:text-xs">{s.label}</p>
              <p className="mt-1 font-mono text-base font-semibold sm:text-xl">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-line p-4">
          <p className="text-xs font-bold text-body">Monthly payroll</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {bars.map((h, i) => (
              <div key={months[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div className={i === bars.length - 1 ? "w-full rounded-t bg-brand" : "w-full rounded-t bg-brand/30"} style={{ height: `${h}%` }} />
                <span className="text-[10px] text-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-3">
              <div className="min-w-0 flex-1"><UserCell name={r.name} sub={r.sub} size={32} /></div>
              <Mono className="text-sm">{r.amount}</Mono>
              <Badge tone={r.tone}>{r.status}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

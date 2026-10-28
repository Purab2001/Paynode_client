import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Mono, UserCell } from "@/components/ui/Table";

const rows = [
  { name: "Nadia Rahman", role: "Product Designer", amount: "$5,400", status: "Paid", tone: "ok" },
  { name: "James Carter", role: "Support Lead", amount: "$4,100", status: "Pending", tone: "warn" },
  { name: "Arif Hossain", role: "Developer", amount: "$6,250", status: "Pending", tone: "warn" },
];

/** Static product preview card used on marketing pages. */
export default function PayrollPreview() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4 rounded-[20px] border border-line bg-card p-6 shadow-[0_24px_60px_-24px_rgba(11,19,36,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-muted">Payroll · October 2026</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">$48,250.00</p>
        </div>
        <Badge tone="warn" className="px-3 py-1.5 text-[13px]">4 awaiting approval</Badge>
      </div>
      <div className="h-px bg-line" />
      <ul className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3">
            <div className="min-w-0 flex-1"><UserCell name={r.name} sub={r.role} size={36} /></div>
            <Mono className="text-[15px]">{r.amount}</Mono>
            <Badge tone={r.tone}>{r.status}</Badge>
          </li>
        ))}
      </ul>
      <Button variant="dark" tabIndex={-1}>Approve &amp; pay 4 employees</Button>
    </div>
  );
}

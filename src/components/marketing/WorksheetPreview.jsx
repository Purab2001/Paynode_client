import Badge from "@/components/ui/Badge";
import { Mono } from "@/components/ui/Table";

const entries = [
  ["Mon", "Development", "Payroll export fixes", "7.5"],
  ["Mon", "Support", "Customer onboarding call", "1.0"],
  ["Tue", "Research", "Stripe payout options", "4.0"],
  ["Tue", "Paper-work", "Expense reports", "2.5"],
];

/** Static work-sheet preview for the Features page. */
export default function WorksheetPreview() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4 rounded-[20px] border border-line bg-card p-6 shadow-[0_24px_60px_-24px_rgba(11,19,36,0.25)]">
      <div className="flex items-baseline justify-between">
        <p className="font-extrabold">This week</p>
        <Mono className="text-2xl">15.0 h</Mono>
      </div>
      <ul className="flex flex-col divide-y divide-divider">
        {entries.map(([day, task, note, hours]) => (
          <li key={note} className="flex items-center gap-3 py-3">
            <span className="w-9 text-sm font-semibold text-muted">{day}</span>
            <Badge tone="brand">{task}</Badge>
            <span className="min-w-0 flex-1 truncate text-sm text-body">{note}</span>
            <Mono className="text-sm">{hours}</Mono>
          </li>
        ))}
      </ul>
    </div>
  );
}

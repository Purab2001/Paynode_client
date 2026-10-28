import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import Card, { CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import BarChart from "@/components/charts/BarChart";
import { useEmployee } from "@/features/employees/api";
import { useEmployeePayments } from "@/features/payments/api";
import { MONTHS } from "@/config/constants";
import { money } from "@/lib/format";

const LAST_12_MONTHS = Array.from({ length: 12 }, (_, i) => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
  return { label: MONTHS[d.getMonth()].slice(0, 3), key: `${d.getFullYear()}-${d.getMonth() + 1}` };
});

export default function EmployeeDetails() {
  const { id } = useParams();
  const { role } = useSession();
  const { data: e, isPending, isError, error, refetch } = useEmployee(id);
  const paid = useEmployeePayments(id);
  const back = role === "admin" ? "/dashboard/people" : "/dashboard/employees";

  if (isPending) {
    return (
      <div className="flex animate-pulse flex-col gap-4" aria-busy="true">
        <div className="h-28 rounded-2xl bg-line" />
        <div className="h-64 rounded-2xl bg-line" />
      </div>
    );
  }
  if (isError) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <h1 className="text-xl font-extrabold">{error.status === 404 ? "Employee not found" : "We couldn't load this employee"}</h1>
        <p className="text-muted">{error.message}</p>
        <div className="flex gap-2">
          <Button to={back} variant="secondary">Back to list</Button>
          {error.status !== 404 && <Button onClick={() => refetch()}>Try again</Button>}
        </div>
      </Card>
    );
  }

  // One bar per month for the last 12 months; months without a payment are gaps.
  const paidByMonth = new Map((paid.data?.items ?? []).map((p) => [`${p.period.year}-${p.period.month}`, p.amount]));
  const history = LAST_12_MONTHS.map((m) => ({ label: m.label, value: paidByMonth.get(m.key) ?? null }));

  return (
    <>
      <Link to={back} className="flex items-center gap-1 self-start text-sm font-bold text-brand-dark">
        <ChevronLeft size={16} aria-hidden="true" /> Back
      </Link>
      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Avatar name={e.name} src={e.photoUrl} size={72} />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold">{e.name}</h1>
          <p className="text-muted">{[e.designation, e.email].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={e.isVerified ? "ok" : "warn"}>{e.isVerified ? "Verified" : "Not verified"}</Badge>
          <Badge tone="brand">{e.role}</Badge>
          {!e.isActive && <Badge tone="bad">Deactivated</Badge>}
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm font-semibold text-muted">Monthly salary</p><p className="mt-1 font-mono text-2xl font-semibold">{money(e.salary)}</p></Card>
        <Card className="p-5"><p className="text-sm font-semibold text-muted">Bank account</p><p className="mt-1 font-mono text-2xl font-semibold">{e.bankLast4 ? `•••• ${e.bankLast4}` : "—"}</p></Card>
        <Card className="p-5"><p className="text-sm font-semibold text-muted">Joined</p><p className="mt-1 text-2xl font-extrabold">{new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p></Card>
      </div>
      <Card className="flex flex-col gap-5 p-6">
        <CardHeader title="Salary payments" subtitle={paid.isError ? "Payments couldn't be loaded" : "Last 12 months · months without a bar weren't paid"} />
        <BarChart data={history} height={220} format={(v) => `${(v / 1000).toFixed(1)}k`} />
      </Card>
    </>
  );
}

import { CalendarDays, Clock, FileText, Hourglass, Landmark, ShieldCheck, Timer, Users } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import PageHeader from "@/components/ui/PageHeader";
import Card, { CardHeader } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import StatusBreakdown, { partsFromTotals } from "@/components/dashboard/StatusBreakdown";
import WaveChart, { ChartLegend } from "@/components/charts/WaveChart";
import { useEmployeeStats } from "@/features/employees/api";
import { useMyStats, usePayrollStats } from "@/features/stats/api";
import { trendChange, trendData, weekChartData } from "@/features/stats/trend";
import { money } from "@/lib/format";

const hoursSeries = [{ key: "value", label: "Hours", color: "#2563eb" }];
const payrollSeries = [
  { key: "requested", label: "Requested", color: "#38bdf8" },
  { key: "paid", label: "Paid", color: "#2563eb" },
];

/** Wide main column and a narrower side column. items-start: each card is as tall as its own content. */
const row = "grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]";
const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);

function Distribution({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="py-6 text-center text-sm text-muted">Log some hours this month to see how your time is split.</p>;
  return (
    <ul className="flex flex-col gap-4">
      {data.map((d) => (
        <li key={d.label} className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm font-semibold">
            <span>{d.label}</span>
            <span className="font-mono text-muted">{Math.round((d.value / total) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(d.value / total) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmployeeOverview() {
  const stats = useMyStats();
  const s = stats.data;
  const week = weekChartData(s?.week);
  return (
    <>
      <PageHeader title="Overview" subtitle="How your time is spent." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="Hours this week" value={s ? s.weekHours.toFixed(1) : "—"} hint="Monday to Friday" />
        <StatCard icon={Clock} iconTone="ok" label="Hours this month" value={s ? s.monthHours.toFixed(1) : "—"} hint={s ? `Across ${s.monthEntries} ${s.monthEntries === 1 ? "entry" : "entries"}` : "Loading…"} />
        <StatCard icon={FileText} iconTone="warn" label="Entries this month" value={s ? s.monthEntries : "—"} hint={s ? `${s.taskDistribution.length} task ${s.taskDistribution.length === 1 ? "type" : "types"} used` : "Loading…"} />
        <StatCard icon={Timer} iconTone="neutral" label="Avg. hours per day" value={s ? s.avgPerDay.toFixed(1) : "—"} hint={s ? `Over ${s.daysLogged} ${s.daysLogged === 1 ? "day" : "days"} with entries` : "Loading…"} />
      </div>
      {stats.isError && <p role="alert" className="text-sm text-bad">We couldn't load your numbers. {stats.error.message}</p>}
      <div className={row}>
        <Card className="flex flex-col gap-5 p-6">
          <CardHeader title="Weekly hours" subtitle={`${(s?.weekHours ?? 0).toFixed(1)} hours logged this week`} />
          <WaveChart
            data={week.length ? week : ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label) => ({ label, value: null }))}
            series={hoursSeries}
            baseline="zero"
            format={(v) => `${v} h`}
            axisFormat={(v) => `${v}h`}
            height={240}
            summary="Hours logged each weekday this week."
          />
        </Card>
        <Card className="flex flex-col gap-5 p-6">
          <CardHeader title="Task distribution" subtitle="Share of hours logged this month" />
          <Distribution data={s?.taskDistribution ?? []} />
        </Card>
      </div>
    </>
  );
}

function OrgOverview({ role }) {
  const stats = useEmployeeStats();
  const payroll = usePayrollStats();
  const s = stats.data;
  const data = trendData(payroll.data?.trend, 6);
  const { latest, previous, change } = trendChange(data);
  const pending = payroll.data?.pending;

  return (
    <>
      <PageHeader title="Overview" subtitle={role === "admin" ? "Organisation-wide numbers." : "Staff numbers and the pay requests you've sent."} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Headcount"
          value={s ? s.total : "—"}
          hint={s ? (role === "admin" ? `${s.hr} HR · ${s.total - s.hr} employees` : "Active employees") : "Loading…"}
        />
        <StatCard
          icon={ShieldCheck}
          iconTone="ok"
          label="Verified"
          value={s ? s.verified : "—"}
          progress={s ? pct(s.verified, s.total) : undefined}
          hint={s ? `${pct(s.verified, s.total)}% of staff verified` : "Loading…"}
        />
        <StatCard
          icon={Landmark}
          iconTone="neutral"
          label={`Paid in ${latest?.label ?? "this month"}`}
          value={payroll.data ? money(latest?.paid ?? 0) : "—"}
          hint={change === null ? "Nothing to compare yet" : `${change >= 0 ? "Up" : "Down"} ${Math.abs(change).toFixed(1)}% on ${previous.label}`}
          hintTone={change === null ? undefined : change >= 0 ? "ok" : "warn"}
        />
        <StatCard
          icon={Hourglass}
          iconTone="warn"
          label="Pending requests"
          value={pending ? pending.count : "—"}
          hint={pending ? `${money(pending.amount)} ${role === "admin" ? "awaiting you" : "awaiting an admin"}` : "Loading…"}
          hintTone={pending?.count ? "warn" : undefined}
        />
      </div>
      {payroll.isError && <p role="alert" className="text-sm text-bad">We couldn't load payroll numbers. {payroll.error.message}</p>}
      <div className={row}>
        <Card className="flex flex-col gap-5 p-6">
          <CardHeader title="Payroll by month" subtitle="Requested vs paid, last 6 months" action={<ChartLegend series={[...payrollSeries].reverse()} />} />
          <WaveChart
            data={data}
            series={payrollSeries}
            format={(v) => money(v)}
            axisFormat={(v) => `$${(v / 1000).toFixed(0)}k`}
            height={280}
            summary="Payroll requested and paid over the last six months."
          />
        </Card>
        <StatusBreakdown title="Requests by status" parts={partsFromTotals(payroll.data?.all)} link={role === "admin" ? { to: "/dashboard/payroll", label: "Open payroll" } : undefined} />
      </div>
    </>
  );
}

export default function Overview() {
  const { role } = useSession();
  return role === "Employee" ? <EmployeeOverview /> : <OrgOverview role={role} />;
}

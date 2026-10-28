import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Banknote, CalendarDays, CircleCheck, Clock, FileText, Hourglass, Plus, ShieldCheck, Tag, Timer, TrendingUp, User, UserCheck, Users, Wallet } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import PageHeader from "@/components/ui/PageHeader";
import Card, { CardHeader, TableCard } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge, { statusTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Field";
import StatusBreakdown, { partsFromTotals } from "@/components/dashboard/StatusBreakdown";
import WaveChart, { ChartLegend } from "@/components/charts/WaveChart";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import { useEmployeeStats } from "@/features/employees/api";
import { usePayrollRequests } from "@/features/payroll/api";
import { useActivity, useMyStats, usePayrollStats } from "@/features/stats/api";
import { trendChange, trendData, weekChartData } from "@/features/stats/trend";
import { usePageState } from "@/hooks/usePagination";
import { MONTHS } from "@/config/constants";
import { money, periodLabel, shortDate, timeAgo } from "@/lib/format";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
const firstName = (name = "") => name.split(" ")[0];
const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);
const show = (stats, key) => (stats.isPending ? "—" : stats.isError ? "!" : stats.data[key]);
const compactK = (v) => `$${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`;
const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// Back wave first (lighter), front wave last.
const payrollSeries = [
  { key: "requested", label: "Requested", color: "#38bdf8" },
  { key: "paid", label: "Paid", color: "#2563eb" },
];

/** Wide main column and a narrower side column. items-start: each card is as tall as its own content. */
const mainGrid = "grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]";

function PayrollWaveCard({ stats }) {
  const [range, setRange] = useState("12");
  const all = trendData(stats.data?.trend);
  const data = all.slice(-Number(range));
  const { latest, previous, change } = trendChange(all);

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-extrabold">Payroll</h2>
          <p className="mt-1 text-sm text-muted">Requested vs paid each month</p>
        </div>
        <div className="w-40">
          <Tabs label="Time range" value={range} onChange={setRange} items={[{ value: "6", label: "6M" }, { value: "12", label: "12M" }]} />
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-[13px] font-semibold text-muted">Paid in {latest?.label ?? "this month"}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <Mono className="text-3xl">{stats.isPending ? "—" : money(latest?.paid ?? 0)}</Mono>
            {change !== null && (
              <Badge tone={change >= 0 ? "ok" : "bad"} className="gap-1">
                <TrendingUp size={13} aria-hidden="true" className={change < 0 ? "rotate-180" : undefined} />
                {Math.abs(change).toFixed(1)}% vs {previous.label}
              </Badge>
            )}
          </div>
        </div>
        <ChartLegend series={[...payrollSeries].reverse()} />
      </div>

      {stats.isError ? (
        <p role="alert" className="py-10 text-center text-sm text-muted">We couldn't load the payroll chart. {stats.error.message}</p>
      ) : (
        <WaveChart
          data={data}
          series={payrollSeries}
          format={(v) => money(v)}
          axisFormat={compactK}
          height={300}
          summary={`Payroll requested and paid over the last ${range} months.${latest ? ` ${latest.label}: ${money(latest.paid)} paid.` : ""}`}
        />
      )}
    </Card>
  );
}

function ApprovalCard({ stats }) {
  const shown = usePayrollRequests({ status: "pending", limit: 3 });
  const pending = stats.data?.pending ?? { count: 0, amount: 0 };
  const more = pending.count - (shown.data?.items.length ?? 0);
  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader
        title="Needs your approval"
        action={<Link to="/dashboard/payroll" className="inline-flex min-h-9 items-center text-sm font-bold text-brand-dark hover:underline">View all</Link>}
      />
      <div className="flex items-baseline justify-between rounded-xl bg-surface px-4 py-3">
        <span className="text-sm font-bold">{count(pending.count, "request")}</span>
        <Mono className="text-xl">{money(pending.amount)}</Mono>
      </div>
      {pending.count === 0 && !stats.isPending ? (
        <p className="py-6 text-center text-sm text-muted">You're all caught up. New requests from HR will show up here.</p>
      ) : (
        <ul>
          {(shown.data?.items ?? []).map((p) => (
            <li key={p.id} className="flex items-center gap-3 border-b border-divider py-3 last:border-0">
              <Avatar name={p.employee?.name ?? "?"} src={p.employee?.photoUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.employee?.name}</p>
                <p className="truncate text-[13px] text-muted">{periodLabel(p.period)} · by {p.requestedBy?.name}</p>
              </div>
              <Mono>{money(p.amount)}</Mono>
            </li>
          ))}
        </ul>
      )}
      {more > 0 && <p className="-mt-2 text-[13px] font-semibold text-muted">+ {more} more waiting</p>}
      <Button to="/dashboard/payroll" className="mt-auto">
        {pending.count ? <>Review &amp; pay {money(pending.amount)} <ArrowRight size={16} aria-hidden="true" /></> : "Open payroll"}
      </Button>
    </Card>
  );
}

/** First thing an admin sees: what is waiting for them, and the one button to deal with it. */
function ApprovalStrip({ pending }) {
  if (!pending?.count) return null;
  return (
    <section
      aria-label="Payroll awaiting approval"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-warn/40 bg-warn-soft px-5 py-4"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 flex-none place-items-center rounded-xl bg-card text-warn"><Hourglass size={20} aria-hidden="true" /></span>
        <div>
          <p className="font-extrabold text-fg">{count(pending.count, "payroll request")} {pending.count === 1 ? "needs" : "need"} your approval</p>
          <p className="text-sm text-body">{money(pending.amount)} total, waiting for you to pay through Stripe.</p>
        </div>
      </div>
      <Button to="/dashboard/payroll">Review &amp; pay <ArrowRight size={16} aria-hidden="true" /></Button>
    </section>
  );
}

function ActivityCard() {
  const feed = useActivity();
  const pg = usePageState({ initialSize: 4 });
  const items = feed.data?.items ?? [];
  const rows = items.slice((pg.page - 1) * pg.pageSize, pg.page * pg.pageSize);
  return (
    <TableCard title="Recent activity" subtitle="Payments, access and role changes">
      <TableWrap minWidth={520} caption="Recent activity">
        <thead>
          <tr>
            <Th icon={Tag} className="w-28">Type</Th>
            <Th icon={FileText}>Activity</Th>
            <Th icon={UserCheck} className="max-2xl:hidden">Details</Th>
            <Th icon={Clock} align="right" className="w-36">When</Th>
          </tr>
        </thead>
        <tbody>
          {feed.isPending && <TableLoading colSpan={4} rows={4} />}
          {feed.isError && <TableError colSpan={4} error={feed.error} onRetry={feed.refetch} />}
          {rows.map((a) => (
            <tr key={a.id} className="transition-colors hover:bg-subtle">
              <Td><Badge tone={a.tone}>{a.kind}</Badge></Td>
              <Td className="font-semibold">{a.text}</Td>
              <Td className="text-[13px] text-muted max-2xl:hidden">{a.detail}</Td>
              <Td className="whitespace-nowrap text-right text-sm text-muted">{timeAgo(a.at)}</Td>
            </tr>
          ))}
          {feed.isSuccess && items.length === 0 && <TableEmpty colSpan={4} icon={FileText} title="Nothing yet">Role, salary and payment changes will be listed here.</TableEmpty>}
        </tbody>
      </TableWrap>
      <Pagination page={pg.page} pages={Math.max(1, Math.ceil(items.length / pg.pageSize))} total={items.length} pageSize={pg.pageSize} onPage={pg.setPage} noun="events" />
    </TableCard>
  );
}

export function AdminDashboard({ user }) {
  const stats = useEmployeeStats();
  const payroll = usePayrollStats();
  const s = stats.data;
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName(user.name)}`}
        subtitle="Here's what needs your attention today."
      />

      <ApprovalStrip pending={payroll.data?.pending} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Active staff" value={show(stats, "total")} hint={s ? `${s.hr} HR · ${s.total - s.hr} employees` : "Loading…"} />
        <StatCard icon={ShieldCheck} iconTone="ok" label="Verified" value={show(stats, "verified")} progress={s ? pct(s.verified, s.total) : undefined} hint={s ? `${pct(s.verified, s.total)}% of staff verified` : "Loading…"} />
        <StatCard
          icon={Hourglass}
          iconTone="warn"
          label="Awaiting verification"
          value={show(stats, "unverified")}
          hint={s?.unverified ? "HR is reviewing" : "All caught up"}
          hintTone={s?.unverified ? "warn" : "ok"}
          highlight={!!s?.unverified}
        />
        <StatCard icon={UserCheck} iconTone="neutral" label="HR members" value={show(stats, "hr")} hint="Verify staff and request pay" />
      </div>

      <div className={mainGrid}>
        <PayrollWaveCard stats={payroll} />
        <ApprovalCard stats={payroll} />
      </div>

      <div className={mainGrid}>
        <ActivityCard />
        <StatusBreakdown title={payroll.data ? `${MONTHS[payroll.data.period.month - 1]} requests` : "This month's requests"} parts={partsFromTotals(payroll.data?.thisMonth)} link={{ to: "/dashboard/payroll", label: "Open payroll" }} />
      </div>
    </>
  );
}

export function HRDashboard({ user }) {
  const stats = useEmployeeStats();
  const pg = usePageState({ initialSize: 4 });
  const requests = usePayrollRequests({ page: pg.page, limit: pg.pageSize });
  const s = stats.data;
  const rows = requests.data?.items ?? [];
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName(user.name)}`}
        subtitle="Verify new staff and keep payroll requests moving."
        actions={s?.unverified ? <Button to="/dashboard/employees">Verify {s.unverified} new {s.unverified === 1 ? "employee" : "employees"} <ArrowRight size={16} aria-hidden="true" /></Button> : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Employees" value={show(stats, "total")} hint="Active accounts you manage" />
        <StatCard icon={ShieldCheck} iconTone="ok" label="Verified" value={show(stats, "verified")} progress={s ? pct(s.verified, s.total) : undefined} hint={s ? `${pct(s.verified, s.total)}% of employees verified` : "Loading…"} />
        <StatCard
          icon={Hourglass}
          iconTone="warn"
          label="Unverified"
          value={show(stats, "unverified")}
          hint={s?.unverified ? "Needs your review" : "All caught up"}
          hintTone={s?.unverified ? "warn" : "ok"}
          highlight={!!s?.unverified}
        />
      </div>
      <TableCard
        title="Recent payroll requests"
        subtitle="What you've sent to an admin"
        action={<Link to="/dashboard/employees" className="inline-flex min-h-9 items-center text-sm font-bold text-brand-dark hover:underline">Request more</Link>}
      >
        <TableWrap minWidth={560} caption="Recent payroll requests">
          <thead>
            <tr>
              <Th icon={User}>Employee</Th>
              <Th icon={CalendarDays}>Pay period</Th>
              <Th icon={Banknote} align="right">Amount</Th>
              <Th icon={CircleCheck} align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {requests.isPending && <TableLoading colSpan={4} rows={4} />}
            {requests.isError && <TableError colSpan={4} error={requests.error} onRetry={requests.refetch} />}
            {rows.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-subtle">
                <Td><UserCell name={p.employee?.name ?? "Former employee"} sub={p.employee?.email} src={p.employee?.photoUrl} /></Td>
                <Td>{periodLabel(p.period)}</Td>
                <Td className="text-right"><Mono>{money(p.amount)}</Mono></Td>
                <Td className="text-right"><Badge tone={statusTone[p.status]} className="capitalize">{p.status}</Badge></Td>
              </tr>
            ))}
            {requests.isSuccess && rows.length === 0 && <TableEmpty colSpan={4} icon={Banknote} title="No requests yet">Request pay for a verified employee from the Employees page.</TableEmpty>}
          </tbody>
        </TableWrap>
        {requests.data && <Pagination page={requests.data.page} pages={requests.data.pages} total={requests.data.total} pageSize={pg.pageSize} onPage={pg.setPage} noun="requests" />}
      </TableCard>
    </>
  );
}

const hoursSeries = [{ key: "value", label: "Hours", color: "#2563eb" }];

export function EmployeeDashboard({ user }) {
  const stats = useMyStats();
  const s = stats.data;
  const week = weekChartData(s?.week);
  const last = s?.lastPayment;
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName(user.name)}`}
        subtitle="Your hours, tasks and pay at a glance."
        actions={<Button to="/dashboard/worksheet"><Plus size={16} aria-hidden="true" /> Add entry</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} label="Hours this month" value={s ? s.monthHours.toFixed(1) : "—"} hint={s ? `Across ${count(s.monthEntries, "entry", "entries")}` : "Loading…"} />
        <StatCard icon={Timer} iconTone="neutral" label="Avg. hours per entry" value={s ? s.avgPerEntry.toFixed(1) : "—"} hint="Hours divided by entries" />
        <StatCard
          icon={Wallet}
          iconTone="ok"
          label="Last payment"
          value={s ? (last ? money(last.amount) : "—") : "—"}
          hint={last ? `Paid for ${periodLabel(last.period)}` : "Nothing paid yet"}
        />
        <StatCard icon={CalendarDays} iconTone="warn" label="Hours this week" value={s ? s.weekHours.toFixed(1) : "—"} hint="Monday to Friday" />
      </div>
      {stats.isError && <p role="alert" className="text-sm text-bad">We couldn't load your numbers. {stats.error.message}</p>}
      <div className={mainGrid}>
        <Card className="flex flex-col gap-4 p-6">
          <CardHeader
            title="Latest entries"
            subtitle="Your most recent work sheet entries"
            action={<Link to="/dashboard/worksheet" className="inline-flex min-h-9 items-center text-sm font-bold text-brand-dark hover:underline">View all</Link>}
          />
          {s && s.latestEntries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No entries yet. Log your first hours from the work sheet.</p>
          ) : (
            <ul>
              {(s?.latestEntries ?? []).map((w) => (
                <li key={w.id} className="flex items-center gap-3 border-b border-divider py-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{w.note || w.task}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[13px] text-muted"><Badge tone="brand">{w.task}</Badge>{shortDate(w.date)}</p>
                  </div>
                  <Mono>{w.hours} h</Mono>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="flex flex-col gap-4 p-6">
          <CardHeader title="Hours this week" subtitle={`${(s?.weekHours ?? 0).toFixed(1)} hours logged`} />
          <WaveChart
            data={week.length ? week : ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label) => ({ label, value: null }))}
            series={hoursSeries}
            baseline="zero"
            format={(v) => `${v} h`}
            axisFormat={(v) => `${v}h`}
            height={220}
            summary={`Hours logged each weekday this week, ${(s?.weekHours ?? 0).toFixed(1)} in total.`}
          />
        </Card>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { role, user } = useSession();
  if (role === "admin") return <AdminDashboard user={user} />;
  if (role === "HR") return <HRDashboard user={user} />;
  return <EmployeeDashboard user={user} />;
}

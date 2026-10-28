import { Banknote, CalendarCheck, CalendarDays, Check, Copy, Receipt, TrendingUp, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { TableCard } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th } from "@/components/ui/Table";
import { useMyPayments } from "@/features/payments/api";
import { usePageState } from "@/hooks/usePagination";
import { MONTHS } from "@/config/constants";
import { money, shortDate } from "@/lib/format";

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied");
  } catch {
    toast.error("Couldn't copy. Select the ID and copy it manually.");
  }
}

const periodLabel = (p) => `${MONTHS[p.month - 1]} ${p.year}`;

export default function Payments() {
  const pg = usePageState({ initialSize: 5 });
  const list = useMyPayments({ page: pg.page, limit: pg.pageSize });
  const rows = list.data?.items ?? [];
  const summary = list.data?.summary;
  const count = list.data?.total ?? 0;
  const last = summary?.last;

  return (
    <>
      <PageHeader title="Payment history" subtitle="Every salary payment, with its Stripe transaction ID." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total paid" value={money(summary?.totalPaid ?? 0)} hint={`${count} ${count === 1 ? "payment" : "payments"}`} />
        <StatCard icon={TrendingUp} iconTone="ok" label="Average payment" value={money(count ? Math.round(summary.totalPaid / count) : 0)} hint="Before any adjustments" />
        <StatCard
          icon={CalendarCheck}
          iconTone="neutral"
          label="Last payment"
          value={last ? money(last.amount) : "—"}
          hint={last ? `${periodLabel(last.period)} · ${shortDate(last.paidAt.slice(0, 10))}` : "Nothing paid yet"}
        />
      </div>

      <TableCard title="Payments" subtitle="Newest first">
        <TableWrap minWidth={720} caption="Salary payments">
          <thead>
            <tr>
              <Th icon={CalendarDays} className="w-[30%]">Pay period</Th>
              <Th className="w-[14%]">Status</Th>
              <Th icon={CalendarCheck} className="w-[18%]">Paid on</Th>
              <Th icon={Banknote} align="right" className="w-[16%]">Amount</Th>
              <Th icon={Receipt}>Transaction ID</Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={5} />}
            {list.isError && <TableError colSpan={5} error={list.error} onRetry={list.refetch} />}
            {rows.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-subtle">
                <Td className="font-bold">{periodLabel(p.period)}</Td>
                <Td><Badge tone="ok" className="gap-1"><Check size={12} aria-hidden="true" /> Paid</Badge></Td>
                <Td className="whitespace-nowrap text-body">{shortDate(p.paidAt.slice(0, 10))}</Td>
                <Td className="text-right"><Mono>{money(p.amount, { cents: true })}</Mono></Td>
                <Td>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-mono text-sm text-muted">{p.transactionId}</span>
                    <IconButton label={`Copy transaction ID for ${periodLabel(p.period)}`} onClick={() => copy(p.transactionId)} className="size-8">
                      <Copy size={14} />
                    </IconButton>
                  </span>
                </Td>
              </tr>
            ))}
            {list.isSuccess && rows.length === 0 && <TableEmpty colSpan={5} icon={Receipt} title="No payments yet">Payments appear here once your first payroll is paid.</TableEmpty>}
          </tbody>
        </TableWrap>
        {list.data && (
          <Pagination page={list.data.page} pages={list.data.pages} total={list.data.total} pageSize={pg.pageSize} onPage={pg.setPage} onPageSize={pg.setPageSize} noun="payments" />
        )}
      </TableCard>
    </>
  );
}

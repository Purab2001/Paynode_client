import { useState } from "react";
import { Banknote, CalendarDays, CircleCheck, Inbox, User, UserCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge, { statusTone } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Field, Tabs, Textarea } from "@/components/ui/Field";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import PayModal from "@/components/payroll/PayModal";
import { useRejectPayroll, usePayrollRequests } from "@/features/payroll/api";
import { usePageState } from "@/hooks/usePagination";
import { money, periodLabel, shortDate } from "@/lib/format";

const emptyText = {
  pending: ["You're all caught up", "New requests from HR will appear here."],
  paid: ["No payments yet", "Paid requests will be listed here."],
  rejected: ["Nothing rejected", "Requests you reject will be listed here."],
};

export default function Payroll() {
  const [tab, setTab] = useState("pending");
  const [paying, setPaying] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const pg = usePageState({ initialSize: 10, resetKey: tab });

  const list = usePayrollRequests({ status: tab, page: pg.page, limit: pg.pageSize });
  const reject = useRejectPayroll();
  const rows = list.data?.items ?? [];
  const counts = list.data?.counts;
  const pageTotal = rows.reduce((s, r) => s + r.amount, 0);

  const closeReject = () => {
    setRejecting(null);
    setReason("");
  };
  const confirmReject = (e) => {
    e.preventDefault();
    reject.mutate({ id: rejecting.id, reason: reason.trim() || undefined }, { onSuccess: closeReject });
  };

  return (
    <>
      <PageHeader
        title="Payroll"
        subtitle="Requests sent by HR. Pay through Stripe, or reject with a reason."
        actions={
          <Tabs
            label="Request status"
            value={tab}
            onChange={setTab}
            items={[
              { value: "pending", label: `Pending · ${counts?.pending ?? 0}` },
              { value: "paid", label: `Paid · ${counts?.paid ?? 0}` },
              { value: "rejected", label: `Rejected · ${counts?.rejected ?? 0}` },
            ]}
          />
        }
      />

      <Card className="overflow-hidden">
        <TableWrap minWidth={760} caption={`${tab} payroll requests`}>
          <thead>
            <tr>
              <Th icon={User}>Employee</Th>
              <Th icon={CalendarDays}>Pay period</Th>
              <Th icon={UserCheck}>Requested by</Th>
              <Th icon={Banknote} align="right">Amount</Th>
              <Th icon={tab === "pending" ? undefined : CircleCheck} align="right">{tab === "pending" ? <span className="sr-only">Actions</span> : "Status"}</Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={5} />}
            {list.isError && <TableError colSpan={5} error={list.error} onRetry={list.refetch} />}
            {rows.map((r) => (
              <tr key={r.id}>
                <Td><UserCell name={r.employee?.name ?? "Former employee"} sub={r.employee?.email} src={r.employee?.photoUrl} /></Td>
                <Td>{periodLabel(r.period)}</Td>
                <Td className="text-body">{r.requestedBy?.name}</Td>
                <Td className="text-right"><Mono>{money(r.amount, { cents: true })}</Mono></Td>
                <Td className="whitespace-nowrap text-right">
                  {tab === "pending" ? (
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" variant="danger" onClick={() => setRejecting(r)}>Reject</Button>
                      <Button size="sm" onClick={() => setPaying(r)}>Pay</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <Badge tone={statusTone[r.status]}>{r.status === "paid" ? "Paid" : "Rejected"}</Badge>
                      {r.status === "paid" && r.paidAt && <span className="text-xs text-muted">{shortDate(r.paidAt.slice(0, 10))}</span>}
                      {r.status === "rejected" && r.rejectReason && <span className="max-w-56 truncate text-xs text-muted" title={r.rejectReason}>{r.rejectReason}</span>}
                    </div>
                  )}
                </Td>
              </tr>
            ))}
            {list.isSuccess && rows.length === 0 && <TableEmpty colSpan={5} icon={Inbox} title={emptyText[tab][0]}>{emptyText[tab][1]}</TableEmpty>}
          </tbody>
        </TableWrap>
        {list.data && (
          <Pagination
            page={list.data.page}
            pages={list.data.pages}
            total={list.data.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
            onPageSize={pg.setPageSize}
            noun={`${tab} requests`}
            extra={rows.length > 0 && <>On this page <Mono className="text-fg">{money(pageTotal, { cents: true })}</Mono></>}
          />
        )}
      </Card>

      <PayModal request={paying} onClose={() => setPaying(null)} />

      <Modal open={!!rejecting} onClose={closeReject} title="Reject this request?">
        {rejecting && (
          <form onSubmit={confirmReject} className="flex flex-col gap-4">
            <p className="text-body">
              The {periodLabel(rejecting.period)} request for {rejecting.employee?.name} ({money(rejecting.amount)}) will be rejected. HR can send a new request afterwards.
            </p>
            <Field label="Reason" optional hint="HR will see this note.">
              <Textarea rows={3} maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Hours for this month haven't been approved yet" />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closeReject}>Keep request</Button>
              <Button type="submit" variant="destructive" disabled={reject.isPending}>{reject.isPending ? "Rejecting…" : "Reject request"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

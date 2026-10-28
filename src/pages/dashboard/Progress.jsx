import { useState } from "react";
import { Calendar, CalendarDays, CircleDot, Clock, Check, SearchX, Tag, User, Users, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button, { IconButton } from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import { useEmployees } from "@/features/employees/api";
import { useReviewWorksheet, useTeamWorksheets } from "@/features/worksheets/api";
import { usePageState } from "@/hooks/usePagination";
import { shortDate } from "@/lib/format";
import { STATUS_BADGE } from "@/features/worksheets/status";

const monthOptions = () => {
  const now = new Date();
  const options = [{ value: "", label: "All months" }];
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
  }
  return options;
};
const MONTH_OPTIONS = monthOptions();

const STATUS_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "submitted", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function Progress() {
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");
  const pg = usePageState({ initialSize: 10, resetKey: `${employee}|${month}|${status}` });

  const people = useEmployees({ role: "Employee", limit: 100 });
  const peopleOptions = [{ value: "", label: "All employees" }, ...(people.data?.items ?? []).map((p) => ({ value: p.id, label: p.name }))];

  const list = useTeamWorksheets({
    employee: employee || undefined,
    month: month || undefined,
    status: status || undefined,
    page: pg.page,
    limit: pg.pageSize,
  });
  const review = useReviewWorksheet();
  const rows = list.data?.items ?? [];
  const filtered = employee || month || status;

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Work logged across the team. Approve entries to lock them."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-56"><Select aria-label="Filter by employee" icon={Users} value={employee} onChange={setEmployee} options={peopleOptions} className="py-2.5 text-sm" /></div>
            <div className="w-52"><Select aria-label="Filter by month" icon={CalendarDays} value={month} onChange={setMonth} options={MONTH_OPTIONS} className="py-2.5 text-sm" /></div>
            <div className="w-44"><Select aria-label="Filter by status" icon={CircleDot} value={status} onChange={setStatus} options={STATUS_OPTIONS} className="py-2.5 text-sm" /></div>
            {filtered && <Button variant="ghost" size="sm" onClick={() => { setEmployee(""); setMonth(""); setStatus(""); }}>Clear</Button>}
          </div>
        }
      />
      <Card className="overflow-hidden">
        <TableWrap minWidth={820} caption="Team work entries">
          <thead>
            <tr>
              <Th icon={User}>Employee</Th>
              <Th icon={Tag}>Task</Th>
              <Th icon={Calendar}>Date</Th>
              <Th icon={Clock} align="right">Hours</Th>
              <Th icon={CircleDot}>Status</Th>
              <Th align="right"><span className="sr-only">Review</span></Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={6} />}
            {list.isError && <TableError colSpan={6} error={list.error} onRetry={list.refetch} />}
            {rows.map((w) => {
              const badge = STATUS_BADGE[w.status];
              return (
                <tr key={w.id}>
                  <Td><UserCell name={w.employee?.name ?? "Former employee"} src={w.employee?.photoUrl} size={32} /></Td>
                  <Td><Badge tone="brand">{w.task}</Badge>{w.note && <span className="ml-2.5 text-body">{w.note}</span>}</Td>
                  <Td className="whitespace-nowrap">{shortDate(w.date)}</Td>
                  <Td className="text-right"><Mono>{w.hours.toFixed(2).replace(/0$/, "")}</Mono></Td>
                  <Td><Badge tone={badge.tone}>{badge.label}</Badge></Td>
                  <Td className="whitespace-nowrap px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      {w.status !== "approved" && (
                        <IconButton label={`Approve ${w.employee?.name}'s ${w.task} entry`} disabled={review.isPending} onClick={() => review.mutate({ id: w.id, status: "approved" })}><Check size={17} /></IconButton>
                      )}
                      {w.status !== "rejected" && (
                        <IconButton tone="danger" label={`Reject ${w.employee?.name}'s ${w.task} entry`} disabled={review.isPending} onClick={() => review.mutate({ id: w.id, status: "rejected" })}><X size={17} /></IconButton>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
            {list.isSuccess && rows.length === 0 && (
              <TableEmpty colSpan={6} icon={SearchX} title="No work logged">{filtered ? "Nothing matches these filters." : "Entries show up here as soon as someone logs time."}</TableEmpty>
            )}
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
            noun="entries"
            extra={list.data.total > 0 && <>Total <Mono className="text-fg">{list.data.totalHours.toFixed(1)} h</Mono></>}
          />
        )}
      </Card>
    </>
  );
}

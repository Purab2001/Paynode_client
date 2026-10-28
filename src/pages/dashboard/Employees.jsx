import { useState } from "react";
import { Banknote, Landmark, SearchX, ShieldCheck, User, Users } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { ChipGroup, Field, SearchInput, Toggle } from "@/components/ui/Field";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import { useEmployees, useEmployeeStats, useSetVerification } from "@/features/employees/api";
import { usePayrollRequests, useRequestPay } from "@/features/payroll/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePageState } from "@/hooks/usePagination";
import { MONTHS } from "@/config/constants";
import { money } from "@/lib/format";

const key = (employeeId, p) => `${employeeId}:${p.year}:${p.month}`;
const now = new Date();
const CURRENT = { month: MONTHS[now.getMonth()], year: now.getFullYear() };
const YEARS = [CURRENT.year - 1, CURRENT.year];

export default function Employees() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const q = useDebouncedValue(query.trim());
  const pg = usePageState({ initialSize: 5, resetKey: `${filter}|${q}` });

  const params = { q: q || undefined, verified: filter === "unverified" ? "false" : undefined, page: pg.page, limit: pg.pageSize };
  const list = useEmployees(params);
  const stats = useEmployeeStats();
  const verify = useSetVerification();

  // Requests this HR user has already sent (pending or paid), so the button can say "Requested".
  const sent = usePayrollRequests({ limit: 100 });
  const requested = new Set((sent.data?.items ?? []).filter((r) => r.status !== "rejected").map((r) => key(r.employee.id, r.period)));
  const requestPay = useRequestPay();
  const [paying, setPaying] = useState(null);
  const [period, setPeriod] = useState(CURRENT);

  const submitRequest = () => {
    if (requested.has(key(paying.id, { month: MONTHS.indexOf(period.month) + 1, year: period.year }))) {
      return toast.error(`${paying.name} already has a request for ${period.month} ${period.year}`);
    }
    requestPay.mutate(
      { employeeId: paying.id, year: period.year, month: MONTHS.indexOf(period.month) + 1 },
      { onSuccess: () => setPaying(null) },
    );
  };

  const rows = list.data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Verify new staff and request their monthly pay."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" label="Search employees" />
            <ChipGroup
              label="Filter employees"
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: `All${stats.data ? ` ${stats.data.total}` : ""}` },
                { value: "unverified", label: `Unverified${stats.data ? ` ${stats.data.unverified}` : ""}` },
              ]}
            />
          </div>
        }
      />

      <Card className="overflow-hidden">
        <TableWrap minWidth={780} caption="Employees">
          <thead>
            <tr>
              <Th icon={User}>Employee</Th>
              <Th icon={ShieldCheck}>Verification</Th>
              <Th icon={Landmark}>Bank account</Th>
              <Th icon={Banknote} align="right">Salary</Th>
              <Th align="right"><span className="sr-only">Actions</span></Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={5} />}
            {list.isError && <TableError colSpan={5} error={list.error} onRetry={list.refetch} />}
            {rows.map((e) => (
              <tr key={e.id}>
                <Td><Link to={`/dashboard/employees/${e.id}`} className="block rounded-lg hover:underline" aria-label={`${e.name}, view details`}><UserCell name={e.name} sub={e.designation || e.email} src={e.photoUrl} /></Link></Td>
                <Td>
                  <div className="flex items-center gap-2 text-[13px] font-bold">
                    <Toggle
                      checked={e.isVerified}
                      label={`Verify ${e.name}`}
                      onChange={(isVerified) => verify.mutate({ id: e.id, isVerified })}
                    />
                    <span className={e.isVerified ? "text-ok" : "text-body"}>{e.isVerified ? "Verified" : "Not verified"}</span>
                  </div>
                </Td>
                <Td><span className="font-mono text-sm text-body">{e.bankLast4 ? `•••• ${e.bankLast4}` : "Not added"}</span></Td>
                <Td className="text-right"><Mono>{money(e.salary)}</Mono></Td>
                <Td className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    {requested.has(key(e.id, { month: now.getMonth() + 1, year: now.getFullYear() })) ? (
                      <Badge tone="warn" className="rounded-lg px-3.5 py-2 text-sm">Requested</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!e.isVerified}
                        title={e.isVerified ? undefined : "Verify this employee before requesting pay"}
                        onClick={() => { setPeriod(CURRENT); setPaying(e); }}
                      >
                        Request pay
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
            {list.isSuccess && rows.length === 0 &&
              (q || filter !== "all" ? (
                <TableEmpty colSpan={5} icon={SearchX} title="No employees match">Try a different name, or clear the filter.</TableEmpty>
              ) : (
                <TableEmpty colSpan={5} icon={Users} title="No employees yet">People appear here as soon as they create an account.</TableEmpty>
              ))}
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
            noun="employees"
          />
        )}
      </Card>

      <Modal open={!!paying} onClose={() => setPaying(null)} title="Request pay" description="An admin will review and pay this request.">
        {paying && (
          <>
            <div className="flex items-center gap-3">
              <Avatar name={paying.name} src={paying.photoUrl} size={44} />
              <div className="min-w-0"><p className="font-bold">{paying.name}</p><p className="truncate text-[13px] text-muted">{paying.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Month">
                <Select value={period.month} onChange={(month) => setPeriod({ ...period, month })} options={MONTHS} />
              </Field>
              <Field label="Year">
                <Select value={period.year} onChange={(year) => setPeriod({ ...period, year })} options={YEARS} />
              </Field>
            </div>
            <div className="flex items-baseline justify-between rounded-xl bg-surface p-4">
              <span className="text-sm font-bold">Salary</span>
              <Mono className="text-[22px]">{money(paying.salary, { cents: true })}</Mono>
            </div>
            <p className="text-[13px] text-muted">The amount comes from the employee record. Each person can have one request per month.</p>
            <Button onClick={submitRequest} disabled={requestPay.isPending}>{requestPay.isPending ? "Sending…" : "Send request"}</Button>
          </>
        )}
      </Modal>
    </>
  );
}

import { useState } from "react";
import { BadgeCheck, Banknote, Briefcase, RotateCcw, SearchX, ShieldCheck, TrendingUp, User, UserMinus, UserPlus, UserX, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { ChipGroup, Field, Input, SearchInput, Toggle } from "@/components/ui/Field";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import { useEmployees, useEmployeeStats, useRaiseSalary, useSetRole, useSetStatus, useSetVerification } from "@/features/employees/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePageState } from "@/hooks/usePagination";
import { money } from "@/lib/format";
import toast from "react-hot-toast";

const filters = {
  active: { status: "active" },
  hr: { status: "active", role: "HR" },
  inactive: { status: "inactive" },
};

export default function People() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const q = useDebouncedValue(query.trim());
  const pg = usePageState({ initialSize: 5, resetKey: `${filter}|${q}` });

  const list = useEmployees({ ...filters[filter], q: q || undefined, page: pg.page, limit: pg.pageSize });
  const stats = useEmployeeStats();
  const verify = useSetVerification();
  const setRole = useSetRole();
  const raiseSalary = useRaiseSalary();
  const setStatus = useSetStatus();

  const [salaryFor, setSalaryFor] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const [deactivating, setDeactivating] = useState(null);

  const saveSalary = (e) => {
    e.preventDefault();
    const salary = Number(String(newSalary).replace(/[,\s$]/g, ""));
    if (!(salary > salaryFor.salary)) return toast.error(`Enter an amount above ${money(salaryFor.salary)}`);
    raiseSalary.mutate({ id: salaryFor.id, salary }, { onSuccess: () => setSalaryFor(null) });
  };

  const actionsFor = (p) =>
    !p.isActive
      ? [{ label: "Restore access", icon: RotateCcw, onClick: () => setStatus.mutate({ id: p.id, isActive: true }) }]
      : [
          { label: "Raise salary", icon: TrendingUp, onClick: () => { setSalaryFor(p); setNewSalary(""); } },
          p.role === "Employee"
            ? { label: "Promote to HR", icon: UserPlus, onClick: () => setRole.mutate({ id: p.id, role: "HR" }) }
            : { label: "Change to Employee", icon: UserMinus, onClick: () => setRole.mutate({ id: p.id, role: "Employee" }) },
          "separator",
          { label: "Deactivate account", icon: UserX, tone: "danger", onClick: () => setDeactivating(p) },
        ];

  const rows = list.data?.items ?? [];
  const s = stats.data;

  return (
    <>
      <PageHeader
        title="All employees & HR"
        subtitle="Manage verification, roles, salaries and access."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" label="Search people" />
            <ChipGroup
              label="Filter people"
              value={filter}
              onChange={setFilter}
              items={[
                { value: "active", label: `Active${s ? ` ${s.total}` : ""}` },
                { value: "hr", label: `HR${s ? ` ${s.hr}` : ""}` },
                { value: "inactive", label: "Deactivated" },
              ]}
            />
          </div>
        }
      />
      <Card className="overflow-hidden">
        <TableWrap minWidth={720} caption="Employees and HR">
          <thead>
            <tr>
              <Th icon={User}>Person</Th>
              <Th icon={Briefcase}>Role</Th>
              <Th icon={ShieldCheck}>Verified</Th>
              <Th icon={Banknote} align="right">Salary</Th>
              <Th align="right"><span className="sr-only">Actions</span></Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={5} />}
            {list.isError && <TableError colSpan={5} error={list.error} onRetry={list.refetch} />}
            {rows.map((p) => (
              <tr key={p.id} className={p.isActive ? undefined : "bg-subtle/70"}>
                <Td><UserCell name={p.name} sub={p.email} src={p.photoUrl} /></Td>
                <Td>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={p.role === "HR" ? "brand" : "neutral"}>
                      {p.role === "HR" && <BadgeCheck size={13} className="mr-1" aria-hidden="true" />}
                      {p.role}
                    </Badge>
                    {!p.isActive && <Badge tone="bad">Deactivated</Badge>}
                  </div>
                  {p.designation && <p className="mt-1 text-[13px] text-muted">{p.designation}</p>}
                </Td>
                <Td>
                  <Toggle checked={p.isVerified} label={`Verify ${p.name}`} onChange={(isVerified) => verify.mutate({ id: p.id, isVerified })} />
                </Td>
                <Td className="text-right"><Mono>{money(p.salary)}</Mono></Td>
                <Td className="text-right">
                  <div className="flex justify-end"><DropdownMenu label={`Actions for ${p.name}`} items={actionsFor(p)} /></div>
                </Td>
              </tr>
            ))}
            {list.isSuccess && rows.length === 0 &&
              (q ? (
                <TableEmpty colSpan={5} icon={SearchX} title="No one matches">Try another name or email.</TableEmpty>
              ) : (
                <TableEmpty colSpan={5} icon={Users} title={filter === "inactive" ? "No deactivated accounts" : "No one here yet"}>
                  {filter === "hr" ? "Promote an employee to HR from their actions menu." : "People appear here once they sign up."}
                </TableEmpty>
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
            noun="people"
          />
        )}
      </Card>

      <Modal
        open={!!salaryFor}
        onClose={() => setSalaryFor(null)}
        title="Raise salary"
        description={salaryFor ? `${salaryFor.name} currently earns ${money(salaryFor.salary)} a month.` : undefined}
      >
        {salaryFor && (
          <form onSubmit={saveSalary} className="flex flex-col gap-4">
            <Field label="New monthly salary (USD)" hint="The change is recorded in the audit trail.">
              <Input inputMode="decimal" autoFocus value={newSalary} onChange={(e) => setNewSalary(e.target.value)} placeholder={String(Math.round(salaryFor.salary * 1.05))} className="font-mono" />
            </Field>
            <Button type="submit" disabled={raiseSalary.isPending}>{raiseSalary.isPending ? "Saving…" : "Save salary"}</Button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deactivating}
        onClose={() => setDeactivating(null)}
        onConfirm={() => setStatus.mutate({ id: deactivating.id, isActive: false }, { onSettled: () => setDeactivating(null) })}
        title={`Deactivate ${deactivating?.name ?? ""}?`}
        confirmLabel="Deactivate"
      >
        They'll be signed out and lose access to PayNode immediately. Their records stay, and you can restore access later.
      </ConfirmDialog>
    </>
  );
}

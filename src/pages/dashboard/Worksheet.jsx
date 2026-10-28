import { useState } from "react";
import { Calendar, CircleDot, Clock, FileText, Lock, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import Card, { CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button, { IconButton } from "@/components/ui/Button";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import BarChart from "@/components/charts/BarChart";
import { Field, Input } from "@/components/ui/Field";
import { Mono, Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th } from "@/components/ui/Table";
import { useAddWorksheet, useDeleteWorksheet, useMyWorksheets, useUpdateWorksheet, useWorksheetSummary } from "@/features/worksheets/api";
import { STATUS_BADGE } from "@/features/worksheets/status";
import { usePageState } from "@/hooks/usePagination";
import { TASKS } from "@/config/constants";
import { shortDate, todayLocal } from "@/lib/format";

const blank = () => ({ task: "", note: "", hours: "", date: todayLocal() });

const validate = (v) => {
  if (!v.task) return "Choose a task";
  const h = Number(v.hours);
  if (!(h >= 0.25 && h <= 24)) return "Hours must be between 0.25 and 24";
  if (!v.date) return "Pick a date";
  if (v.date > todayLocal()) return "You can't log time for a future date";
  return null;
};

const payload = (v) => ({ task: v.task, note: v.note.trim(), hours: Number(v.hours), date: v.date });

/** Task, note, hours and date controls shared by the add form and the edit dialog. */
function EntryFields({ values, onChange, compact }) {
  const set = (key) => (e) => onChange({ ...values, [key]: e?.target ? e.target.value : e });
  return (
    <>
      <Field label="Task">
        <Select value={values.task} onChange={set("task")} options={TASKS} placeholder="Choose a task" />
      </Field>
      <Field label="Note" optional>
        <Input value={values.note} onChange={set("note")} placeholder="Fixed invoice export bug" maxLength={200} />
      </Field>
      <div className={compact ? "contents" : "grid grid-cols-2 gap-3"}>
        <Field label="Hours">
          <Input type="number" inputMode="decimal" min="0.25" max="24" step="0.25" value={values.hours} onChange={set("hours")} placeholder="7.5" className="font-mono" />
        </Field>
        <Field label="Date">
          <Input type="date" max={todayLocal()} value={values.date} onChange={set("date")} />
        </Field>
      </div>
    </>
  );
}

export default function Worksheet() {
  const pg = usePageState({ initialSize: 5 });
  const list = useMyWorksheets({ page: pg.page, limit: pg.pageSize });
  const summary = useWorksheetSummary();
  const add = useAddWorksheet();
  const update = useUpdateWorksheet();
  const remove = useDeleteWorksheet();

  const [draft, setDraft] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);

  const rows = list.data?.items ?? [];
  const today = todayLocal();
  const week = (summary.data?.week ?? []).map((d) => ({
    label: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
    value: d.date > today ? null : d.hours, // days that haven't happened yet are gaps, not zeros
  }));

  const submit = (e) => {
    e.preventDefault();
    const error = validate(draft);
    if (error) return toast.error(error);
    add.mutate(payload(draft), { onSuccess: () => setDraft({ ...blank(), task: draft.task }) });
  };

  const save = (e) => {
    e.preventDefault();
    const error = validate(editing);
    if (error) return toast.error(error);
    update.mutate({ id: editing.id, ...payload(editing) }, { onSuccess: () => setEditing(null) });
  };

  const confirmRemove = () => remove.mutate(removing.id, { onSuccess: () => setRemoving(null) });

  return (
    <>
      <PageHeader title="Work sheet" subtitle="Log what you worked on. HR reviews each entry, and approved entries are locked." />

      <Card as="form" onSubmit={submit} aria-label="Add work entry" className="flex flex-wrap items-end gap-3.5 p-5">
        <div className="grid min-w-0 flex-[1_1_100%] grid-cols-1 gap-3.5 sm:grid-cols-2 xl:flex-1 xl:grid-cols-[1.6fr_2.4fr_0.9fr_1.3fr]">
          <EntryFields values={draft} onChange={setDraft} compact />
        </div>
        <Button type="submit" disabled={add.isPending}><Plus size={18} aria-hidden="true" /> {add.isPending ? "Adding…" : "Add entry"}</Button>
      </Card>

      <div className="flex flex-wrap items-start gap-5">
        <Card className="min-w-0 flex-[999_1_520px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-divider px-5 py-4">
            <h2 className="text-[17px] font-extrabold">Entries</h2>
            <span className="text-sm text-muted">Newest first</span>
          </div>
          <TableWrap minWidth={640} caption="Your work entries">
            <thead>
              <tr>
                <Th icon={Calendar}>Date</Th>
                <Th icon={Tag}>Task</Th>
                <Th icon={CircleDot}>Status</Th>
                <Th icon={Clock} align="right">Hours</Th>
                <Th align="right"><span className="sr-only">Actions</span></Th>
              </tr>
            </thead>
            <tbody aria-busy={list.isFetching}>
              {list.isPending && <TableLoading colSpan={5} />}
              {list.isError && <TableError colSpan={5} error={list.error} onRetry={list.refetch} />}
              {rows.map((e) => {
                const status = STATUS_BADGE[e.status];
                return (
                  <tr key={e.id}>
                    <Td className="whitespace-nowrap">{shortDate(e.date)}</Td>
                    <Td><Badge tone="brand">{e.task}</Badge>{e.note && <span className="ml-2.5 text-body">{e.note}</span>}</Td>
                    <Td><Badge tone={status.tone}>{status.label}</Badge></Td>
                    <Td className="text-right"><Mono>{e.hours.toFixed(2).replace(/0$/, "")}</Mono></Td>
                    <Td className="whitespace-nowrap px-3 py-2 text-right">
                      {e.status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 text-[13px] font-semibold text-muted"><Lock size={14} aria-hidden="true" /> Locked</span>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <IconButton label={`Edit ${e.task} entry on ${shortDate(e.date)}`} onClick={() => setEditing({ ...e, hours: String(e.hours) })}><Pencil size={17} /></IconButton>
                          <IconButton tone="danger" label={`Delete ${e.task} entry on ${shortDate(e.date)}`} onClick={() => setRemoving(e)}><Trash2 size={17} /></IconButton>
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
              {list.isSuccess && rows.length === 0 && <TableEmpty colSpan={5} icon={FileText} title="No entries yet">Add your first entry using the form above.</TableEmpty>}
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

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <Card className="flex flex-col gap-4 p-5">
            <CardHeader title="Hours this week" action={<Mono className="text-[22px]">{(summary.data?.weekHours ?? 0).toFixed(1)}</Mono>} />
            <BarChart data={week.length ? week : [{ label: "Mon", value: null }, { label: "Tue", value: null }, { label: "Wed", value: null }, { label: "Thu", value: null }, { label: "Fri", value: null }]} height={140} showValues={false} />
          </Card>
          <Card className="grid grid-cols-2 gap-4 p-5">
            <div><p className="text-[13px] font-semibold text-muted">This month</p><Mono className="mt-1 block text-[22px]">{(summary.data?.monthHours ?? 0).toFixed(1)} h</Mono></div>
            <div><p className="text-[13px] font-semibold text-muted">Entries</p><Mono className="mt-1 block text-[22px]">{summary.data?.monthEntries ?? 0}</Mono></div>
          </Card>
        </aside>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit entry">
        {editing && (
          <form onSubmit={save} className="flex flex-col gap-4">
            <EntryFields values={editing} onChange={setEditing} />
            {editing.status === "rejected" && <p className="text-[13px] text-muted">Saving sends this entry back to HR for review.</p>}
            <Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save changes"}</Button>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!removing} onClose={() => setRemoving(null)} onConfirm={confirmRemove} title="Delete this entry?" confirmLabel="Delete entry">
        This removes the {removing?.task} entry for {removing && shortDate(removing.date)}. You can't undo this.
      </ConfirmDialog>
    </>
  );
}

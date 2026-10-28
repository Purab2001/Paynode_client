import { useState } from "react";
import { Archive, Calendar, FileText, Inbox as InboxIcon, Mail, MailOpen, MessageSquare, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Field";
import { Pagination, TableEmpty, TableError, TableLoading, TableWrap, Td, Th, UserCell } from "@/components/ui/Table";
import { useInbox, useSetMessageStatus } from "@/features/contact/api";
import { usePageState } from "@/hooks/usePagination";
import { timeAgo } from "@/lib/format";

const TOPIC_LABEL = { sales: "Sales", support: "Support", billing: "Billing", other: "Other" };
const EMPTY = {
  new: ["No new messages", "Messages from the contact form will appear here."],
  read: ["Nothing read yet", "Messages you've opened will be listed here."],
  archived: ["Nothing archived", "Archived messages will be listed here."],
};

export default function Inbox() {
  const [tab, setTab] = useState("new");
  const [open, setOpen] = useState(null);
  const pg = usePageState({ initialSize: 10, resetKey: tab });
  const list = useInbox({ status: tab, page: pg.page, limit: pg.pageSize });
  const setStatus = useSetMessageStatus();
  const rows = list.data?.items ?? [];

  const openMessage = (m) => {
    setOpen(m);
    if (m.status === "new") setStatus.mutate({ id: m.id, status: "read" });
  };
  const move = (status) => setStatus.mutate({ id: open.id, status }, { onSuccess: () => setOpen(null) });

  return (
    <>
      <PageHeader
        title="Inbox"
        subtitle="Messages from the contact form on the public site."
        actions={
          <Tabs
            label="Message status"
            value={tab}
            onChange={setTab}
            items={[
              { value: "new", label: `New · ${list.data?.unread ?? 0}` },
              { value: "read", label: "Read" },
              { value: "archived", label: "Archived" },
            ]}
          />
        }
      />

      <Card className="overflow-hidden">
        <TableWrap minWidth={760} caption={`${tab} messages`}>
          <thead>
            <tr>
              <Th icon={User}>From</Th>
              <Th icon={MessageSquare}>Topic</Th>
              <Th icon={FileText}>Message</Th>
              <Th icon={Calendar} align="right">Received</Th>
            </tr>
          </thead>
          <tbody aria-busy={list.isFetching}>
            {list.isPending && <TableLoading colSpan={4} />}
            {list.isError && <TableError colSpan={4} error={list.error} onRetry={list.refetch} />}
            {rows.map((m) => (
              <tr key={m.id} className="cursor-pointer transition-colors hover:bg-subtle" onClick={() => openMessage(m)}>
                <Td>
                  <button type="button" className="block w-full text-left" onClick={(e) => { e.stopPropagation(); openMessage(m); }} aria-label={`Open message from ${m.name}`}>
                    <UserCell name={m.name} sub={m.company || m.email} />
                  </button>
                </Td>
                <Td><Badge tone="brand">{TOPIC_LABEL[m.topic]}</Badge></Td>
                <Td><p className={`max-w-md truncate ${m.status === "new" ? "font-bold" : "text-body"}`}>{m.message}</p></Td>
                <Td className="whitespace-nowrap text-right text-sm text-muted">{timeAgo(m.createdAt)}</Td>
              </tr>
            ))}
            {list.isSuccess && rows.length === 0 && <TableEmpty colSpan={4} icon={InboxIcon} title={EMPTY[tab][0]}>{EMPTY[tab][1]}</TableEmpty>}
          </tbody>
        </TableWrap>
        {list.data && (
          <Pagination page={list.data.page} pages={list.data.pages} total={list.data.total} pageSize={pg.pageSize} onPage={pg.setPage} onPageSize={pg.setPageSize} noun="messages" />
        )}
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `Message from ${open.name}` : ""}>
        {open && (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-xl bg-surface p-4 text-sm">
              <dt className="text-muted">Email</dt><dd className="min-w-0 truncate font-bold"><a className="text-brand-dark hover:underline" href={`mailto:${open.email}`}>{open.email}</a></dd>
              {open.company && <><dt className="text-muted">Company</dt><dd className="font-bold">{open.company}</dd></>}
              {open.size && <><dt className="text-muted">Team size</dt><dd className="font-bold">{open.size}</dd></>}
              <dt className="text-muted">Topic</dt><dd className="font-bold">{TOPIC_LABEL[open.topic]}</dd>
              <dt className="text-muted">Received</dt><dd className="font-bold">{new Date(open.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</dd>
            </dl>
            <p className="whitespace-pre-wrap leading-relaxed text-body">{open.message}</p>
            <div className="flex flex-wrap justify-end gap-2">
              {open.status !== "archived" ? (
                <Button variant="secondary" onClick={() => move("archived")} disabled={setStatus.isPending}><Archive size={16} aria-hidden="true" /> Archive</Button>
              ) : (
                <Button variant="secondary" onClick={() => move("new")} disabled={setStatus.isPending}><MailOpen size={16} aria-hidden="true" /> Restore</Button>
              )}
              <Button href={`mailto:${open.email}?subject=${encodeURIComponent("Re: your message to PayNode")}`}><Mail size={16} aria-hidden="true" /> Reply by email</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

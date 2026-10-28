import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Hash, Lock, MessageSquare, RotateCw, Send, Trash2, WifiOff } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button, { IconButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Field";
import PresenceDot from "@/components/chat/PresenceDot";
import { cn } from "@/lib/cn";

const sameDay = (a, b) => a.toDateString() === b.toDateString();
const stamp = (iso) => {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return sameDay(d, new Date()) ? time : `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
};

function Header({ channel, online, onBack }) {
  const isDm = channel.type === "dm";
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
      <IconButton label="Back to conversations" onClick={onBack} className="-ml-2 md:hidden"><ArrowLeft size={18} /></IconButton>
      {isDm ? (
        <>
          <span className="relative flex-none">
            <Avatar name={channel.name} src={channel.partner?.photoUrl} size={36} />
            <PresenceDot online={online} className="absolute -bottom-0.5 -right-0.5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-extrabold">{channel.name}</h2>
            <p className="text-sm text-muted">{online ? "Online now" : "Offline"}{channel.partner?.role && channel.partner.role !== "Employee" ? ` · ${channel.partner.role === "admin" ? "Admin" : channel.partner.role}` : ""}</p>
          </div>
        </>
      ) : (
        <>
          <span className="grid size-9 flex-none place-items-center rounded-xl bg-brand-soft text-brand-dark">
            {channel.id === "staff" ? <Lock size={17} aria-hidden="true" /> : <Hash size={17} aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-extrabold">{channel.name}</h2>
            <p className="truncate text-sm text-muted">{channel.description}</p>
          </div>
        </>
      )}
    </div>
  );
}

function Bubble({ message, own, showSender, onRetry, onDiscard, onDelete, canModerate }) {
  const failed = message.status === "failed";
  const sending = message.status === "sending";
  const deletable = !message.status && !message.deleted && (own || canModerate);

  return (
    <li className={cn("group flex items-end gap-2.5", own && "flex-row-reverse")}>
      {!own && <Avatar name={message.sender.name} src={message.sender.photoUrl} size={30} />}
      <div className={cn("flex max-w-[78%] flex-col gap-1", own && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            own ? "rounded-br-sm bg-brand text-white" : "rounded-bl-sm bg-surface",
            message.deleted && "bg-transparent text-muted ring-1 ring-line",
            failed && "bg-bad-soft text-bad ring-1 ring-bad/30",
            sending && "opacity-70",
          )}
        >
          {!own && showSender && (
            <p className="mb-0.5 flex items-center gap-1.5 text-xs font-bold text-body">
              {message.sender.name}
              {message.sender.role && message.sender.role !== "Employee" && <Badge tone="brand" className="px-1.5 py-0 text-[11px]">{message.sender.role === "admin" ? "Admin" : message.sender.role}</Badge>}
            </p>
          )}
          {message.deleted ? (
            <p className="text-sm italic">This message was deleted</p>
          ) : (
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{message.text}</p>
          )}
        </div>
        <div className={cn("flex items-center gap-2 text-[11px] text-muted", own && "flex-row-reverse")}>
          {failed ? (
            <>
              <span className="font-semibold text-bad">Not sent</span>
              <button type="button" onClick={() => onRetry(message)} className="inline-flex cursor-pointer items-center gap-1 font-bold text-brand-dark hover:underline"><RotateCw size={11} aria-hidden="true" /> Retry</button>
              <button type="button" onClick={() => onDiscard(message)} className="cursor-pointer font-bold hover:underline">Discard</button>
            </>
          ) : (
            <time dateTime={message.createdAt}>{sending ? "Sending…" : stamp(message.createdAt)}</time>
          )}
          {deletable && (
            <IconButton label="Delete message" tone="danger" onClick={() => onDelete(message)} className="size-7 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100">
              <Trash2 size={13} />
            </IconButton>
          )}
        </div>
      </div>
    </li>
  );
}

/** One conversation: history, the live message list and the composer. */
export default function ChatThread({ channel, thread, selfId, selfRole, status, online, typing, onBack, onSend, onRetry, onDiscard, onDelete, onLoadOlder, onTyping, className }) {
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(null);
  const listRef = useRef(null);
  const pinned = useRef(true); // keep the newest message in view unless the reader has scrolled up
  const anchor = useRef(null); // scroll height before older messages were added, to hold the reader's place

  const items = thread?.items ?? [];
  const count = items.length;
  const firstId = items[0]?.id;

  useLayoutEffect(() => {
    pinned.current = true;
  }, [channel.id]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (anchor.current !== null) {
      el.scrollTop += el.scrollHeight - anchor.current; // older messages were prepended
      anchor.current = null;
    } else if (pinned.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [count, firstId, channel.id, thread?.loaded]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const loadOlder = () => {
    anchor.current = listRef.current?.scrollHeight ?? null;
    onLoadOlder();
  };

  const submit = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    pinned.current = true;
    setText("");
    onSend(body);
  };

  const connected = status === "online";

  return (
    <section aria-label={`Conversation: ${channel.name}`} className={cn("flex min-h-0 min-w-0 flex-col", className)}>
      <Header channel={channel} online={online} onBack={onBack} />

      {!connected && (
        <p role="status" className="flex items-center gap-2 bg-warn-soft px-5 py-2 text-sm font-semibold text-warn">
          <WifiOff size={15} aria-hidden="true" /> {status === "connecting" ? "Connecting…" : "Reconnecting. Messages will send when you're back online."}
        </p>
      )}

      <div ref={listRef} onScroll={onScroll} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {thread?.hasMore && (
          <Button variant="secondary" size="sm" onClick={loadOlder} disabled={thread.loadingOlder} className="self-center">
            {thread.loadingOlder ? "Loading…" : "Load earlier messages"}
          </Button>
        )}
        {!thread?.loaded && <p className="py-10 text-center text-sm text-muted" aria-live="polite">Loading messages…</p>}
        {thread?.loaded && count === 0 && (
          <div className="m-auto flex flex-col items-center gap-2 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-surface text-muted"><MessageSquare size={22} aria-hidden="true" /></span>
            <p className="font-bold">No messages yet</p>
            <p className="max-w-xs text-sm text-muted">{channel.type === "dm" ? `Say hello to ${channel.name}.` : "Be the first to post here."}</p>
          </div>
        )}
        <ol className="flex flex-col gap-3" aria-live="polite">
          {items.map((m, i) => (
            <Bubble
              key={m.id}
              message={m}
              own={m.sender.id === selfId}
              showSender={channel.type !== "dm" && items[i - 1]?.sender.id !== m.sender.id}
              canModerate={selfRole === "admin" && channel.type !== "dm"}
              onRetry={onRetry}
              onDiscard={onDiscard}
              onDelete={setDeleting}
            />
          ))}
        </ol>
      </div>

      <div className="h-6 px-5 text-[13px] text-muted" aria-live="polite">
        {typing.length > 0 && <span>{typing.length === 1 ? `${typing[0]} is typing…` : `${typing.slice(0, 2).join(" and ")}${typing.length > 2 ? " and others" : ""} are typing…`}</span>}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-line p-4">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value) onTyping();
          }}
          placeholder={channel.type === "dm" ? `Message ${channel.name}` : `Message #${channel.name.toLowerCase()}`}
          aria-label="Message"
          maxLength={2000}
          autoComplete="off"
        />
        <button type="submit" aria-label="Send message" disabled={!text.trim()} className="grid size-12 flex-none cursor-pointer place-items-center rounded-[10px] bg-brand text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-line-strong">
          <Send size={18} />
        </button>
      </form>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          onDelete(deleting);
          setDeleting(null);
        }}
        title="Delete this message?"
        confirmLabel="Delete message"
      >
        Everyone in this conversation will see that it was deleted. You can't undo this.
      </ConfirmDialog>
    </section>
  );
}

import { Hash, Lock, PenSquare } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import PresenceDot from "@/components/chat/PresenceDot";
import { cn } from "@/lib/cn";

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span aria-label={`${count} unread`} className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-extrabold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function Row({ active, onClick, children, label }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        aria-label={label}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[15px] font-semibold transition-colors",
          active ? "bg-brand-soft text-brand-dark" : "text-body hover:bg-surface hover:text-fg",
        )}
      >
        {children}
      </button>
    </li>
  );
}

/** Channels and private conversations, with unread counts and who is online. */
export default function ChatSidebar({ state, onOpen, onNewMessage, className }) {
  const channels = state.channels.filter((c) => c.type === "channel");
  const dms = state.channels.filter((c) => c.type === "dm");

  return (
    <nav aria-label="Conversations" className={cn("flex min-h-0 flex-col gap-5 overflow-y-auto border-line p-3 md:border-r", className)}>
      <div>
        <h2 className="px-3 pb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Channels</h2>
        <ul className="flex flex-col gap-0.5">
          {channels.map((c) => (
            <Row key={c.id} active={state.active === c.id} onClick={() => onOpen(c.id)} label={`${c.name} channel`}>
              {c.id === "staff" ? <Lock size={17} aria-hidden="true" className="flex-none" /> : <Hash size={17} aria-hidden="true" className="flex-none" />}
              <span className="truncate">{c.name}</span>
              <UnreadBadge count={state.unread[c.id]} />
            </Row>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between pb-1.5 pl-3 pr-1">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">Direct messages</h2>
          <button
            type="button"
            onClick={onNewMessage}
            aria-label="New message"
            title="New message"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-body hover:bg-surface hover:text-fg"
          >
            <PenSquare size={16} />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5">
          {dms.map((c) => (
            <Row key={c.id} active={state.active === c.id} onClick={() => onOpen(c.id)} label={`Chat with ${c.name}`}>
              <span className="relative flex-none">
                <Avatar name={c.name} src={c.partner?.photoUrl} size={28} />
                <PresenceDot online={!!state.online[c.partner?.id]} className="absolute -bottom-0.5 -right-0.5" />
              </span>
              <span className="truncate">{c.name}</span>
              <UnreadBadge count={state.unread[c.id]} />
            </Row>
          ))}
          {dms.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted">
              No private chats yet.{" "}
              <button type="button" onClick={onNewMessage} className="cursor-pointer font-bold text-brand-dark hover:underline">Start one</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

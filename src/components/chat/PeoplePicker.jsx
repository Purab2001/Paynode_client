import { useState } from "react";
import { SearchX } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/Field";
import PresenceDot from "@/components/chat/PresenceDot";

/** Pick someone to start a private conversation with. Employees only see HR and admins. */
export default function PeoplePicker({ open, onClose, people, online, onPick }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q ? people.filter((p) => p.name.toLowerCase().includes(q)) : people;
  // People who are around come first, then alphabetical.
  const sorted = [...matches].sort((a, b) => Number(!!online[b.id]) - Number(!!online[a.id]) || a.name.localeCompare(b.name));

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="New message" description="Choose who you'd like to talk to.">
      <SearchInput value={query} onChange={setQuery} placeholder="Search by name" label="Search people" className="w-full" />
      <ul className="-mx-2 flex max-h-72 flex-col gap-0.5 overflow-y-auto">
        {sorted.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onPick(p);
              }}
              className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-surface"
            >
              <span className="relative flex-none">
                <Avatar name={p.name} src={p.photoUrl} size={36} />
                <PresenceDot online={!!online[p.id]} className="absolute -bottom-0.5 -right-0.5" />
              </span>
              <span className="min-w-0 flex-1 truncate font-bold">{p.name}</span>
              <Badge tone={p.role === "Employee" ? "neutral" : "brand"}>{p.role === "admin" ? "Admin" : p.role}</Badge>
            </button>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted">
            <SearchX size={20} aria-hidden="true" />
            {q ? "No one matches that name." : "There's no one else to message yet."}
          </li>
        )}
      </ul>
    </Modal>
  );
}

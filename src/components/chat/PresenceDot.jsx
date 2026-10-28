import { cn } from "@/lib/cn";

/** Green when the person has chat open right now, grey otherwise. */
export default function PresenceDot({ online, className }) {
  return (
    <span
      role="img"
      aria-label={online ? "Online" : "Offline"}
      className={cn("inline-block size-2.5 flex-none rounded-full border-2 border-card", online ? "bg-green-500" : "bg-line-strong", className)}
    />
  );
}

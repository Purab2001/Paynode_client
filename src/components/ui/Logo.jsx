import { Link } from "react-router";
import { cn } from "@/lib/cn";

export default function Logo({ to = "/", className, textClassName, size = 36 }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2.5", className)}>
      <img src="/logo.png" alt="" width={size} height={size} />
      <span className={cn("text-xl font-extrabold tracking-tight text-fg", textClassName)}>PayNode</span>
    </Link>
  );
}

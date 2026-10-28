import { Link } from "react-router";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-brand text-white hover:bg-[#1d4ed8]",
  dark: "bg-fg text-card hover:bg-fg/90",
  secondary: "border border-line-strong bg-card text-fg hover:bg-surface",
  ghost: "text-body hover:bg-surface hover:text-fg",
  danger: "text-bad hover:bg-bad-soft",
  destructive: "bg-bad text-white hover:bg-red-800",
  light: "bg-white text-[#1d4ed8] hover:bg-[#eaf1ff]",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm rounded-lg",
  md: "px-5 py-3 text-[15px] rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
};

export default function Button({ to, href, variant = "primary", size = "md", className, children, ...props }) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-bold transition-colors disabled:cursor-not-allowed disabled:border disabled:border-line disabled:bg-surface disabled:text-muted",
    variants[variant],
    sizes[size],
    className,
  );
  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }
  return <button type="button" className={classes} {...props}>{children}</button>;
}

/** Square icon-only button. Always pass a `label` for screen readers. */
export function IconButton({ label, tone = "default", className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 flex-none cursor-pointer place-items-center rounded-lg transition-colors",
        tone === "danger" ? "text-bad hover:bg-bad-soft" : "text-body hover:bg-surface hover:text-fg",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

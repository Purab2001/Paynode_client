import { cn } from "@/lib/cn";

export default function Card({ as: Tag = "section", className, children, ...props }) {
  return (
    <Tag className={cn("rounded-2xl border border-line bg-card", className)} {...props}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, action, subtitle }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[17px] font-extrabold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** A card whose body is a table: optional header row on top, table flush to the edges. */
export function TableCard({ title, subtitle, action, className, children }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 pb-4 pt-5">
          <div>
            {title && <h2 className="text-[17px] font-extrabold">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}

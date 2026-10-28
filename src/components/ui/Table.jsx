import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { PAGE_SIZES, pageWindow } from "@/hooks/usePagination";
import { cn } from "@/lib/cn";

/** Copy each column header onto its cells as data-label, so rows can stack into cards on phones. */
function labelCells(table) {
  const labels = [...table.querySelectorAll("thead th")].map((th) => (th.querySelector(".sr-only") ? "" : th.textContent.trim()));
  for (const row of table.querySelectorAll("tbody tr")) {
    let col = 0;
    for (const cell of row.children) {
      if (cell.colSpan > 1) break;
      // The first cell is the row's title (a person, a period), so it needs no label.
      if (col > 0 && labels[col]) cell.dataset.label = labels[col];
      else delete cell.dataset.label;
      col += 1;
    }
  }
}

/**
 * Scrolls sideways on tablets and up. Below 640px each row becomes a stacked card
 * (see .stack-table in index.css); `minWidth` only applies above that.
 */
export function TableWrap({ children, minWidth = 640, caption }) {
  const ref = useRef(null);
  useEffect(() => {
    const table = ref.current;
    if (!table) return undefined;
    labelCells(table);
    const observer = new MutationObserver(() => labelCells(table));
    observer.observe(table, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stack-table relative overflow-x-auto">
      <table ref={ref} className="w-full border-collapse text-[15px] sm:min-w-(--table-min)" style={{ "--table-min": `${minWidth}px` }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

/** Header cell with an optional leading icon. */
export function Th({ icon: Icon, align = "left", className, children, ...props }) {
  return (
    <th scope="col" className={cn("bg-subtle px-4 py-3.5 text-[13px] font-bold text-muted", align === "right" ? "text-right" : "text-left", className)} {...props}>
      <span className="inline-flex items-center gap-1.5">
        {Icon && <Icon size={14} aria-hidden="true" className="text-faint" />}
        {children}
      </span>
    </th>
  );
}

export const Td = ({ className, children, ...props }) => (
  <td className={cn("border-t border-divider px-4 py-3.5", className)} {...props}>
    {children}
  </td>
);

export const Mono = ({ className, children }) => <span className={cn("font-mono font-semibold", className)}>{children}</span>;

/** Avatar + name + secondary line. */
export function UserCell({ name, sub, src, size = 34 }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={name} src={src} size={size} />
      <div className="min-w-0">
        <p className="truncate font-bold">{name}</p>
        {sub && <p className="truncate text-[13px] text-muted">{sub}</p>}
      </div>
    </div>
  );
}

/** Full-width empty row with icon + message. */
export function TableEmpty({ colSpan, icon: Icon, title, children }) {
  return (
    <tr>
      <Td colSpan={colSpan} className="py-12">
        <div className="flex flex-col items-center gap-2 text-center">
          {Icon && (
            <span className="grid size-11 place-items-center rounded-full bg-surface text-muted">
              <Icon size={20} aria-hidden="true" />
            </span>
          )}
          <p className="font-bold">{title}</p>
          {children && <p className="text-sm text-muted">{children}</p>}
        </div>
      </Td>
    </tr>
  );
}

/** Placeholder rows while data loads. */
export function TableLoading({ colSpan, rows = 4 }) {
  return Array.from({ length: rows }, (_, i) => (
    <tr key={i} aria-hidden="true">
      <Td colSpan={colSpan}>
        <div className="flex animate-pulse items-center gap-3">
          <span className="size-[34px] rounded-full bg-line" />
          <span className="h-3.5 w-40 rounded bg-line" />
          <span className="ml-auto h-3.5 w-20 rounded bg-line" />
        </div>
      </Td>
    </tr>
  ));
}

/** Error row with a retry button. */
export function TableError({ colSpan, error, onRetry }) {
  return (
    <tr>
      <Td colSpan={colSpan} className="py-12">
        <div role="alert" className="flex flex-col items-center gap-3 text-center">
          <p className="font-bold">We couldn't load this list</p>
          <p className="max-w-md text-sm text-muted">{error?.message}</p>
          <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>
        </div>
      </Td>
    </tr>
  );
}

/** Footer bar under a table: summary on the left, actions on the right. */
export function TableFooter({ children, className }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-divider bg-subtle px-5 py-3.5 text-sm text-muted", className)}>
      {children}
    </div>
  );
}

/**
 * Table pager: summary on the left; rows-per-page, previous/next and numbered pages on the right.
 * Works for server-side pages (pass the server's total) and in-memory lists alike.
 * Pass  to show the rows-per-page selector.  adds text after the summary.
 */
export function Pagination({ page, pages, total, pageSize, onPage, onPageSize, noun = "results", extra, sizes = PAGE_SIZES }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const numbers = pageWindow(page, pages);

  return (
    <TableFooter className="gap-y-3">
      <p>
        {total === 0 ? `No ${noun}` : <>Showing <b className="font-bold text-fg">{from}–{to}</b> of <b className="font-bold text-fg">{total}</b> {noun}</>}
        {extra && <span className="ml-3 border-l border-line-strong pl-3">{extra}</span>}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {onPageSize && (
          <label className="flex items-center gap-2 text-[13px] font-semibold">
            Rows
            <span className="w-20">
              <Select aria-label="Rows per page" value={pageSize} onChange={onPageSize} options={sizes} anchor="top start" className="py-1.5 pl-3 text-sm" />
            </span>
          </label>
        )}
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className={pagerButton}>
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <span className="px-2 text-[13px] font-semibold sm:hidden">Page {page} of {pages}</span>
          <ol className="hidden items-center gap-1 sm:flex">
            {numbers.map((n, i) =>
              n === "…" ? (
                <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-faint">…</li>
              ) : (
                <li key={n}>
                  <button
                    type="button"
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? "page" : undefined}
                    onClick={() => onPage(n)}
                    className={cn(pagerButton, "px-2 font-mono", n === page && "border-brand bg-brand text-white hover:bg-brand")}
                  >
                    {n}
                  </button>
                </li>
              ),
            )}
          </ol>
          <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} className={pagerButton}>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </TableFooter>
  );
}

const pagerButton =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border border-line-strong bg-card text-sm font-bold text-body transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card";

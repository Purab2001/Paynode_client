import { useState } from "react";

export const PAGE_SIZES = [5, 10, 25];

/**
 * Page and page-size state. Returns to page 1 when `resetKey` changes (a new search or filter)
 * or when the page size changes. Use directly with server-side pagination.
 */
export function usePageState({ initialSize = 5, resetKey = "" } = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialSize);
  const [lastKey, setLastKey] = useState(resetKey);

  if (resetKey !== lastKey) {
    setLastKey(resetKey);
    setPage(1);
  }

  const setPageSize = (size) => {
    setPageSizeState(size);
    setPage(1);
  };
  return { page, setPage, pageSize, setPageSize };
}

/** Client-side pagination for a list that is already in memory. */
export function usePagination(items, options) {
  const state = usePageState(options);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pages); // a shrinking list never strands you on an empty page
  const start = (page - 1) * state.pageSize;
  return { ...state, page, pages, total, rows: items.slice(start, start + state.pageSize) };
}

/** Page numbers to show, with gaps, never more than `max` slots: [1, "…", 9, 10, 11, "…", 20]. */
export function pageWindow(page, pages, max = 7) {
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (pages <= max) return range(1, pages);

  const edge = max - 2; // numbers shown beside the first or last page, e.g. 1 2 3 4 5 … 20
  if (page <= edge - 1) return [...range(1, edge), "…", pages];
  if (page >= pages - (edge - 2)) return [1, "…", ...range(pages - edge + 1, pages)];
  return [1, "…", page - 1, page, page + 1, "…", pages];
}

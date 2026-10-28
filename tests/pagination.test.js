import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { pageWindow, usePagination } from "@/hooks/usePagination";

describe("pageWindow", () => {
  it("lists every page when there are few", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the far end near the start", () => {
    expect(pageWindow(1, 20)).toEqual([1, 2, 3, 4, 5, "…", 20]);
  });

  it("collapses both sides in the middle", () => {
    expect(pageWindow(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
  });

  it("collapses the near end near the finish", () => {
    expect(pageWindow(20, 20)).toEqual([1, "…", 16, 17, 18, 19, 20]);
  });

  it("always includes the first, last and current page", () => {
    for (let page = 1; page <= 30; page++) {
      const w = pageWindow(page, 30);
      expect(w).toContain(1);
      expect(w).toContain(30);
      expect(w).toContain(page);
    }
  });
});

const items = Array.from({ length: 23 }, (_, i) => i + 1);

describe("usePagination", () => {
  it("slices the list and reports totals", () => {
    const { result } = renderHook(() => usePagination(items, { initialSize: 10 }));
    expect(result.current.rows).toEqual(items.slice(0, 10));
    expect(result.current).toMatchObject({ page: 1, pages: 3, total: 23, pageSize: 10 });
  });

  it("moves between pages, including the short last page", () => {
    const { result } = renderHook(() => usePagination(items, { initialSize: 10 }));
    act(() => result.current.setPage(3));
    expect(result.current.rows).toEqual([21, 22, 23]);
  });

  it("returns to page 1 when the page size changes", () => {
    const { result } = renderHook(() => usePagination(items, { initialSize: 5 }));
    act(() => result.current.setPage(4));
    act(() => result.current.setPageSize(25));
    expect(result.current).toMatchObject({ page: 1, pages: 1, pageSize: 25 });
    expect(result.current.rows).toHaveLength(23);
  });

  it("returns to page 1 when the reset key changes (a new filter)", () => {
    const { result, rerender } = renderHook(({ key }) => usePagination(items, { initialSize: 5, resetKey: key }), { initialProps: { key: "a" } });
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    rerender({ key: "b" });
    expect(result.current.page).toBe(1);
  });

  it("never strands you past the end when the list shrinks", () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list, { initialSize: 5 }), { initialProps: { list: items } });
    act(() => result.current.setPage(5));
    rerender({ list: items.slice(0, 6) });
    expect(result.current.page).toBe(2);
    expect(result.current.rows).toEqual([6]);
  });

  it("handles an empty list", () => {
    const { result } = renderHook(() => usePagination([], { initialSize: 5 }));
    expect(result.current).toMatchObject({ page: 1, pages: 1, total: 0, rows: [] });
  });
});

import { describe, expect, it } from "vitest";
import { nav, pageMeta } from "@/config/site";

describe("public page metadata", () => {
  it("covers the home page and every nav page", () => {
    for (const path of ["/", ...nav.map((l) => l.to)]) expect(pageMeta[path], path).toBeDefined();
  });

  it("keeps titles and descriptions within search-result limits and unique", () => {
    const entries = Object.values(pageMeta);
    for (const { title, description } of entries) {
      expect(title.length).toBeLessThanOrEqual(75);
      expect(description.length).toBeGreaterThanOrEqual(70);
      expect(description.length).toBeLessThanOrEqual(160);
    }
    expect(new Set(entries.map((e) => e.title)).size).toBe(entries.length);
  });
});

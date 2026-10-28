import { beforeEach, describe, expect, it } from "vitest";
import { THEME_KEY, applyTheme, readStoredTheme, resolveTheme, storeTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("honours an explicit choice regardless of the OS", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the OS when set to system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("falls back to the OS for unknown values", () => {
    expect(resolveTheme("sepia", true)).toBe("dark");
    expect(resolveTheme(undefined, false)).toBe("light");
  });
});

describe("stored preference", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to system when nothing is saved", () => {
    expect(readStoredTheme()).toBe("system");
  });

  it("round-trips light and dark", () => {
    storeTheme("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
    storeTheme("light");
    expect(readStoredTheme()).toBe("light");
  });

  it("clears the key for system so the OS stays in charge", () => {
    storeTheme("dark");
    storeTheme("system");
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    expect(readStoredTheme()).toBe("system");
  });

  it("ignores a tampered value", () => {
    localStorage.setItem(THEME_KEY, "<script>");
    expect(readStoredTheme()).toBe("system");
  });
});

describe("applyTheme", () => {
  it("toggles the dark class on the root element", () => {
    const root = document.createElement("html");
    applyTheme("dark", root);
    expect(root.classList.contains("dark")).toBe(true);
    applyTheme("light", root);
    expect(root.classList.contains("dark")).toBe(false);
  });
});

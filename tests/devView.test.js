import { describe, expect, it } from "vitest";
import { readPreviewRole, resolveRole, writePreviewRole } from "@/lib/devView";

describe("resolveRole", () => {
  it("lets an admin preview HR or Employee in development", () => {
    expect(resolveRole("admin", "HR", true)).toBe("HR");
    expect(resolveRole("admin", "Employee", true)).toBe("Employee");
    expect(resolveRole("admin", "admin", true)).toBe("admin");
  });

  it("uses the real role when no preview is set", () => {
    expect(resolveRole("admin", null, true)).toBe("admin");
    expect(resolveRole("HR", null, true)).toBe("HR");
  });

  it("never lets a non-admin escalate or switch", () => {
    expect(resolveRole("HR", "admin", true)).toBe("HR");
    expect(resolveRole("Employee", "admin", true)).toBe("Employee");
    expect(resolveRole("Employee", "HR", true)).toBe("Employee");
  });

  it("ignores previews entirely when disabled (production)", () => {
    expect(resolveRole("admin", "Employee", false)).toBe("admin");
  });

  it("rejects values that aren't real roles", () => {
    expect(resolveRole("admin", "superuser", true)).toBe("admin");
    expect(resolveRole(null, "HR", true)).toBeNull();
  });
});

describe("preview persistence", () => {
  it("round-trips through localStorage and clears", () => {
    writePreviewRole("HR", true);
    expect(readPreviewRole(true)).toBe("HR");
    writePreviewRole(null, true);
    expect(readPreviewRole(true)).toBeNull();
  });

  it("does not read or write when disabled", () => {
    writePreviewRole("Employee", false);
    expect(readPreviewRole(false)).toBeNull();
    expect(readPreviewRole(true)).toBeNull();
  });

  it("ignores a tampered stored value", () => {
    localStorage.setItem("paynode.devViewAs", "root");
    expect(readPreviewRole(true)).toBeNull();
    localStorage.removeItem("paynode.devViewAs");
  });
});

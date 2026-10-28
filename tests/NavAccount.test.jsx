import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { FooterAccount, MobileNavAccount, NavAccount } from "@/components/layout/NavAccount";

const session = vi.hoisted(() => ({ current: {} }));
vi.mock("@/app/providers/AuthProvider", () => ({ useSession: () => session.current }));

const signedIn = { status: "ready", user: { name: "Abir Shahadat Purab", email: "a@example.com", photoUrl: "" }, signOut: vi.fn() };
const states = {
  loading: { status: "loading", user: { name: "", email: "" }, signOut: vi.fn() },
  signedOut: { status: "signedOut", user: { name: "", email: "" }, signOut: vi.fn() },
  needsProfile: { status: "needsProfile", user: { name: "Jane", email: "j@example.com" }, signOut: vi.fn() },
  signedIn,
  error: { ...signedIn, status: "error" },
  deactivated: { ...signedIn, status: "deactivated" },
};

const renderAll = () =>
  render(
    <MemoryRouter>
      <NavAccount />
      <MobileNavAccount />
      <FooterAccount />
    </MemoryRouter>,
  );

const link = (name) => screen.queryAllByRole("link", { name });

describe("auth-aware public navigation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("signed out: offers sign in and get started everywhere, never the dashboard", () => {
    session.current = states.signedOut;
    renderAll();
    expect(link("Sign in")).toHaveLength(3);
    expect(link("Get started")).toHaveLength(3);
    expect(link(/dashboard/i)).toHaveLength(0);
  });

  it("loading: shows neither sign-in nor dashboard (no flash of the wrong state)", () => {
    session.current = states.loading;
    renderAll();
    expect(link("Sign in")).toHaveLength(0);
    expect(link(/dashboard/i)).toHaveLength(0);
  });

  it("signed in: shows the dashboard, the account menu and no sign-in links", () => {
    session.current = states.signedIn;
    renderAll();
    expect(link("Sign in")).toHaveLength(0);
    expect(link("Get started")).toHaveLength(0);
    // The desktop navbar has no separate Dashboard link: it lives inside the account menu.
    expect(link(/dashboard/i)).toHaveLength(2); // mobile menu + footer
    expect(screen.getByRole("button", { name: /account menu for abir shahadat purab/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /log out/i }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("a@example.com")).toBeInTheDocument();
    expect(link("Your profile")).toHaveLength(1);
  });

  it("account with a failed load or deactivation still routes to the dashboard gate", () => {
    for (const key of ["error", "deactivated"]) {
      session.current = states[key];
      const { unmount } = renderAll();
      expect(link(/dashboard/i).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("needs profile: points to finish setup instead of the dashboard", () => {
    session.current = states.needsProfile;
    renderAll();
    expect(link("Finish setup").length).toBeGreaterThanOrEqual(3);
    expect(link(/dashboard/i)).toHaveLength(0);
  });
});

describe("TrialButton", () => {
  beforeEach(() => vi.clearAllMocks());

  const renderCta = async () => {
    const { TrialButton } = await import("@/components/marketing");
    return render(<MemoryRouter><TrialButton /></MemoryRouter>);
  };

  it("invites visitors to get started", async () => {
    session.current = states.signedOut;
    await renderCta();
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute("href", "/register");
  });

  it("sends signed-in users to their dashboard", async () => {
    session.current = states.signedIn;
    await renderCta();
    expect(screen.getByRole("link", { name: /go to dashboard/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.queryByRole("link", { name: /get started/i })).toBeNull();
  });

  it("keeps the white background of the light variant on the blue banner, signed in or out", async () => {
    const { TrialButton } = await import("@/components/marketing");
    for (const key of ["signedOut", "signedIn", "needsProfile"]) {
      session.current = states[key];
      const { container, unmount } = render(<MemoryRouter><TrialButton variant="light" className="min-w-44" /></MemoryRouter>);
      const button = container.querySelector("a");
      expect(button.className).toContain("bg-white");
      expect(button.className).not.toMatch(/bg-white\/\d/); // no translucent override
      expect(button.className).toContain("text-[#1d4ed8]");
      unmount();
    }
  });

  it("only tints the loading placeholder, not a real button", async () => {
    const { TrialButton } = await import("@/components/marketing");
    session.current = states.loading;
    const { container } = render(<MemoryRouter><TrialButton variant="light" /></MemoryRouter>);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("span").className).toContain("bg-white/25");
  });

  it("finishes setup for incomplete profiles", async () => {
    session.current = states.needsProfile;
    await renderCta();
    expect(screen.getByRole("link", { name: /finish setup/i })).toHaveAttribute("href", "/complete-profile");
  });
});

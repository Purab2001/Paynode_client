import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { Menu, X, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  FooterAccount,
  MobileNavAccount,
  NavAccount,
} from "@/components/layout/NavAccount";
import { footerLinkClass } from "@/components/layout/styles";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Seo from "@/components/layout/Seo";
import { nav, site } from "@/config/site";
import { cn } from "@/lib/cn";

const YEAR = new Date().getFullYear();

const footerColumns = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/security", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4"
      >
        <Logo />
        <div className="hidden items-center gap-1 text-[15px] font-semibold md:flex">
          {nav.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex min-h-10 items-center rounded-lg px-3 transition-colors",
                  isActive ? "text-brand-dark" : "text-body hover:text-fg",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <NavAccount />
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 cursor-pointer place-items-center rounded-lg border border-line"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-line px-6 py-4 md:hidden"
        >
          {nav.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-3 font-semibold",
                  isActive
                    ? "bg-brand-soft text-brand-dark"
                    : "text-body hover:bg-surface",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <MobileNavAccount />
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex max-w-xs flex-col gap-4">
          <Logo size={30} textClassName="text-lg" />
          <p className="text-sm leading-relaxed text-muted">
            Time tracking, payroll approvals and salary payments for growing
            teams.
          </p>
          <a
            href={`mailto:${site.emails.support}`}
            className="inline-flex min-h-9 items-center gap-2 text-sm font-bold text-brand-dark hover:underline"
          >
            <Mail size={16} aria-hidden="true" /> {site.emails.support}
          </a>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-1 text-sm">
            <h2 className="mb-2 font-extrabold">{col.title}</h2>
            {col.links.map((l) => (
              <Link key={l.to} to={l.to} className={footerLinkClass}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
        <FooterAccount />
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-line px-6 pb-8 pt-5 text-[13px] text-muted">
        <span>
          © {YEAR} {site.name}. All rights reserved.
        </span>
        <span>Payments processed by Stripe.</span>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:font-bold focus:shadow"
      >
        Skip to content
      </a>
      <Seo />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

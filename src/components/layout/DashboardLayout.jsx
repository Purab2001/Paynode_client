import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { ChevronsUpDown, LogOut, Menu, User, X } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import { dashboardNav } from "@/components/layout/navConfig";
import { useUnreadCount } from "@/features/contact/api";
import { usePayrollRequests } from "@/features/payroll/api";
import DevViewSwitcher from "@/components/layout/DevViewSwitcher";
import ThemeToggle, { ThemeSwitch } from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/cn";

function SidebarContent({ onNavigate }) {
  const { role, actualRole, user, signOut } = useSession();
  const navigate = useNavigate();
  const links = dashboardNav.filter((l) => l.roles.includes(role));
  // Only admins can call the payroll API, so skip the request when previewing another role.
  const isAdmin = role === "admin" && actualRole === "admin";
  const pending = usePayrollRequests({ status: "pending", limit: 1 }, { enabled: isAdmin });
  const unread = useUnreadCount({ enabled: isAdmin });
  const badges = { pendingPayroll: pending.data?.counts.pending ?? 0, unreadMessages: unread.data?.unread ?? 0 };

  return (
    <div className="scrollbar-dark flex h-full flex-col gap-7 overflow-y-auto bg-ink px-4 py-6 text-[#c9d3e3]">
      <Logo textClassName="text-lg text-white" size={32} className="px-2" />
      <nav
        aria-label="Dashboard"
        className="flex flex-col gap-1 text-[15px] font-semibold"
      >
        {links.map(({ to, label, icon: Icon, end, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-ink-2 text-white"
                  : "hover:bg-ink-2/60 hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  aria-hidden="true"
                  className={isActive ? "text-[#7db3ff]" : ""}
                />
                {label}
                {badgeKey && badges[badgeKey] > 0 && (
                  <span
                    className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-extrabold text-white"
                    aria-label={`${badges[badgeKey]} pending`}
                  >
                    {badges[badgeKey]}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <DevViewSwitcher onSwitch={onNavigate} />
        <ThemeSwitch />
        <DropdownMenu
          anchor="top start"
          triggerClassName="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-ink-line p-3 text-left hover:bg-ink-2 data-open:bg-ink-2"
          trigger={
            <>
              <Avatar
                name={user.name}
                src={user.photoUrl}
                className="bg-brand text-white"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">
                  {user.name}
                </span>
                <span className="block text-xs text-[#9aa8bf]">
                  {user.label}
                </span>
              </span>
              <ChevronsUpDown size={16} aria-hidden="true" />
            </>
          }
          items={[
            {
              label: "Your profile",
              icon: User,
              onClick: () => navigate("/dashboard/profile"),
            },
            "separator",
            {
              label: "Log out",
              icon: LogOut,
              onClick: async () => {
                await signOut();
                navigate("/", { replace: true });
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile drawer on navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 flex-none border-r border-ink-line lg:block">
        <SidebarContent />
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-card px-4 py-3 lg:hidden">
        <Logo size={30} textClassName="text-lg" />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid size-11 cursor-pointer place-items-center rounded-lg border border-line"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <aside className="relative h-full w-72 max-w-[85%]">
            <SidebarContent onNavigate={() => setOpen(false)} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 grid size-9 cursor-pointer place-items-center rounded-lg text-white hover:bg-ink-2"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-7 sm:px-8 lg:pb-12">
        <Outlet />
      </main>
    </div>
  );
}

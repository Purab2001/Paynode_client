import { ChevronDown, LayoutGrid, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { footerLinkClass } from "@/components/layout/styles";
import { useAccount } from "@/hooks/useAccount";

/** Navbar actions, desktop. Signed in: a single account menu (it holds the dashboard link). */
export function NavAccount() {
  const { kind, user, name, firstName, logOut } = useAccount();
  const navigate = useNavigate();

  if (kind === "loading") return <div className="h-10 w-44 animate-pulse rounded-lg bg-line" aria-hidden="true" />;

  if (kind === "signedOut") {
    return (
      <>
        <Button to="/login" variant="ghost" size="sm" className="text-fg">Sign in</Button>
        <Button to="/register" size="sm">Get started</Button>
      </>
    );
  }

  if (kind === "needsProfile") {
    return (
      <>
        <Button to="/complete-profile" size="sm">Finish setup</Button>
        <Button variant="ghost" size="sm" onClick={logOut}>Sign out</Button>
      </>
    );
  }

  return (
    <DropdownMenu
      triggerClassName="flex cursor-pointer items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-bold text-fg transition-colors hover:bg-surface data-open:bg-surface"
      trigger={
        <>
          <Avatar name={name} src={user.photoUrl} size={32} />
          <span aria-hidden="true" className="hidden max-w-28 truncate lg:block">{firstName}</span>
          <ChevronDown size={15} aria-hidden="true" className="text-muted" />
          <span className="sr-only">Account menu for {name}</span>
        </>
      }
      items={[
        { label: "Dashboard", icon: LayoutGrid, onClick: () => navigate("/dashboard") },
        { label: "Your profile", icon: User, onClick: () => navigate("/dashboard/profile") },
        "separator",
        { label: "Log out", icon: LogOut, onClick: logOut },
      ]}
    />
  );
}

/** Navbar actions inside the mobile menu. */
export function MobileNavAccount() {
  const { kind, user, name, logOut } = useAccount();

  if (kind === "loading") return <div className="mt-3 h-12 animate-pulse rounded-xl bg-line" aria-hidden="true" />;

  if (kind === "signedOut") {
    return (
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button to="/login" variant="secondary">Sign in</Button>
        <Button to="/register">Get started</Button>
      </div>
    );
  }

  if (kind === "needsProfile") {
    return (
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button to="/complete-profile">Finish setup</Button>
        <Button variant="secondary" onClick={logOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
        <Avatar name={name} src={user.photoUrl} size={40} />
        <div className="min-w-0">
          <p className="truncate font-bold">{name}</p>
          {user.email && <p className="truncate text-[13px] text-muted">{user.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button to="/dashboard"><LayoutGrid size={16} aria-hidden="true" /> Dashboard</Button>
        <Button variant="secondary" onClick={logOut}><LogOut size={16} aria-hidden="true" /> Log out</Button>
      </div>
    </div>
  );
}

/** The footer's "Account" column. */
export function FooterAccount() {
  const { kind, logOut } = useAccount();
  const linkClass = footerLinkClass;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <h2 className="mb-2 font-extrabold">Account</h2>
      {kind === "loading" && (
        <>
          <span className="h-4 w-20 animate-pulse rounded bg-line" aria-hidden="true" />
          <span className="h-4 w-28 animate-pulse rounded bg-line" aria-hidden="true" />
        </>
      )}
      {kind === "signedOut" && (
        <>
          <Link to="/login" className={linkClass}>Sign in</Link>
          <Link to="/register" className={linkClass}>Get started</Link>
        </>
      )}
      {kind === "needsProfile" && (
        <>
          <Link to="/complete-profile" className={linkClass}>Finish setup</Link>
          <button type="button" onClick={logOut} className={`${linkClass} cursor-pointer text-left`}>Log out</button>
        </>
      )}
      {kind === "signedIn" && (
        <>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
          <Link to="/dashboard/profile" className={linkClass}>Your profile</Link>
          <button type="button" onClick={logOut} className={`${linkClass} cursor-pointer text-left`}>Log out</button>
        </>
      )}
    </div>
  );
}

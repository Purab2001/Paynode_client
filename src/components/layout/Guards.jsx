import { Navigate, Outlet, useLocation } from "react-router";
import { RefreshCw, UserX } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export function FullPageSpinner({ label = "Loading" }) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface" role="status" aria-label={label}>
      <span className="size-9 animate-spin rounded-full border-[3px] border-brand-soft border-t-brand" />
    </div>
  );
}

function Notice({ icon: Icon, title, children, action }) {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <Logo />
        <span className="mt-4 grid size-14 place-items-center rounded-full bg-card text-muted shadow-sm"><Icon size={24} aria-hidden="true" /></span>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="leading-relaxed text-body">{children}</p>
        {action}
      </div>
    </main>
  );
}

/** Dashboard gate: signed in, profile complete, account active. */
export function RequireAuth() {
  const { status, error, retry, signOut } = useSession();
  const location = useLocation();

  if (status === "loading") return <FullPageSpinner />;
  if (status === "signedOut") return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (status === "needsProfile") return <Navigate to="/complete-profile" replace />;
  if (status === "deactivated") {
    return (
      <Notice icon={UserX} title="Your account is deactivated" action={<Button variant="secondary" onClick={signOut}>Sign out</Button>}>
        You no longer have access to PayNode. If you think this is a mistake, contact your administrator.
      </Notice>
    );
  }
  if (status === "error") {
    return (
      <Notice icon={RefreshCw} title="We couldn't load your account" action={<Button onClick={retry}>Try again</Button>}>
        {error?.message}
      </Notice>
    );
  }
  return <Outlet />;
}

/** Only the given roles may see the nested routes. */
export function RoleRoute({ roles }) {
  const { role } = useSession();
  return roles.includes(role) ? <Outlet /> : <Navigate to="/forbidden" replace />;
}

/** Sign-in pages: send people who are already signed in where they belong. */
export function RedirectIfSignedIn() {
  const { status, signingUp } = useSession();
  const location = useLocation();
  if (signingUp) return <Outlet />;
  if (status === "loading") return <FullPageSpinner />;
  // "error" and "deactivated" go to the dashboard gate, which explains what went wrong.
  if (status === "ready" || status === "error" || status === "deactivated") {
    return <Navigate to={location.state?.from ?? "/dashboard"} replace />;
  }
  if (status === "needsProfile") return <Navigate to="/complete-profile" replace />;
  return <Outlet />;
}

/** The finish-sign-up page needs a Firebase account without a profile. */
export function RequireNeedsProfile() {
  const { status } = useSession();
  if (status === "loading") return <FullPageSpinner />;
  if (status === "signedOut") return <Navigate to="/login" replace />;
  if (status !== "needsProfile") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

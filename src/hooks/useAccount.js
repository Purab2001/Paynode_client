import { useNavigate } from "react-router";
import { useSession } from "@/app/providers/AuthProvider";

/**
 * What the public site should show for the current visitor.
 *   loading      → session not resolved yet (render a placeholder, never the wrong state)
 *   signedOut    → anonymous visitor
 *   needsProfile → signed in with Firebase but hasn't finished setup
 *   signedIn     → everything else (ready, error, deactivated); the dashboard gate explains problems
 */
export function useAccount() {
  const { status, user, signOut } = useSession();
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const kind = status === "loading" ? "loading" : status === "signedOut" ? "signedOut" : status === "needsProfile" ? "needsProfile" : "signedIn";
  const name = user.name || user.email || "Your account";
  return { kind, user, name, firstName: name.split(" ")[0], logOut };
}

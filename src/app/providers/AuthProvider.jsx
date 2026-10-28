import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { http } from "@/lib/api";
import { DEV_VIEW_ENABLED, readPreviewRole, resolveRole, writePreviewRole } from "@/lib/devView";

export const AuthContext = createContext(null);

const roleLabels = { admin: "Admin", HR: "HR", Employee: "Employee" };

/**
 * Session state machine:
 *   loading → signedOut | needsProfile | deactivated | ready
 * Firebase owns identity; the PayNode API owns the profile and role (`GET /api/users/me`).
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState(undefined); // undefined = not resolved yet
  // True while sign-up creates the Firebase account and then the profile, so guards don't redirect mid-way.
  const [signingUp, setSigningUp] = useState(false);
  // Development only: an admin previewing another role. See lib/devView.js.
  const [previewRole, setPreviewRoleState] = useState(readPreviewRole);
  const setPreviewRole = useCallback((next) => {
    setPreviewRoleState(next);
    writePreviewRole(next);
  }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setFirebaseUser(u);
        if (!u) queryClient.clear();
      }),
    [queryClient],
  );

  const me = useQuery({
    queryKey: ["me", firebaseUser?.uid],
    queryFn: () => http.get("/api/users/me"),
    enabled: !!firebaseUser,
    retry: (count, err) => !["PROFILE_INCOMPLETE", "ACCOUNT_DEACTIVATED"].includes(err.code) && err.status !== 401 && count < 2,
    staleTime: 5 * 60_000,
  });

  let status = "loading";
  if (firebaseUser === null) status = "signedOut";
  else if (firebaseUser && me.isSuccess) status = "ready";
  else if (me.error?.code === "PROFILE_INCOMPLETE") status = "needsProfile";
  else if (me.error?.code === "ACCOUNT_DEACTIVATED") status = "deactivated";
  else if (me.isError) status = "error";

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(() => {
    const profile = me.data ?? null;
    return {
      status,
      firebaseUser: firebaseUser ?? null,
      profile,
      role: resolveRole(profile?.role, previewRole),
      actualRole: profile?.role ?? null,
      previewRole,
      canPreview: DEV_VIEW_ENABLED && profile?.role === "admin",
      setPreviewRole,
      // Display-friendly user shape used across the dashboard.
      // Saved photo first, then the Google/Firebase photo for accounts whose profile has none.
      user: profile
        ? { ...profile, photoUrl: profile.photoUrl || firebaseUser?.photoURL || "", label: roleLabels[profile.role] }
        : { name: firebaseUser?.displayName ?? "", email: firebaseUser?.email ?? "", label: "" },
      error: me.error,
      retry: () => me.refetch(),
      signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
      signInWithGoogle: () => signInWithPopup(auth, googleProvider),
      signingUp,
      /**
       * Email sign-up: create the Firebase account, then the PayNode profile.
       * If the profile step fails, the account exists without a profile and the
       * user is sent to /complete-profile to finish.
       */
      register: async ({ email, password, ...details }) => {
        setSigningUp(true);
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: details.name });
          const created = await http.post("/api/users/me", details);
          queryClient.setQueryData(["me", cred.user.uid], created);
          return created;
        } finally {
          setSigningUp(false);
        }
      },
      /** Create the PayNode profile for an already signed-in Firebase account (e.g. Google). */
      completeProfile: async (details) => {
        const created = await http.post("/api/users/me", details);
        queryClient.setQueryData(["me", auth.currentUser?.uid], created);
        return created;
      },
      setProfile: (next) => queryClient.setQueryData(["me", auth.currentUser?.uid], next),
      signOut,
    };
  }, [status, firebaseUser, me, queryClient, signOut, signingUp, previewRole, setPreviewRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used inside AuthProvider");
  return ctx;
}

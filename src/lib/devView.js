// Local-development helper: lets an admin preview the dashboard as HR or Employee.
//
// UI-ONLY. It changes which screens the frontend shows; the API still authorises every
// request as the real role. It is compiled out of production builds (import.meta.env.DEV).

export const DEV_VIEW_ENABLED = import.meta.env.DEV;

export const VIEW_AS_OPTIONS = [
  { value: "admin", label: "Admin", description: "Your real role" },
  { value: "HR", label: "HR", description: "Verify staff, request pay" },
  { value: "Employee", label: "Employee", description: "Work sheet and payments" },
];

const STORAGE_KEY = "paynode.devViewAs";
const isRole = (v) => VIEW_AS_OPTIONS.some((o) => o.value === v);

/** The role the UI should behave as. Only admins can preview, and only in development. */
export function resolveRole(actualRole, previewRole, enabled = DEV_VIEW_ENABLED) {
  if (enabled && actualRole === "admin" && isRole(previewRole)) return previewRole;
  return actualRole ?? null;
}

export function readPreviewRole(enabled = DEV_VIEW_ENABLED) {
  if (!enabled) return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isRole(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function writePreviewRole(role, enabled = DEV_VIEW_ENABLED) {
  if (!enabled) return;
  try {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: the preview just won't persist */
  }
}

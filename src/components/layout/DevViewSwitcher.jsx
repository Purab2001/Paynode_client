import { useNavigate } from "react-router";
import { Eye } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import Select from "@/components/ui/Select";
import { VIEW_AS_OPTIONS } from "@/lib/devView";

/**
 * Sidebar control for local development: an admin can view the dashboard as HR or Employee.
 * Renders nothing in production builds or for non-admins. UI-only; the API still sees the real role.
 */
export default function DevViewSwitcher({ onSwitch }) {
  const { canPreview, role, actualRole, setPreviewRole } = useSession();
  const navigate = useNavigate();
  if (!canPreview) return null;

  const previewing = role !== actualRole;
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-ink-line p-3">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#9aa8bf]">
        <Eye size={13} aria-hidden="true" /> Dev · view as
      </span>
      <Select
        tone="dark"
        aria-label="Preview the dashboard as another role"
        value={role}
        anchor="top start"
        options={VIEW_AS_OPTIONS}
        onChange={(next) => {
          setPreviewRole(next === actualRole ? null : next);
          navigate("/dashboard"); // the current page may not exist for the new role
          onSwitch?.(); // e.g. close the mobile drawer
        }}
        className="py-2.5 text-sm"
      />
      {previewing && (
        <p className="text-[11px] leading-snug text-[#9aa8bf]">Screens only. The API still treats you as {actualRole}.</p>
      )}
    </div>
  );
}

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/** Icon button that opens a Light / Dark / System menu. For navbars and top bars. */
export default function ThemeToggle({ tone = "light", anchor = "bottom end", className }) {
  const { preference, resolved, setPreference } = useTheme();
  const Icon = resolved === "dark" ? Moon : Sun;

  return (
    <DropdownMenu
      anchor={anchor}
      triggerClassName={cn(
        "grid size-10 cursor-pointer place-items-center rounded-lg transition-colors",
        tone === "dark" ? "text-[#c9d3e3] hover:bg-ink-2 data-open:bg-ink-2" : "text-body hover:bg-surface data-open:bg-surface",
        className,
      )}
      trigger={
        <>
          <Icon size={18} aria-hidden="true" />
          <span className="sr-only">Theme: {preference}</span>
        </>
      }
      items={OPTIONS.map(({ value, label, icon }) => ({ label, icon, active: preference === value, onClick: () => setPreference(value) }))}
    />
  );
}

/** Three-way switch laid out in a row. Dark-surface styling, for the dashboard sidebar. */
export function ThemeSwitch({ className }) {
  const { preference, setPreference } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className={cn("flex rounded-xl border border-ink-line p-1", className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          aria-label={label}
          title={label}
          onClick={() => setPreference(value)}
          className={cn(
            "grid h-10 flex-1 cursor-pointer place-items-center rounded-lg transition-colors",
            preference === value ? "bg-ink-2 text-white" : "text-[#9aa8bf] hover:text-white",
          )}
        >
          <Icon size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

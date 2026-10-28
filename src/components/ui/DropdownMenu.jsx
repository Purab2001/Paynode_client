import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { Check, Ellipsis } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Action menu. items: ({ label, icon?, onClick, tone?: "danger", disabled?, active? } | "separator")[]
 * Pass `trigger` to replace the default "⋯" icon button.
 */
export default function DropdownMenu({ items, label = "More actions", trigger, triggerClassName, anchor = "bottom end" }) {
  return (
    <Menu>
      <MenuButton
        aria-label={trigger ? undefined : label}
        className={cn(
          !trigger &&
            "grid size-10 cursor-pointer place-items-center rounded-lg text-body hover:bg-surface data-open:bg-surface",
          triggerClassName,
        )}
      >
        {trigger ?? <Ellipsis size={18} aria-hidden="true" />}
      </MenuButton>
      <MenuItems
        anchor={anchor}
        transition
        className="z-[60] min-w-52 rounded-xl border border-line bg-card p-1 text-[15px] shadow-[0_16px_40px_-12px_rgba(11,19,36,0.25)] [--anchor-gap:6px] focus:outline-none transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
      >
        {items.map((item, i) =>
          item === "separator" ? (
            <MenuSeparator key={`sep-${i}`} className="my-1 h-px bg-line" />
          ) : (
            <MenuItem key={item.label} disabled={item.disabled}>
              <button
                type="button"
                onClick={item.onClick}
                aria-current={item.active ? "true" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-semibold data-disabled:cursor-not-allowed data-disabled:opacity-50",
                  item.tone === "danger" ? "text-bad data-focus:bg-bad-soft" : "text-fg data-focus:bg-surface",
                )}
              >
                {item.icon && <item.icon size={16} aria-hidden="true" className={item.tone === "danger" ? "" : "text-muted"} />}
                <span className="flex-1">{item.label}</span>
                {item.active && <Check size={15} aria-hidden="true" className="text-brand" />}
              </button>
            </MenuItem>
          ),
        )}
      </MenuItems>
    </Menu>
  );
}

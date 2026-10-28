import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

const normalize = (o) => (typeof o === "object" ? o : { value: o, label: String(o) });

const tones = {
  light: "border border-line-strong bg-card text-fg data-open:border-brand data-open:ring-2 data-open:ring-brand/20",
  dark: "border border-ink-line bg-ink-2 text-white",
};

/**
 * Accessible custom select (keyboard, type-ahead, screen readers via Headless UI).
 * options: string[] | { value, label, description?, icon? }[]
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  invalid = false,
  disabled = false,
  tone = "light",
  icon: LeadingIcon,
  name,
  className,
  anchor = "bottom start",
  "aria-label": ariaLabel,
}) {
  const items = options.map(normalize);
  const selected = items.find((o) => o.value === value);

  return (
    <Listbox value={value ?? null} onChange={onChange} disabled={disabled} name={name}>
      <ListboxButton
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] py-3 pl-3.5 pr-10 text-left text-[15px] font-medium transition-colors focus:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-60",
          tones[tone],
          invalid && "border-bad",
          className,
        )}
      >
        {LeadingIcon && <LeadingIcon size={17} className="flex-none text-muted" aria-hidden="true" />}
        <span className={cn("block truncate", !selected && (tone === "dark" ? "text-[#9aa8bf]" : "text-muted"))}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
      </ListboxButton>
      <ListboxOptions
        anchor={anchor}
        transition
        className="z-[60] max-h-72 w-(--button-width) min-w-44 overflow-y-auto rounded-xl border border-line bg-card p-1 text-[15px] shadow-[0_16px_40px_-12px_rgba(11,19,36,0.25)] [--anchor-gap:6px] focus:outline-none data-closed:scale-95 data-closed:opacity-0 transition duration-100 ease-out"
      >
        {items.map((o) => (
          <ListboxOption
            key={o.value}
            value={o.value}
            disabled={o.disabled}
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-fg select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus:bg-surface"
          >
            {o.icon && <o.icon size={16} className="flex-none text-muted" aria-hidden="true" />}
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold group-data-selected:text-brand-dark">{o.label}</span>
              {o.description && <span className="block text-[13px] text-muted">{o.description}</span>}
            </span>
            <Check size={16} aria-hidden="true" className="invisible flex-none text-brand group-data-selected:visible" />
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

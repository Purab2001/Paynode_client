import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-[10px] border border-line-strong bg-card px-3.5 py-3 text-[15px] font-medium text-fg placeholder:font-normal placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 aria-invalid:border-bad read-only:bg-surface read-only:text-muted";

/** Label + control + hint/error. Wrap any control (Input, Select, Textarea). */
export function Field({ label, hint, error, optional, className, children }) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-bold", className)}>
      <span>
        {label}
        {optional && <span className="ml-1 font-medium text-muted">(optional)</span>}
      </span>
      {children}
      {error ? (
        <span role="alert" className="text-[13px] font-medium text-bad">{error}</span>
      ) : (
        hint && <span className="text-[13px] font-medium text-muted">{hint}</span>
      )}
    </label>
  );
}

export function Input({ className, invalid, ...props }) {
  return <input aria-invalid={invalid || undefined} className={cn(inputClass, className)} {...props} />;
}

export function Textarea({ className, invalid, rows = 5, ...props }) {
  return <textarea rows={rows} aria-invalid={invalid || undefined} className={cn(inputClass, "resize-y", className)} {...props} />;
}

export function SearchInput({ value, onChange, placeholder = "Search", label = "Search", className }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-[10px] border border-line bg-card px-3.5 text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20", className)}>
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full min-w-52 bg-transparent py-2.5 text-sm font-medium text-fg outline-none placeholder:font-normal placeholder:text-faint"
      />
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-10 flex-none cursor-pointer rounded-full transition-colors", checked ? "bg-green-600" : "bg-line-strong")}
    >
      <span className={cn("absolute top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-all", checked ? "left-[19px]" : "left-[3px]")} />
    </button>
  );
}

/** Segmented control for switching views. */
export function Tabs({ value, onChange, items, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex rounded-xl bg-track p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[9px] px-4 py-2 text-sm font-bold transition-colors",
            value === item.value ? "bg-card text-fg shadow-sm" : "text-body hover:text-fg",
          )}
        >
          {item.icon && <item.icon size={15} aria-hidden="true" />}
          {item.label}
        </button>
      ))}
    </div>
  );
}

/** Pill filters (single choice). */
export function ChipGroup({ value, onChange, items, label }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition-colors",
            value === item.value ? "border-brand bg-brand text-white" : "border-line-strong bg-card text-body hover:border-brand/50",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/** Accordion item used by FAQ lists. */
export function Accordion({ items, defaultOpen = 0 }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <Disclosure key={item.q} defaultOpen={i === defaultOpen} as="div" className="rounded-[14px] border border-line bg-card">
          <DisclosureButton className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[17px] font-bold">
            {item.q}
            <ChevronDown size={20} aria-hidden="true" className="flex-none text-muted transition-transform group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="px-6 pb-5 leading-relaxed text-body">{item.a}</DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}

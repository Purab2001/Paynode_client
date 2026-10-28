import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

/** Accessible dialog: focus trap, Escape to close, scroll lock. */
export default function Modal({ open, onClose, title, description, children }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop transition className="fixed inset-0 bg-ink/50 transition duration-150 data-closed:opacity-0" />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
        <DialogPanel
          transition
          className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-card p-6 shadow-2xl transition duration-150 data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-extrabold">{title}</DialogTitle>
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid size-9 flex-none cursor-pointer place-items-center rounded-lg bg-surface text-body hover:bg-line"
            >
              <X size={16} />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/** Confirm a destructive or important action. */
export function ConfirmDialog({ open, onClose, onConfirm, title, children, confirmLabel = "Confirm", tone = "danger" }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="leading-relaxed text-body">{children}</div>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant={tone === "danger" ? "destructive" : "primary"} className="flex-1" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

import { useEffect, useId, useMemo } from "react";
import { Camera, Trash2, User } from "lucide-react";
import { validateImage } from "@/lib/uploadImage";
import { cn } from "@/lib/cn";

const formatSize = (bytes) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

/**
 * Choose a profile photo with a live preview. Calls onChange(file | null).
 * `currentSrc` shows the photo that's already saved until a new one is picked.
 */
export default function PhotoPicker({ file, onChange, error, onError, currentSrc, optional = true }) {
  const inputId = useId();
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const shown = preview ?? currentSrc;
  const hasPhoto = !!shown;

  const pick = (e) => {
    const next = e.target.files?.[0];
    e.target.value = "";
    if (!next) return;
    const problem = validateImage(next);
    if (problem) return onError(problem);
    onError("");
    onChange(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-xl border border-dashed border-line-strong p-4 sm:col-span-2">
      <label htmlFor={inputId} className="group relative flex-none cursor-pointer rounded-full focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
        {hasPhoto ? (
          <img src={shown} alt={file ? "Preview of your new photo" : "Your current photo"} className="size-20 rounded-full bg-line object-cover ring-2 ring-card" />
        ) : (
          <span className="grid size-20 place-items-center rounded-full bg-brand-soft text-brand-dark">
            <User size={30} aria-hidden="true" />
          </span>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full border-2 border-card bg-ink text-white transition-colors group-hover:bg-brand">
          <Camera size={13} aria-hidden="true" />
        </span>
      </label>

      <div className="min-w-[10rem] flex-1">
        <p className="text-sm font-bold">
          Profile photo
          {optional && !hasPhoto && <span className="ml-1 font-medium text-muted">(optional)</span>}
        </p>
        <p className={cn("mt-0.5 break-words text-[13px]", error ? "text-bad" : "text-muted")} role={error ? "alert" : undefined}>
          {error ||
            (file
              ? `${file.name} · ${formatSize(file.size)}`
              : currentSrc
                ? "Choose a new photo to replace this one."
                : "JPG, PNG or WebP, up to 5 MB. Helps HR recognise you.")}
        </p>
        {file && <p className="mt-0.5 text-[13px] font-semibold text-ok">New photo selected. It's saved when you submit.</p>}
      </div>

      <div className="flex flex-none items-center gap-2">
        {file && (
          <button
            type="button"
            onClick={() => { onChange(null); onError(""); }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-2.5 text-sm font-bold text-bad hover:bg-bad-soft"
          >
            <Trash2 size={15} aria-hidden="true" /> Remove
          </button>
        )}
        <label htmlFor={inputId} className="cursor-pointer rounded-[10px] border border-line-strong px-3.5 py-2.5 text-sm font-bold hover:bg-surface">
          {hasPhoto ? "Change photo" : "Upload photo"}
        </label>
        <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} className="sr-only" />
      </div>
    </div>
  );
}

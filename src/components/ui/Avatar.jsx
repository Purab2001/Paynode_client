import { useState } from "react";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

const palette = [
  "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
  "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200",
];

const pick = (name = "") => palette[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % palette.length];

/** Photo when available, otherwise coloured initials. */
export default function Avatar({ name, src, size = 36, className }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={cn("flex-none rounded-full bg-line object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn("grid flex-none place-items-center rounded-full font-extrabold", pick(name), className)}
    >
      {initials(name)}
    </span>
  );
}

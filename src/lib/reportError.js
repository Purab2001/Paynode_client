import toast from "react-hot-toast";
import { ApiError } from "@/lib/api";
import { firebaseErrorMessage } from "@/lib/firebase";

/**
 * Show an API or Firebase error as a toast. When `setError` (react-hook-form) is given,
 * field-level validation errors from the API are also shown under their inputs.
 */
export function reportError(err, setError) {
  if (err instanceof ApiError) {
    if (err.details && setError) {
      for (const [field, messages] of Object.entries(err.details)) setError(field, { message: messages[0] });
    }
    return toast.error(err.message);
  }
  const message = err?.code?.startsWith?.("auth/") ? firebaseErrorMessage(err) : err?.message;
  if (message) toast.error(message);
}

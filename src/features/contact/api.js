import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { reportError } from "@/lib/reportError";

/** Public contact form. No sign-in needed. */
export const useSendContact = () => useMutation({ mutationFn: (body) => http.post("/api/contact", body) });

export const useInbox = (params) =>
  useQuery({ queryKey: ["contact", "list", params], queryFn: () => http.get("/api/contact", params), placeholderData: keepPreviousData });

/** Number of unread messages, for the sidebar badge. */
export const useUnreadCount = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: ["contact", "unread"],
    queryFn: () => http.get("/api/contact/unread-count"),
    enabled,
    refetchInterval: 60_000,
  });

export function useSetMessageStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => http.patch(`/api/contact/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact"] }),
    onError: (err) => reportError(err),
  });
}

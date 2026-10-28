import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { http } from "@/lib/api";
import { reportError } from "@/lib/reportError";

export const payrollKeys = {
  all: ["payroll"],
  list: (params) => ["payroll", "list", params],
  detail: (id) => ["payroll", "detail", id],
};

/** HR: requests they sent. Admin: every request. `counts` holds the per-status totals for tab badges. */
export const usePayrollRequests = (params, { enabled = true } = {}) =>
  useQuery({ queryKey: payrollKeys.list(params), queryFn: () => http.get("/api/payroll", params), placeholderData: keepPreviousData, enabled });

/** A single request. Pass `poll` to refetch until it leaves `pending` (waiting for the Stripe webhook). */
export const usePayrollRequest = (id, { poll = false } = {}) =>
  useQuery({
    queryKey: payrollKeys.detail(id),
    queryFn: () => http.get(`/api/payroll/${id}`),
    enabled: !!id,
    refetchInterval: (query) => (poll && query.state.data?.status === "pending" ? 1500 : false),
  });

export function useRequestPay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => http.post("/api/payroll", body),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      toast.success(`Pay request for ${created.employee.name} sent to an admin`);
    },
    onError: (err) => reportError(err),
  });
}

export function useRejectPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => http.patch(`/api/payroll/${id}/reject`, { reason }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: payrollKeys.all });
      toast(`Request for ${updated.employee.name} rejected`);
    },
    onError: (err) => reportError(err),
  });
}

/** Admin: ask the server for a Stripe PaymentIntent for this request. The amount is decided server-side. */
export const useCreatePaymentIntent = () =>
  useMutation({ mutationFn: (id) => http.post(`/api/payroll/${id}/payment-intent`), onError: (err) => reportError(err) });

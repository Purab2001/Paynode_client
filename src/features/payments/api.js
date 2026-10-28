import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";

export const paymentKeys = {
  mine: (params) => ["payments", "mine", params],
  forEmployee: (id) => ["payments", "employee", id],
};

/** The signed-in employee's own payments, with totals for the stat cards. */
export const useMyPayments = (params) =>
  useQuery({ queryKey: paymentKeys.mine(params), queryFn: () => http.get("/api/payments/mine", params), placeholderData: keepPreviousData });

/** HR and admins: recent payments for one employee (newest first). */
export const useEmployeePayments = (employeeId, limit = 12) =>
  useQuery({
    queryKey: paymentKeys.forEmployee(employeeId),
    queryFn: () => http.get("/api/payments", { employee: employeeId, limit }),
    enabled: !!employeeId,
  });

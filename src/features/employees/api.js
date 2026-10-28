import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { http } from "@/lib/api";
import { reportError } from "@/lib/reportError";

export const employeeKeys = {
  all: ["employees"],
  list: (params) => ["employees", "list", params],
  stats: () => ["employees", "stats"],
  detail: (id) => ["employees", "detail", id],
};

/** GET /api/employees — scoped by the caller's role on the server. */
export function useEmployees(params) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => http.get("/api/employees", params),
    placeholderData: keepPreviousData, // keep rows on screen while a new search loads
  });
}

export function useEmployeeStats({ enabled = true } = {}) {
  return useQuery({ queryKey: employeeKeys.stats(), queryFn: () => http.get("/api/employees/stats"), enabled });
}

export function useEmployee(id) {
  return useQuery({ queryKey: employeeKeys.detail(id), queryFn: () => http.get(`/api/employees/${id}`), enabled: !!id });
}

/**
 * PATCH /api/employees/:id/<action>. Writes the returned employee into every cached
 * list and detail, then refreshes counts and filtered lists in the background.
 */
function useEmployeeAction(action, successMessage) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => http.patch(`/api/employees/${id}/${action}`, body),
    onSuccess: (updated) => {
      qc.setQueryData(employeeKeys.detail(updated.id), updated);
      qc.setQueriesData({ queryKey: ["employees", "list"] }, (page) =>
        page ? { ...page, items: page.items.map((e) => (e.id === updated.id ? updated : e)) } : page,
      );
      qc.invalidateQueries({ queryKey: employeeKeys.all });
      toast.success(successMessage(updated));
    },
    onError: (err) => reportError(err),
  });
}

export const useSetVerification = () =>
  useEmployeeAction("verification", (e) => (e.isVerified ? `${e.name} verified` : `Verification removed for ${e.name}`));

export const useSetRole = () => useEmployeeAction("role", (e) => (e.role === "HR" ? `${e.name} is now HR` : `${e.name} is now an Employee`));

export const useRaiseSalary = () => useEmployeeAction("salary", (e) => `${e.name}'s salary updated`);

export const useSetStatus = () =>
  useEmployeeAction("status", (e) => (e.isActive ? `${e.name}'s access restored` : `${e.name}'s account deactivated`));

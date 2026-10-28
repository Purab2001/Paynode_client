import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { todayLocal } from "@/lib/format";

/** Employee: hours, tasks, latest entries and last payment for the dashboard and overview. */
export const useMyStats = () =>
  useQuery({ queryKey: ["stats", "me"], queryFn: () => http.get("/api/stats/me", { today: todayLocal() }) });

/** HR (their own requests) and admins (all): 12-month trend and request totals by status. */
export const usePayrollStats = () => useQuery({ queryKey: ["stats", "payroll"], queryFn: () => http.get("/api/stats/payroll") });

/** Admin: recent verification, role, salary, access and payment events. */
export const useActivity = () => useQuery({ queryKey: ["stats", "activity"], queryFn: () => http.get("/api/stats/activity") });

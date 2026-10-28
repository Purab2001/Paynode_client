import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/api";
import { todayLocal } from "@/lib/format";

/** Employee: hours, tasks, latest entries and last payment for the dashboard and overview. */
export const useMyStats = () =>
  useQuery({ queryKey: ["stats", "me"], queryFn: () => http.get("/api/stats/me", { today: todayLocal() }) });

/** HR (their own requests) and admins (all): 12-month trend and request totals by status, for the browser's current month. */
export const usePayrollStats = () =>
  useQuery({
    queryKey: ["stats", "payroll"],
    queryFn: () => {
      const now = new Date();
      return http.get("/api/stats/payroll", { year: now.getFullYear(), month: now.getMonth() + 1 });
    },
  });

/** Admin: recent verification, role, salary, access and payment events. */
export const useActivity = () => useQuery({ queryKey: ["stats", "activity"], queryFn: () => http.get("/api/stats/activity") });

// Custom hook to fetch employee dashboard stats and recent activity
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "./useAuth";

export function useEmployeeDashboardStats() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeDashboardStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/stats/${user.email}`);
      return res.data;
    },
  });
}

export function useEmployeeRecentActivity() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeRecentActivity", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/recent-activity/${user.email}`);
      return res.data;
    },
  });
}
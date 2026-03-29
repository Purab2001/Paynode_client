// Custom hook to fetch employee dashboard stats and recent activity
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "./useAuth";

export function useEmployeeDashboardData() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeDashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/dashboard/${user.email}`);
      return res.data;
    },
  });
}

export function useEmployeeOverviewData() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeOverview", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/overview/${user.email}`);
      return res.data;
    },
  });
}
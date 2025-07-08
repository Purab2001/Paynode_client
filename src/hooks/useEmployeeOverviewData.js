// Custom hook to fetch employee overview metrics and work data
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "./useAuth";

export function useEmployeeOverviewMetrics() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeOverviewMetrics", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/work-summary/${user.email}`);
      return res.data;
    },
  });
}

export function useEmployeeRecentWork() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["employeeRecentWork", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/recent-work/${user.email}`);
      return res.data;
    },
  });
}
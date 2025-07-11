import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import useUserRole from "../../hooks/useUserRole";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  useEmployeeOverviewMetrics,
  useEmployeeRecentWork,
} from "../../hooks/useEmployeeOverviewData";
import AdminOverview from "./Admin/AdminOverview";
import EmployeeOverview from "./Employee/EmployeeOverview";
import HROverview from "./HR/HROverview";

const Overview = () => {
  const { role, roleLoading } = useUserRole();
  const { loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Employee hooks
  const { data: metrics, isLoading: metricsLoading } =
    useEmployeeOverviewMetrics();
  const { data: recentWork, isLoading: workLoading } = useEmployeeRecentWork();

  // Admin & HR hooks
  const { data: orgStats, isLoading: orgStatsLoading } = useQuery({
    queryKey: ["orgOverviewStats", role],
    enabled:
      (role === "admin" || role === "HR") && !authLoading && !roleLoading,
    queryFn: async () => {
      const endpoint =
        role === "admin"
          ? "/api/admin/dashboard-stats"
          : "/api/hr/dashboard-stats";
      const res = await axiosSecure.get(endpoint);
      return res.data;
    },
  });

  const { data: orgPayrolls, isLoading: orgPayrollsLoading } = useQuery({
    queryKey: ["orgPayrollsOverview", role],
    enabled:
      (role === "admin" || role === "HR") && !authLoading && !roleLoading,
    queryFn: async () => {
      const endpoint =
        role === "admin"
          ? "/api/admin/payroll/requests?all=true"
          : "/api/payroll/pending";
      const res = await axiosSecure.get(endpoint);
      return res.data.requests || [];
    },
  });

  // HR: Prepare chart data
  const payrollBarData = React.useMemo(() => {
    if (!orgPayrolls) return { labels: [], datasets: [] };
    // Group by month/year
    const map = {};
    orgPayrolls.forEach((p) => {
      const key = `${p.month} ${p.year}`;
      map[key] = (map[key] || 0) + 1;
    });
    const labels = Object.keys(map);
    return {
      labels,
      datasets: [
        {
          label: "Payroll Requests",
          data: labels.map((l) => map[l]),
          backgroundColor: "#6366f1",
        },
      ],
    };
  }, [orgPayrolls]);

  // Payroll status filtering for admin/HR overview
  const pendingPayrolls = orgPayrolls?.filter(p => p.status === "pending") ?? [];
  const approvedPayrolls = orgPayrolls?.filter(p => p.status === "approved") ?? [];

  const verificationPieData = React.useMemo(() => {
    if (!orgStats) return { labels: [], datasets: [] };
    return {
      labels: ["Verified", "Unverified"],
      datasets: [
        {
          data: [
            orgStats.verifiedEmployees ?? 0,
            orgStats.unverifiedEmployees ?? 0,
          ],
          backgroundColor: ["#10b981", "#f59e42"],
        },
      ],
    };
  }, [orgStats]);

  // Wait for auth and role to load before rendering
  if (authLoading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-blue-600 text-lg font-semibold">
            Loading overview...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {role === "admin" && (
        <AdminOverview
          orgStats={orgStats}
          orgPayrolls={orgPayrolls}
          orgStatsLoading={orgStatsLoading}
          orgPayrollsLoading={orgPayrollsLoading}
          payrollBarData={payrollBarData}
          verificationPieData={verificationPieData}
          pendingPayrolls={pendingPayrolls}
          approvedPayrolls={approvedPayrolls}
        />
      )}
      {role === "HR" && (
        <HROverview
          orgStats={orgStats}
          orgPayrolls={orgPayrolls}
          orgStatsLoading={orgStatsLoading}
          orgPayrollsLoading={orgPayrollsLoading}
          payrollBarData={payrollBarData}
          verificationPieData={verificationPieData}
          pendingPayrolls={pendingPayrolls}
        />
      )}
      {role === "Employee" && (
        <EmployeeOverview
          metrics={metrics}
          metricsLoading={metricsLoading}
          recentWork={recentWork}
          workLoading={workLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Overview;

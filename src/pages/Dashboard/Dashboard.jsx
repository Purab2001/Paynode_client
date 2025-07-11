import React from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEmployeeDashboardStats, useEmployeeRecentActivity } from "../../hooks/useEmployeeDashboardData";
import useUserRole from "../../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AdminDashboard from "./Admin/AdminDashboard";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import HRDashboard from "./HR/HRDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, roleLoading } = useUserRole();

  // Employee hooks
  const { data: stats, isLoading: statsLoading } = useEmployeeDashboardStats();
  const { data: activity, isLoading: activityLoading } = useEmployeeRecentActivity();

  // Admin & HR hooks
  const axiosSecure = useAxiosSecure();
  const { data: adminStats, isLoading: adminStatsLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    enabled: role === "admin" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/dashboard-stats");
      return res.data;
    },
  });

  const { data: adminPayrolls, isLoading: adminPayrollsLoading } = useQuery({
    queryKey: ["adminPayrollsOverview"],
    enabled: role === "admin" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/payroll/requests?all=true");
      return res.data.requests || [];
    },
  });

  const { data: hrStats, isLoading: hrStatsLoading } = useQuery({
    queryKey: ["hrDashboardStats"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/hr/dashboard-stats");
      return res.data;
    },
  });

  const { data: hrPayrolls, isLoading: hrPayrollsLoading } = useQuery({
    queryKey: ["hrRecentPayrolls"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/payroll/pending");
      return res.data.requests || [];
    },
  });

  // Payroll status filtering for admin
  const pendingAdminPayrolls = adminPayrolls?.filter(p => p.status === "pending") ?? [];
  const approvedAdminPayrolls = adminPayrolls?.filter(p => p.status === "approved") ?? [];

  // Show loading spinner until auth and role are loaded
  if (authLoading || roleLoading) {
    return null;
  }

  // Show nested content if on a sub-route
  if (location.pathname !== "/dashboard") {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {role === "admin" && (
        <AdminDashboard
          user={user}
          adminStats={adminStats}
          adminStatsLoading={adminStatsLoading}
          adminPayrolls={adminPayrolls}
          adminPayrollsLoading={adminPayrollsLoading}
          pendingAdminPayrolls={pendingAdminPayrolls}
          approvedAdminPayrolls={approvedAdminPayrolls}
          navigate={navigate}
        />
      )}
      {role === "HR" && (
        <HRDashboard
          user={user}
          hrStats={hrStats}
          hrStatsLoading={hrStatsLoading}
          hrPayrolls={hrPayrolls}
          hrPayrollsLoading={hrPayrollsLoading}
          navigate={navigate}
        />
      )}
      {role === "Employee" && (
        <EmployeeDashboard
          user={user}
          stats={stats}
          statsLoading={statsLoading}
          activity={activity}
          activityLoading={activityLoading}
          navigate={navigate}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

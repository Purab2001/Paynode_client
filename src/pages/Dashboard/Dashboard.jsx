import React from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProfileImage from "../../ui/ProfileImage";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEmployeeDashboardStats, useEmployeeRecentActivity } from "../../hooks/useEmployeeDashboardData";
import useUserRole from "../../hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, roleLoading } = useUserRole();
  const { data: stats, isLoading: statsLoading } = useEmployeeDashboardStats();
  const { data: activity, isLoading: activityLoading } = useEmployeeRecentActivity();
  const axiosSecure = useAxiosSecure();

  // HR stats
  const { data: hrStats, isLoading: hrStatsLoading } = useQuery({
    queryKey: ["hrDashboardStats"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/hr/dashboard-stats");
      return res.data;
    },
  });

  // HR recent payrolls
  const { data: hrPayrolls, isLoading: hrPayrollsLoading } = useQuery({
    queryKey: ["hrRecentPayrolls"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/payroll/pending");
      return res.data.requests || [];
    },
  });

  // Show loading spinner until auth and role are loaded
  // (Handled by PrivateRoute, so skip here)
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
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.displayName || "User"}!
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500">
              <ProfileImage user={user} size={64} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.displayName || "User"}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-50/80 rounded-full mt-1">
                {roleLoading ? "..." : role}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Cards */}
        {role === "HR" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Total Employees</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.totalEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Active Employees</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Verified</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.verifiedEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Verified Employees</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Unverified</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.unverifiedEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Unverified Employees</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Pending Payrolls</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {hrPayrollsLoading ? "..." : hrPayrolls?.length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Awaiting Approval</p>
            </div>
          </div>
        ) : (
          // Employee stats
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">This Month</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {statsLoading ? "..." : stats?.hoursThisMonth ?? 0}
              </p>
              <p className="text-sm text-gray-500">Hours Worked</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Entries</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {statsLoading ? "..." : stats?.entriesThisMonth ?? 0}
              </p>
              <p className="text-sm text-gray-500">Work Entries</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Last Payment</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {statsLoading ? "..." : stats?.lastPaymentAmount ? `৳${stats.lastPaymentAmount}` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {statsLoading ? "" : stats?.lastPaymentDate ? `on ${stats.lastPaymentDate}` : ""}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {statsLoading ? "..." : stats?.pendingTasks ?? 0}
              </p>
              <p className="text-sm text-gray-500">To Complete</p>
            </div>
          </div>
        )}

        {/* Action Cards */}
        {role === "HR" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <button
              className="bg-blue-100 hover:bg-blue-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/employees")}
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="font-medium text-gray-900">Employee List</span>
              <span className="text-sm text-gray-500 mt-1">Manage employees</span>
            </button>
            <button
              className="bg-purple-100 hover:bg-purple-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/progress")}
            >
              <span className="text-2xl mb-2">📈</span>
              <span className="font-medium text-gray-900">Progress</span>
              <span className="text-sm text-gray-500 mt-1">View work records</span>
            </button>
            <button
              className="bg-green-100 hover:bg-green-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="font-medium text-gray-900">Profile</span>
              <span className="text-sm text-gray-500 mt-1">Manage your profile</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <button
              className="bg-blue-100 hover:bg-blue-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/work-sheet")}
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="font-medium text-gray-900">Work Sheet</span>
              <span className="text-sm text-gray-500 mt-1">Add/View your work entries</span>
            </button>
            <button
              className="bg-green-100 hover:bg-green-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/payment-history")}
            >
              <span className="text-2xl mb-2">💸</span>
              <span className="font-medium text-gray-900">Payment History</span>
              <span className="text-sm text-gray-500 mt-1">View your salary records</span>
            </button>
            <button
              className="bg-purple-100 hover:bg-purple-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="font-medium text-gray-900">Profile</span>
              <span className="text-sm text-gray-500 mt-1">Manage your profile</span>
            </button>
          </div>
        )}

        {/* Recent Activity / Payrolls */}
        {role === "HR" ? (
          <div className="mt-8 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Payroll Requests
              </h3>
            </div>
            <div className="p-6">
              {hrPayrollsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : hrPayrolls && hrPayrolls.length > 0 ? (
                <ul className="space-y-4">
                  {hrPayrolls.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-xl">💸</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.employeeName} ({item.employeeEmail})
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.month} {item.year} - ৳{item.salary}
                        </p>
                        <p className="text-xs text-gray-400">
                          Requested by: {item.requestedBy} on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent payroll requests to display.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {activityLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : activity && activity.length > 0 ? (
                <ul className="space-y-4">
                  {activity.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon || "•"}</span>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity to display.</p>
                  <p className="text-sm mt-1">
                    Your activities will appear here once you start using the
                    system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

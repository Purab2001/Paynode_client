import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEmployeeOverviewMetrics, useEmployeeRecentWork } from "../../hooks/useEmployeeOverviewData";
import useUserRole from "../../hooks/useUserRole";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const Overview = () => {
  const { role, roleLoading } = useUserRole();
  const { loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Employee hooks
  const { data: metrics, isLoading: metricsLoading } = useEmployeeOverviewMetrics();
  const { data: recentWork, isLoading: workLoading } = useEmployeeRecentWork();

  // HR hooks
  const { data: hrStats, isLoading: hrStatsLoading } = useQuery({
    queryKey: ["hrOverviewStats"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/hr/dashboard-stats");
      return res.data;
    },
  });

  const { data: hrPayrolls, isLoading: hrPayrollsLoading } = useQuery({
    queryKey: ["hrPayrollsOverview"],
    enabled: role === "HR" && !authLoading && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/payroll/pending");
      return res.data.requests || [];
    },
  });

  // HR: Prepare chart data
  const payrollBarData = React.useMemo(() => {
    if (!hrPayrolls) return { labels: [], datasets: [] };
    // Group by month/year
    const map = {};
    hrPayrolls.forEach((p) => {
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
  }, [hrPayrolls]);

  const verificationPieData = React.useMemo(() => {
    if (!hrStats) return { labels: [], datasets: [] };
    return {
      labels: ["Verified", "Unverified"],
      datasets: [
        {
          data: [hrStats.verifiedEmployees ?? 0, hrStats.unverifiedEmployees ?? 0],
          backgroundColor: ["#10b981", "#f59e42"],
        },
      ],
    };
  }, [hrStats]);

  // Wait for auth and role to load before rendering
  if (authLoading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-blue-600 text-lg font-semibold">Loading overview...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="mt-2 text-gray-600">
            {role === "HR"
              ? "Organization-wide payroll and employee stats"
              : "Get a comprehensive view of your work performance and statistics"}
          </p>
        </div>

        {/* Dynamic Stats */}
        {role === "HR" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Total Employees</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.totalEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Active Employees</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Verified</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.verifiedEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Verified Employees</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Unverified</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {hrStatsLoading ? "..." : hrStats?.unverifiedEmployees ?? 0}
              </p>
              <p className="text-sm text-gray-500">Unverified Employees</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Pending Payrolls</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {hrPayrollsLoading ? "..." : hrPayrolls?.length ?? 0}
              </p>
              <p className="text-sm text-gray-500">Awaiting Approval</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {metricsLoading ? "..." : metrics?.hoursThisWeek ?? 0}
              </p>
              <p className="text-sm text-gray-500">Hours Worked</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {metricsLoading ? "..." : metrics?.hoursThisMonth ?? 0}
              </p>
              <p className="text-sm text-gray-500">Hours Worked</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Tasks Completed</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {metricsLoading ? "..." : metrics?.tasksCompleted ?? 0}
              </p>
              <p className="text-sm text-gray-500">Work Entries</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Efficiency</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {metricsLoading ? "..." : metrics?.efficiency ?? "N/A"}
              </p>
              <p className="text-sm text-gray-500">Task Completion</p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {role === "HR" ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payroll Requests by Month
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <Bar data={payrollBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Employee Verification Status
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <Pie data={verificationPieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Weekly Progress
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  {/* Placeholder for weekly progress chart */}
                  <p>Chart will display weekly work hours (integrate chart library)</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Task Distribution
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  {/* Placeholder for task distribution pie chart */}
                  <p>Chart will display task types breakdown (integrate chart library)</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Work / Payrolls */}
        {role === "HR" ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Payroll Requests
            </h2>
            <div className="space-y-4">
              {hrPayrollsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : hrPayrolls && hrPayrolls.length > 0 ? (
                hrPayrolls.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.employeeName}</h3>
                      <p className="text-sm text-gray-500">
                        {item.month} {item.year} - ৳{item.salary}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{item.status}</p>
                      <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent payroll requests to display.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Work
            </h2>
            <div className="space-y-4">
              {workLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentWork && recentWork.length > 0 ? (
                recentWork.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{entry.task}</h3>
                      <p className="text-sm text-gray-500">
                        {entry.description || entry.details}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{entry.status}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent work entries to display.</p>
                  <p className="text-sm mt-1">
                    Your recent work will appear here once you start using the system.
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

export default Overview;

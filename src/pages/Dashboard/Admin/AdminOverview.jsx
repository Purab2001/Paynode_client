import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const AdminOverview = ({
  orgStats,
  orgPayrolls,
  orgStatsLoading,
  orgPayrollsLoading,
  payrollBarData,
  verificationPieData,
  pendingPayrolls,
  approvedPayrolls,
}) => {
  // Create chart options with dark mode support
  const isDark = document.documentElement.classList.contains("dark");

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: isDark ? "#f3f4f6" : "#374151",
        bodyColor: isDark ? "#f3f4f6" : "#374151",
        backgroundColor: isDark ? "#374151" : "#ffffff",
        borderColor: isDark ? "#6b7280" : "#d1d5db",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#d1d5db" : "#374151",
        },
        grid: {
          color: isDark ? "#4b5563" : "#e5e7eb",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#d1d5db" : "#374151",
        },
        grid: {
          color: isDark ? "#4b5563" : "#e5e7eb",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#d1d5db" : "#374151",
        },
      },
      tooltip: {
        titleColor: isDark ? "#f3f4f6" : "#374151",
        bodyColor: isDark ? "#f3f4f6" : "#374151",
        backgroundColor: isDark ? "#374151" : "#ffffff",
        borderColor: isDark ? "#6b7280" : "#d1d5db",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Overview
          <span className="ml-3 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
            ADMIN
          </span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Overview of organization-wide payroll, employee stats, and admin
          actions.
        </p>
      </div>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Employees
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.totalEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Active Employees
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verified
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.verifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Verified Employees
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unverified
          </h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.unverifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unverified Employees
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Payrolls
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {orgPayrollsLoading ? "..." : pendingPayrolls.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Awaiting Approval
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Approved Payrolls
          </h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">
            {orgPayrollsLoading ? "..." : approvedPayrolls.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Approved Payments
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Payroll Requests by Month
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <Bar data={payrollBarData} options={barChartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Employee Verification Status
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <Pie data={verificationPieData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Payrolls */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Payroll Requests
        </h2>
        <div className="space-y-4">
          {orgPayrollsLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              Loading...
            </div>
          ) : orgPayrolls && orgPayrolls.length > 0 ? (
            orgPayrolls.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.employeeName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.month} {item.year} - ৳{item.salary}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {item.status}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <p>No recent payroll requests to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

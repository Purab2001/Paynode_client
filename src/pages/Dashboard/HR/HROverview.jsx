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

const HROverview = ({
  orgStats,
  orgPayrolls,
  orgStatsLoading,
  orgPayrollsLoading,
  payrollBarData,
  verificationPieData,
  pendingPayrolls,
  approvedPayrolls,
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">HR Overview</h1>
        <p className="mt-2 text-gray-600">
          Organization-wide payroll and employee stats
        </p>
      </div>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">
            Total Employees
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.totalEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-500">Active Employees</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Verified</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.verifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-500">Verified Employees</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">
            Unverified
          </h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {orgStatsLoading ? "..." : orgStats?.unverifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-500">Unverified Employees</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Payrolls
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {orgPayrollsLoading ? "..." : pendingPayrolls.length}
          </p>
          <p className="text-sm text-gray-500">Awaiting Approval</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">
            Approved Payrolls
          </h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">
            {orgPayrollsLoading ? "..." : approvedPayrolls.length}
          </p>
          <p className="text-sm text-gray-500">Approved Payments</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payroll Requests by Month
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Bar
              data={payrollBarData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Employee Verification Status
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Pie
              data={verificationPieData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Payrolls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Payroll Requests
        </h2>
        <div className="space-y-4">
          {orgPayrollsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : orgPayrolls && orgPayrolls.length > 0 ? (
            orgPayrolls.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {item.employeeName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.month} {item.year} - ৳{item.salary}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {item.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
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
    </div>
  );
};

export default HROverview;
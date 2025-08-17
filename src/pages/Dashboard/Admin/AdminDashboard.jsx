import React from "react";
import ProfileImage from "../../../ui/ProfileImage";
import { useNavigate } from "react-router";

const AdminDashboard = ({
  user,
  adminStats,
  adminStatsLoading,
  adminPayrolls,
  adminPayrollsLoading,
  pendingAdminPayrolls,
  approvedAdminPayrolls,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Welcome back, {user?.displayName || "User"}!
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500">
            <ProfileImage user={user} size={64} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.displayName || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-50/80 dark:bg-dark-200 rounded-full mt-1">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {adminStatsLoading ? "..." : adminStats?.totalEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Active Employees</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Verified</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {adminStatsLoading ? "..." : adminStats?.verifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Verified Employees</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unverified</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {adminStatsLoading ? "..." : adminStats?.unverifiedEmployees ?? 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Unverified Employees</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pending Payrolls
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {adminPayrollsLoading ? "..." : pendingAdminPayrolls.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Awaiting Approval</p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Approved Payrolls
          </h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">
            {adminPayrollsLoading ? "..." : approvedAdminPayrolls.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Approved Payments</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <button
          className="bg-blue-100 hover:bg-blue-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/admin/all-employee-list")}
        >
          <span className="text-2xl mb-2">👥</span>
          <span className="font-medium text-gray-900">Employee List</span>
          <span className="text-sm text-gray-600 mt-1">Manage employees</span>
        </button>
        <button
          className="bg-purple-100 hover:bg-purple-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/admin/payroll")}
        >
          <span className="text-2xl mb-2">💸</span>
          <span className="font-medium text-gray-900">Payroll</span>
          <span className="text-sm text-gray-600 mt-1">Approve payrolls</span>
        </button>
        <button
          className="bg-green-100 hover:bg-green-200 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <span className="text-2xl mb-2">👤</span>
          <span className="font-medium text-gray-900">Profile</span>
          <span className="text-sm text-gray-600 mt-1">
            Manage your profile
          </span>
        </button>
      </div>

      {/* Recent Payrolls */}
      <div className="mt-8 bg-white dark:bg-dark-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Payroll Requests
          </h3>
        </div>
        <div className="p-6">
          {adminPayrollsLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading...</div>
          ) : adminPayrolls && adminPayrolls.length > 0 ? (
            <ul className="space-y-4">
              {adminPayrolls.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-xl">💸</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white break-all text-sm md:text-base">
                      {item.employeeName}{" "}
                      <span className="text-gray-600 dark:text-gray-300">
                        ({item.employeeEmail})
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.month} {item.year} - ৳{item.salary}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested by: {item.requestedBy} on{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      Status: {item.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
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

export default AdminDashboard;
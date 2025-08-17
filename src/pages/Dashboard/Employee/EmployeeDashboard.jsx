import React from "react";
import ProfileImage from "../../../ui/ProfileImage";
import { useNavigate } from "react-router";

const EmployeeDashboard = ({
  user,
  stats,
  statsLoading,
  activity,
  activityLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
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
            <p className="text-gray-600 dark:text-gray-300 break-all">
              {user?.email}
            </p>
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-50/80 dark:bg-dark-200 rounded-full mt-1">
              EMPLOYEE
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            This Month
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {statsLoading ? "..." : stats?.hoursThisMonth ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Hours Worked
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Entries
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {statsLoading ? "..." : stats?.entriesThisMonth ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Work Entries
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Last Payment
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {statsLoading
              ? "..."
              : stats?.lastPaymentAmount
              ? `৳${stats.lastPaymentAmount}`
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {statsLoading
              ? ""
              : stats?.lastPaymentDate
              ? `on ${stats.lastPaymentDate}`
              : ""}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pending Tasks
          </h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {statsLoading ? "..." : stats?.pendingTasks ?? 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            To Complete
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <button
          className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/work-sheet")}
        >
          <span className="text-2xl mb-2">📝</span>
          <span className="font-medium text-gray-900 dark:text-white">
            Work Sheet
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Add/View your work entries
          </span>
        </button>
        <button
          className="bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/payment-history")}
        >
          <span className="text-2xl mb-2">💸</span>
          <span className="font-medium text-gray-900 dark:text-white">
            Payment History
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            View your salary records
          </span>
        </button>
        <button
          className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded-lg shadow-md p-6 flex flex-col items-center transition cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <span className="text-2xl mb-2">👤</span>
          <span className="font-medium text-gray-900 dark:text-white">
            Profile
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Manage your profile
          </span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-dark-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          {activityLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-300">
              Loading...
            </div>
          ) : activity && activity.length > 0 ? (
            <ul className="space-y-4">
              {activity.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon || "•"}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-300">
              <p>No recent activity to display.</p>
              <p className="text-sm mt-1">
                Your activities will appear here once you start using the
                system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

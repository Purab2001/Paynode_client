import React from "react";

const EmployeeOverview = ({ metrics, metricsLoading, recentWork, workLoading }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="mt-2 text-gray-600">
          Get a comprehensive view of your work performance and statistics
        </p>
      </div>

      {/* Dynamic Stats */}
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
          <h3 className="text-lg font-semibold text-gray-900">
            Tasks Completed
          </h3>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Weekly Progress
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Placeholder for weekly progress chart */}
            <p>
              Chart will display weekly work hours (integrate chart library)
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Task Distribution
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Placeholder for task distribution pie chart */}
            <p>
              Chart will display task types breakdown (integrate chart library)
            </p>
          </div>
        </div>
      </div>

      {/* Recent Work */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Work
        </h2>
        <div className="space-y-4">
          {workLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentWork && recentWork.length > 0 ? (
            recentWork.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{entry.task}</h3>
                  <p className="text-sm text-gray-500">
                    {entry.description || entry.details}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {entry.status}
                  </p>
                  <p className="text-xs text-gray-500">{entry.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent work entries to display.</p>
              <p className="text-sm mt-1">
                Your recent work will appear here once you start using the
                system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverview;
import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Overview = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="mt-2 text-gray-600">
            Get a comprehensive view of your work performance and statistics
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">40</p>
            <p className="text-sm text-gray-500">Hours Worked</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">168</p>
            <p className="text-sm text-gray-500">Hours Worked</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
            <p className="text-sm text-gray-500">Active Projects</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Efficiency</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">94%</p>
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
              <p>Chart placeholder - Weekly progress visualization</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Project Distribution
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Chart placeholder - Project distribution pie chart</p>
            </div>
          </div>
        </div>

        {/* Recent Work */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Work
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">
                  Website Development
                </h3>
                <p className="text-sm text-gray-500">
                  Frontend optimization and bug fixes
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">
                  Database Migration
                </h3>
                <p className="text-sm text-gray-500">
                  Moving data to new server infrastructure
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-xs text-gray-500">Due: Tomorrow</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">API Documentation</h3>
                <p className="text-sm text-gray-500">
                  Update API endpoints documentation
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-600">Pending</p>
                <p className="text-xs text-gray-500">Due: Next Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;

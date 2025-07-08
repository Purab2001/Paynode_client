import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            View comprehensive reports and analytics for employee management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Employee Stats
              </h3>
              <div className="text-blue-600 text-2xl">👥</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <p className="text-gray-600 text-sm">Total Employees</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Active Projects
              </h3>
              <div className="text-green-600 text-2xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <p className="text-gray-600 text-sm">Ongoing Projects</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Payments
              </h3>
              <div className="text-purple-600 text-2xl">💰</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$0</div>
            <p className="text-gray-600 text-sm">This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Report Generator
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Advanced Reporting System
            </h3>
            <p className="text-gray-600 mb-6">
              Generate detailed reports on employee performance, attendance, and
              payroll.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">
                  Performance Reports
                </h4>
                <p className="text-blue-700 text-sm">
                  Track employee productivity
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900">
                  Attendance Reports
                </h4>
                <p className="text-green-700 text-sm">
                  Monitor work hours and leaves
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900">
                  Payroll Reports
                </h4>
                <p className="text-purple-700 text-sm">
                  Comprehensive salary breakdowns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

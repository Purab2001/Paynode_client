import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Employees = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage employee information, roles, and permissions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              All Employees
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Employee
            </button>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Employee Management System
            </h3>
            <p className="text-gray-600 mb-6">
              This section will display all employees and allow HR to manage
              their information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">View Employees</h4>
                <p className="text-blue-700 text-sm">
                  Browse all employee profiles
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900">Add/Edit</h4>
                <p className="text-green-700 text-sm">
                  Manage employee information
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900">Roles</h4>
                <p className="text-purple-700 text-sm">
                  Assign roles and permissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;

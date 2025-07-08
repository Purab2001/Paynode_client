import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure system-wide settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                General Settings
              </h3>
              <p className="text-gray-600 text-sm">
                Basic system configuration
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    System Notifications
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Enable system-wide notifications
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto Backup</h4>
                  <p className="text-gray-600 text-sm">
                    Automatically backup data daily
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                User Management
              </h3>
              <p className="text-gray-600 text-sm">
                Configure user access and permissions
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Allow User Registration
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Allow new users to register
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Require Email Verification
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Users must verify email before access
                  </p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                System Information
              </h3>
              <p className="text-gray-600 text-sm">
                Current system status and information
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Application Version
                  </h4>
                  <p className="text-gray-600">v1.0.0</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Database Status
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Last Backup
                  </h4>
                  <p className="text-gray-600">Never</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Total Users
                  </h4>
                  <p className="text-gray-600">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow border-red-200 border">
            <div className="px-6 py-4 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-800">
                Danger Zone
              </h3>
              <p className="text-red-600 text-sm">
                Irreversible and destructive actions
              </p>
            </div>
            <div className="p-6">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

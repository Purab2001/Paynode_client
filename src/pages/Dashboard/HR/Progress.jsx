// Progress.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Select, Option } from "@material-tailwind/react";
import useUserRole from "../../../hooks/useUserRole";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ProgressTable from "./ProgressTable";

const Progress = () => {
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Fetch all employees for dropdown
  const { data: employeesRaw } = useQuery({
    queryKey: ["employeeDropdown"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/employee/all");
      return res.data.employees || [];
    },
  });

  // Only show employees (not HR/Admin) in dropdown
  const employees = (employeesRaw || []).filter(
    (emp) => emp.role === "Employee"
  );

  // Fetch all work records, filtered
  const { data: workRecords, isLoading } = useQuery({
    queryKey: ["workRecords", selectedEmployee, selectedMonth],
    queryFn: async () => {
      const params = {};
      if (selectedEmployee) params.employee = selectedEmployee;
      if (selectedMonth) params.month = selectedMonth;
      const res = await axiosSecure.get("/api/worksheets/all", { params });
      return res.data.worksheets || [];
    },
  });

  // Get unique months from work records
  const months = React.useMemo(() => {
    if (!workRecords) return [];
    const set = new Set(workRecords.map((w) => w.date?.slice(0, 7)));
    return Array.from(set).filter(Boolean);
  }, [workRecords]);

  if (roleLoading)
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  if (role !== "HR")
    return (
      <DashboardLayout>
        <div>Access denied</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Progress</h1>
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <div className="flex-1">
            <Select
              label="Employee"
              value={selectedEmployee || ""}
              onChange={(val) => setSelectedEmployee(val || "")}
            >
              <Option value="">All Employees</Option>
              {employees.map((emp) => (
                <Option key={emp.email} value={emp.email}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <Select
              label="Month"
              value={selectedMonth || ""}
              onChange={(val) => setSelectedMonth(val || "")}
            >
              <Option value="">All Months</Option>
              {months.map((month) => (
                <Option key={month} value={month}>
                  {month}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <ProgressTable data={workRecords || []} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default Progress;

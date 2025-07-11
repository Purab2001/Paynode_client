import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DashboardLayout from "../../../layouts/DashboardLayout";
import AdminEmployeeTable from "./AdminEmployeeTable";
import AdminEmployeeCardGrid from "./AdminEmployeeCardGrid"; // Import the new component
import { toast } from "react-hot-toast";
import { Button } from "@material-tailwind/react";
import { FaThLarge, FaList } from "react-icons/fa";

const AllEmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "card" : "table"));
  };

  // Fetch all employees and HRs
  const { data, isLoading } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/employees");
      return res.data.employees;
    },
  });

  // Verify/unverify employee or HR
  const verifyMutation = useMutation({
    mutationFn: async ({ email, isVerified }) => {
      await axiosSecure.put(`/api/employee/${email}/verify`, { isVerified });
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-employees"]),
  });

  // Fire employee or HR
  const fireMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.put(`/api/admin/employees/${email}/fire`);
    },
    onSuccess: (_data, email) => {
      queryClient.invalidateQueries(["admin-employees"]);
      toast.success(`Fired ${email}`);
    },
  });

  // Promote to HR
  const promoteMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.put(`/api/admin/employees/${email}/promote`);
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-employees"]),
  });

  // Salary change
  const salaryMutation = useMutation({
    mutationFn: async ({ email, salary }) => {
      // Fetch current employee data to validate salary increase
      const currentEmployee = data.find((emp) => emp.email === email);
      if (currentEmployee && salary <= currentEmployee.salary) {
        toast.error("New salary must be greater than current salary.");
        throw new Error("Salary cannot be decreased or remain the same.");
      }
      await axiosSecure.put(`/api/admin/employees/${email}/salary`, { salary });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-employees"]);
      toast.success("Salary updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update salary.");
    },
  });

  // Demote HR to Employee
  const demoteMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.put(`/api/admin/employees/${email}/demote`);
    },
    onSuccess: (_data, email) => {
      queryClient.invalidateQueries(["admin-employees"]);
      toast.success(`Rehired ${email}`);
    },
  });

  // Rehire fired employee or HR
  const rehireMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.put(`/api/admin/employees/${email}/rehire`);
      return email;
    },
    onSuccess: (email) => {
      queryClient.invalidateQueries(["admin-employees"]);
      toast.success(`Rehired ${email}`);
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">All Employees & HRs</h2>
          <Button
            onClick={toggleView}
            size="sm"
            color="blue"
            className="flex items-center gap-2"
          >
            {viewMode === "table" ? (
              <FaThLarge size={18} />
            ) : (
              <FaList size={18} />
            )}
          </Button>
        </div>
        {viewMode === "table" ? (
          <AdminEmployeeTable
            data={data || []}
            isLoading={isLoading}
            onVerify={verifyMutation.mutate}
            onFire={fireMutation.mutate}
            onPromote={promoteMutation.mutate}
            onDemote={demoteMutation.mutate}
            onRehire={rehireMutation.mutate}
            onSalaryChange={salaryMutation.mutate}
          />
        ) : (
          <AdminEmployeeCardGrid
            data={data || []}
            isLoading={isLoading}
            onVerify={verifyMutation.mutate}
            onFire={fireMutation.mutate}
            onPromote={promoteMutation.mutate}
            onDemote={demoteMutation.mutate}
            onRehire={rehireMutation.mutate}
            onSalaryChange={salaryMutation.mutate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllEmployeeList;

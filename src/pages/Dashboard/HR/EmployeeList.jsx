// EmployeeList.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import DashboardLayout from "../../../layouts/DashboardLayout";
import EmployeeTable from "./EmployeeTable";
import PayModal from "../../../components/PayModal";

const EmployeeList = () => {
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [payModal, setPayModal] = useState({ open: false, employee: null });

  // Fetch all employees (always call hooks at top level)
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    enabled: role === "HR" && !roleLoading,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/employee/all");
      return res.data.employees;
    },
  });

  // Toggle verification
  const verifyMutation = useMutation({
    mutationFn: async ({ email, isVerified }) => {
      await axiosSecure.put(`/api/employee/${email}/verify`, { isVerified });
    },
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  // Wait for role to load before rendering content
  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-blue-600 text-lg font-semibold">Loading employee list...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== "HR") return <DashboardLayout><div>Access denied</div></DashboardLayout>;

  // Filter to show only employees (not HR)
  const employeeOnlyData = (data || []).filter(user => user.role === "Employee");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Employee List</h1>
        <EmployeeTable
          data={employeeOnlyData}
          isLoading={isLoading}
          onVerify={verifyMutation.mutate}
          onPay={(employee) => setPayModal({ open: true, employee })}
        />
        <PayModal
          open={payModal.open}
          employee={payModal.employee}
          onClose={() => setPayModal({ open: false, employee: null })}
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeList;

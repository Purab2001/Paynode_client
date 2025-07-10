import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DashboardLayout from "../../../layouts/DashboardLayout";
import DataLoader from "../../../ui/DataLoader";
import { Button } from "@material-tailwind/react";
import PaymentModal from "../../../components/PaymentModal";

const Payroll = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Filter state: "pending" or "approved"
  const [filterStatus, setFilterStatus] = useState("pending");

  // Fetch all payroll requests (pending and approved)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-payroll-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/admin/payroll/requests?all=true");
      return res.data.requests;
    },
  });

  // Approve payroll payment
  const payMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.put(`/api/admin/payroll/${id}/approve`, {
        processedBy: "admin",
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-payroll-requests"]),
  });

  if (isLoading) return <DataLoader label="Loading payroll requests..." />;

  if (!data?.length) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">Payroll Approval Requests</h2>
          <div className="flex gap-4 mb-4">
            <Button
              size="sm"
              color={filterStatus === "pending" ? "blue" : "gray"}
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              size="sm"
              color={filterStatus === "approved" ? "blue" : "gray"}
              onClick={() => setFilterStatus("approved")}
            >
              Approved
            </Button>
          </div>
          <div className="text-center py-6 text-gray-500">
            No payroll requests found.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Payroll Approval Requests</h2>
        <div className="flex gap-4 mb-4">
          <Button
            size="sm"
            color={filterStatus === "pending" ? "blue" : "gray"}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Button>
          <Button
            size="sm"
            color={filterStatus === "approved" ? "blue" : "gray"}
            onClick={() => setFilterStatus("approved")}
          >
            Approved
          </Button>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Salary</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Pay</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((req) => req.status === filterStatus)
                .map((req) => (
                  <tr key={req._id}>
                    <td className="py-3 px-4">{req.employeeName}</td>
                    <td className="py-3 px-4">{req.salary}</td>
                    <td className="py-3 px-4">{req.month}</td>
                    <td className="py-3 px-4">{req.year}</td>
                    <td className="py-3 px-4">
                      {req.status === "approved" && req.processedAt
                        ? new Date(req.processedAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        color={req.status === "pending" ? "green" : "gray"}
                        className="shadow-none"
                        onClick={() => {
                          if (req.status === "pending") {
                            setSelectedPayroll(req);
                            setModalOpen(true);
                          }
                        }}
                        disabled={req.status !== "pending" || payMutation.isLoading}
                      >
                        {req.status === "pending" ? "Pay" : "Paid"}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {data
            .filter((req) => req.status === filterStatus)
            .map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">
                      {req.employeeName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Salary: {req.salary}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Month: {req.month}, Year: {req.year}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Payment Date:{" "}
                      {req.status === "approved" && req.processedAt
                        ? new Date(req.processedAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {req.status === "pending" ? (
                      <Button
                        size="sm"
                        color="green"
                        className="shadow-none"
                        onClick={() => {
                          setSelectedPayroll(req);
                          setModalOpen(true);
                        }}
                        disabled={payMutation.isLoading}
                      >
                        Pay
                      </Button>
                    ) : (
                      <span className="text-green-600 font-bold">Paid</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        payrollData={selectedPayroll}
      />
    </DashboardLayout>
  );
};

export default Payroll;

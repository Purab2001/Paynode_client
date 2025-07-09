// PayModal.jsx
import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const PayModal = ({ open, employee, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const payrollMutation = useMutation({
    mutationFn: async (payload) => {
      await axiosSecure.post("/api/payroll/request", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["payroll"]);
      toast.success("Payroll request submitted!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to submit payroll request.");
    }
  });

  const handlePay = () => {
    if (!selectedMonth || !selectedYear) return;
    const loadingToast = toast.loading("Submitting payroll request...");
    payrollMutation.mutate(
      {
        employeeEmail: employee.email,
        employeeName: employee.name,
        salary: employee.salary,
        month: selectedMonth,
        year: selectedYear,
        requestedBy: "HR", // Replace with actual HR email if available
      },
      {
        onSettled: () => toast.dismiss(loadingToast)
      }
    );
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Payroll Approval Request</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Employee</label>
            <div className="font-semibold">{employee?.name} ({employee?.email})</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Salary</label>
            <Input value={employee?.salary || ""} readOnly />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium">Month</label>
              <Select
                label="Select Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
              >
                {months.map((month) => (
                  <Option key={month} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Year</label>
              <Select
                label="Select Year"
                value={selectedYear}
                onChange={setSelectedYear}
              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" className="mr-1" onClick={onClose}>Cancel</Button>
        <Button
          color="blue"
          onClick={handlePay}
          disabled={!selectedMonth || !selectedYear || payrollMutation.isLoading}
        >
          {payrollMutation.isLoading ? "Submitting..." : "Pay"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PayModal;
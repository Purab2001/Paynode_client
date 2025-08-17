// EmployeeDetails.jsx
import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardLayout from "../../../layouts/DashboardLayout";
import DataLoader from "../../../ui/DataLoader";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EmployeeDetails = () => {
  const { slug } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch employee details
  const { data: employeeData, isLoading: loadingEmployee } = useQuery({
    queryKey: ["employee", slug],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/employee/${slug}`);
      return res.data.user;
    },
  });

  // Fetch salary payments for last 12 months
  const {
    data: paymentsData,
    isLoading: loadingPayments,
    isError: paymentsError,
    error: paymentsErrorObj,
  } = useQuery({
    queryKey: ["payments", slug],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/api/payments/${slug}`);
        return res.data.payments || [];
      } catch (err) {
        if (err.response && err.response.status === 403) {
          // Forbidden: not allowed to see payment history
          return null;
        }
        throw err;
      }
    },
  });

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!paymentsData) return { labels: [], datasets: [] };
    // Sort and take last 12 months
    const sorted = [...paymentsData]
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .slice(-12);
    return {
      labels: sorted.map((p) => `${p.month}/${p.year}`),
      datasets: [
        {
          label: "Salary",
          data: sorted.map((p) => p.amount),
          backgroundColor: "#3B82F6",
        },
      ],
    };
  }, [paymentsData]);

  // Chart options
  const chartOptions = React.useMemo(() => {
    const isDark = document.documentElement.classList.contains("dark");

    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          titleColor: isDark ? "#f3f4f6" : "#374151",
          bodyColor: isDark ? "#f3f4f6" : "#374151",
          backgroundColor: isDark ? "#374151" : "#ffffff",
          borderColor: isDark ? "#6b7280" : "#d1d5db",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: isDark ? "#d1d5db" : "#374151",
          },
          grid: {
            color: isDark ? "#4b5563" : "#e5e7eb",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: isDark ? "#d1d5db" : "#374151",
          },
          grid: {
            color: isDark ? "#4b5563" : "#e5e7eb",
          },
        },
      },
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-2">
        {loadingEmployee ? (
          <DataLoader label="Loading employee details..." />
        ) : (
          <Card className="mb-6 dark:bg-dark-800">
            <CardBody>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={employeeData?.photo}
                  alt={employeeData?.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="text-center sm:text-left dark:text-gray-300">
                  <Typography variant="h4" className="break-words">
                    {employeeData?.name}
                  </Typography>
                  <Typography
                    color="gray"
                    className="break-words dark:text-gray-400"
                  >
                    {employeeData?.designation}
                  </Typography>
                  <Typography
                    color="gray"
                    className="break-words dark:text-gray-400"
                  >
                    {employeeData?.email}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        <Card className="dark:bg-dark-800">
          <CardBody>
            <Typography variant="h6" className="mb-4 dark:text-gray-300">
              Salary (Last 12 Months)
            </Typography>
            {loadingPayments ? (
              <DataLoader label="Loading chart..." />
            ) : paymentsError && paymentsErrorObj?.response?.status === 403 ? (
              <div className="text-center text-gray-600 dark:text-gray-300 py-4">
                You do not have permission to view payment history for this
                employee.
              </div>
            ) : paymentsData === null ? (
              <div className="text-center text-gray-600 dark:text-gray-300 py-4">
                No payment history available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetails;

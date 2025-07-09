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
  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments", slug],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/${slug}`);
      return res.data.payments || [];
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-2">
        {loadingEmployee ? (
          <DataLoader label="Loading employee details..." />
        ) : (
          <Card className="mb-6">
            <CardBody>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={employeeData?.photo}
                  alt={employeeData?.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="text-center sm:text-left">
                  <Typography variant="h4" className="break-words">
                    {employeeData?.name}
                  </Typography>
                  <Typography color="gray" className="break-words">
                    {employeeData?.designation}
                  </Typography>
                  <Typography color="gray" className="break-words">
                    {employeeData?.email}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
        <Card>
          <CardBody>
            <Typography variant="h6" className="mb-4">
              Salary (Last 12 Months)
            </Typography>
            {loadingPayments ? (
              <DataLoader label="Loading chart..." />
            ) : (
              <div className="overflow-x-auto">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetails;

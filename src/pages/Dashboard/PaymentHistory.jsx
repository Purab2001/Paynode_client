import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";

const PAGE_SIZE = 5;

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["payments", user?.email, page],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/payments/${user.email}/paginated?page=${page}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const payments = data?.payments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Month</th>
              <th className="py-2 px-4">Year</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((entry) => (
                <tr key={entry._id}>
                  <td className="py-2 px-4">{entry.month}</td>
                  <td className="py-2 px-4">{entry.year}</td>
                  <td className="py-2 px-4">{entry.amount}</td>
                  <td className="py-2 px-4">{entry.transactionId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded ${
                page === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistory;
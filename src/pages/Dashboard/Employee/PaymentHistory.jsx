import React, { useState, useMemo } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import DataLoader from "../../../ui/DataLoader";

const PAGE_SIZE = 5;

const PaymentHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);

  // Wait for auth to load before making API calls
  const { data, isLoading } = useQuery({
    queryKey: ["payments", user?.email, page],
    enabled: !!user?.email && !authLoading,
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

  // Table columns definition with dark theme support
  const columns = useMemo(
    () => [
      {
        header: "Month",
        accessorKey: "month",
        cell: (info) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Year",
        accessorKey: "year",
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-200">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-200">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Transaction ID",
        accessorKey: "transactionId",
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-200">
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Wait for auth to load before rendering content
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
            Loading payment history...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Payment History
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-dark-800 rounded shadow">
          {isLoading ? (
            <DataLoader className="py-8" label="Loading payment history..." />
          ) : !payments.length ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-300">
              No payment history found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-gray-50 dark:bg-dark-800 border-b dark:border-dark-600"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <DataLoader className="py-8" label="Loading payment history..." />
          ) : !payments.length ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-300">
              No payment history found.
            </div>
          ) : (
            payments.map((entry) => (
              <div
                key={entry._id}
                className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                      {entry.month} {entry.year}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                      Transaction ID: {entry.transactionId}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entry.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-dark-600 text-gray-900 dark:text-white disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded ${
                  page === idx + 1
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "bg-gray-200 dark:bg-dark-600 text-gray-900 dark:text-white"
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-dark-600 text-gray-900 dark:text-white disabled:opacity-50"
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

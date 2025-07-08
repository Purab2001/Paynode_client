
import React, { useState, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

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

  // Table columns definition (same as WorksheetTable style)
  const columns = useMemo(
    () => [
      {
        header: "Month",
        accessorKey: "month",
        cell: (info) => (
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        ),
      },
      {
        header: "Year",
        accessorKey: "year",
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
        ),
      },
      {
        header: "Transaction ID",
        accessorKey: "transactionId",
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
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


  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded shadow">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : !payments.length ? (
            <div className="text-center py-6 text-gray-500">No payment history found.</div>
          ) : (
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-50 border-b">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider"
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
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : !payments.length ? (
            <div className="text-center py-6 text-gray-500">No payment history found.</div>
          ) : (
            payments.map((entry) => (
              <div
                key={entry._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">
                      {entry.month} {entry.year}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Transaction ID: {entry.transactionId}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="font-medium text-gray-900">{entry.amount}</span>
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
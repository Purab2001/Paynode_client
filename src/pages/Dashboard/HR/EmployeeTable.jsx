import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button, Switch } from "@material-tailwind/react";
import { Link } from "react-router";
import DataLoader from "../../../ui/DataLoader";

const EmployeeTable = ({ data, isLoading, onVerify, onPay }) => {
  // Table columns for desktop
  const columns = React.useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Email", accessorKey: "email" },
      {
        header: "Verified",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isVerified}
            onChange={() =>
              onVerify({
                email: row.original.email,
                isVerified: !row.original.isVerified,
              })
            }
            color={row.original.isVerified ? "green" : "red"}
          />
        ),
      },
      { header: "Bank Account", accessorKey: "bank_account_no" },
      { header: "Salary", accessorKey: "salary" },
      {
        header: "Pay",
        cell: ({ row }) => (
          <Button
            size="sm"
            color="blue"
            className="shadow-none"
            disabled={!row.original.isVerified}
            onClick={() => onPay(row.original)}
          >
            Pay
          </Button>
        ),
      },
      {
        header: "Details",
        cell: ({ row }) => (
          <Link
            to={`/details/${row.original.email}`}
            className="text-blue-600 dark:text-blue-400 underline"
          >
            View
          </Link>
        ),
      },
    ],
    [onVerify, onPay]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <DataLoader className="py-8" />;
  }

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-300">
        No employees found.
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-dark-800 border-b"
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
                  <td
                    key={cell.id}
                    className="py-3 px-4 text-sm break-all text-gray-900 dark:text-gray-200"
                  >
                    {flexRender(
                      cell.column.columnDef.cell ??
                        cell.column.columnDef.accessorKey,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {data.map((entry) => (
          <div
            key={entry.email}
            className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                  {entry.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 break-all">
                  {entry.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Bank: {entry.bank_account_no}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Salary: {entry.salary}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={entry.isVerified}
                  onChange={() =>
                    onVerify({
                      email: entry.email,
                      isVerified: !entry.isVerified,
                    })
                  }
                  color={entry.isVerified ? "green" : "red"}
                />
                <Button
                  size="sm"
                  color="blue"
                  className="shadow-none"
                  disabled={!entry.isVerified}
                  onClick={() => onPay(entry)}
                >
                  Pay
                </Button>
                <Link
                  to={`/details/${entry.email}`}
                  className="text-blue-600 dark:text-blue-400 underline text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeTable;

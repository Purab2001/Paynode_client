import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@material-tailwind/react";
import DataLoader from "../../../ui/DataLoader";

const ProgressTable = ({ data, isLoading }) => {
  // Table columns for desktop
  const columns = React.useMemo(
    () => [
      { header: "Employee", accessorKey: "employeeEmail" },
      { header: "Task", accessorKey: "task" },
      { header: "Hours", accessorKey: "hoursWorked" },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => (
          <span>{row.original.date ? row.original.date.slice(0, 10) : ""}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <span>{row.original.status || "Completed"}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <DataLoader className="py-8" label="Loading progress..." />;
  }

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-300">
        No progress records found.
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
                  <td
                    key={cell.id}
                    className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200"
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
        {data.map((entry, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                  {entry.task}
                </h3>
                <p
                  className="text-sm text-gray-500 dark:text-gray-300 mt-1 break-all"
                  title={entry.employeeEmail}
                >
                  {entry.employeeEmail}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Date: {entry.date ? entry.date.slice(0, 10) : ""}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Hours: {entry.hoursWorked}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Status: {entry.status || "Completed"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProgressTable;

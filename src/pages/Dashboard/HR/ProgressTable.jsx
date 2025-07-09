// ProgressTable.jsx - Responsive table for Progress page
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

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
          <span>
            {row.original.date
              ? row.original.date.slice(0, 10)
              : ""}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span>
            {row.original.status || "Completed"}
          </span>
        ),
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
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500">No records found.</div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
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
      <div className="md:hidden space-y-3">
        {data.map((entry, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {entry.task}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {entry.employeeEmail}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {entry.date ? entry.date.slice(0, 10) : ""}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Hours: {entry.hoursWorked}
                </p>
                <p className="text-sm text-gray-500 mt-1">
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
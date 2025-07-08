import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const WorksheetTable = ({ data, onEdit, onDelete, isLoading }) => {
  const columns = useMemo(
    () => [
      {
        header: "Task",
        accessorKey: "task",
        cell: (info) => (
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        ),
      },
      {
        header: "Hours",
        accessorKey: "hoursWorked",
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
        ),
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => (
          <span className="text-gray-700">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-1 justify-center">
            <button
              className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              onClick={() => onEdit(row.original)}
              title="Edit"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              onClick={() => onDelete(row.original._id)}
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500">No entries found.</div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((entry) => (
          <div
            key={entry._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {entry.task}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onEdit(entry)}
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onDelete(entry._id)}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hours Worked:</span>
              <span className="font-medium text-gray-900">
                {entry.hoursWorked}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WorksheetTable;

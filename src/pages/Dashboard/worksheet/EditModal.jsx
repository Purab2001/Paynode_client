import React from "react";
import TaskDropdown from "./TaskDropdown";

const EditModal = ({
  show,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  setValue,
  watch,
  errors,
  date,
  setDate,
  taskOptions,
  loading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Work Entry
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form className="px-6 py-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tasks
            </label>
            <TaskDropdown
              options={taskOptions}
              value={watch("task")}
              onChange={(task) =>
                setValue("task", task, { shouldValidate: true })
              }
              label="Select Task"
            />
            {errors.task && (
              <span className="text-red-500 text-xs mt-1 block">
                Task is required
              </span>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Hours Worked
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="0.0"
              {...register("hoursWorked", { required: true, min: 0.1 })}
              className="w-full bg-white text-gray-900 border border-gray-300 px-3 py-2 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.hoursWorked && (
              <span className="text-red-500 text-xs mt-1 block">
                Enter valid hours
              </span>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date ? new Date(date).toISOString().slice(0, 10) : ""}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full bg-white text-gray-900 border border-gray-300 px-3 py-2 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

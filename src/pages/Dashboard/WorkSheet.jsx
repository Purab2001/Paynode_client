import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { showConfirm } from "../../ui/CustomSwal";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

const TASK_OPTIONS = [
  "Sales",
  "Support",
  "Content",
  "Paper-work",
  "Research",
  "Development",
];

const WorkSheet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editEntry, setEditEntry] = useState(null);
  const [date, setDate] = useState(new Date());

  // Fetch worksheet entries
  const { data, isLoading } = useQuery({
    queryKey: ["worksheets", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/worksheets/${user.email}`);
      return res.data.worksheets;
    },
    onError: (error) => {
      console.error("Error fetching worksheet entries:", error);
      toast.error("Failed to load worksheet entries.");
    },
  });

  // Add or update worksheet entry
  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (editEntry) {
        await axiosSecure.put(`/api/worksheets/${editEntry._id}`, formData);
      } else {
        await axiosSecure.post("/api/worksheets", formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["worksheets", user?.email]);
      setEditEntry(null);
      toast.success(
        editEntry
          ? "Work entry updated successfully!"
          : "Work entry added successfully!"
      );
    },
    onError: (error) => {
      console.error("Error saving work entry:", error);
      toast.error("Failed to save work entry. Please try again.");
    },
  });

  // Delete worksheet entry
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/api/worksheets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["worksheets", user?.email]);
      toast.success("Work entry deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting work entry:", error);
      toast.error("Failed to delete work entry. Please try again.");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Handle form submit
  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      employeeEmail: user.email,
      date: date,
      hoursWorked: Number(formData.hoursWorked),
    };

    const loadingToast = toast.loading(
      editEntry ? "Updating work entry..." : "Adding work entry..."
    );

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        reset();
        setDate(new Date());
      },
      onError: () => {
        toast.dismiss(loadingToast);
      },
    });
  };

  // Handle edit
  const handleEdit = (entry) => {
    setEditEntry(entry);
    setValue("task", entry.task);
    setValue("hoursWorked", entry.hoursWorked);
    setDate(new Date(entry.date));
  };

  // Handle delete
  const handleDelete = (id) => {
    showConfirm(
      "Are you sure?",
      "This will delete the entry permanently.",
      "Yes, delete it!",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        const loadingToast = toast.loading("Deleting work entry...");
        deleteMutation.mutate(id, {
          onSuccess: () => {
            toast.dismiss(loadingToast);
          },
          onError: () => {
            toast.dismiss(loadingToast);
          },
        });
      }
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditEntry(null);
    reset();
    setDate(new Date());
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Work Sheet</h2>

        {/* Form */}
        <form
          className="flex flex-wrap gap-4 items-end mb-6 bg-white p-4 rounded shadow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block mb-1 font-medium">Tasks</label>
            <select
              {...register("task", { required: true })}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Task</option>
              {TASK_OPTIONS.map((task) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
            </select>
            {errors.task && (
              <span className="text-red-500 text-xs">Task is required</span>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Hours Worked</label>
            <input
              type="number"
              min="0"
              step="0.1"
              {...register("hoursWorked", { required: true, min: 0.1 })}
              className="border rounded px-3 py-2"
            />
            {errors.hoursWorked && (
              <span className="text-red-500 text-xs">Enter valid hours</span>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              className="border rounded px-3 py-2"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editEntry ? "Update" : "Add"}
          </button>
          {editEntry && (
            <button
              type="button"
              className="ml-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Task</th>
                <th className="py-2 px-4">Hours</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((entry) => (
                  <tr key={entry._id}>
                    <td className="py-2 px-4">{entry.task}</td>
                    <td className="py-2 px-4">{entry.hoursWorked}</td>
                    <td className="py-2 px-4">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(entry)}
                        title="Edit"
                      >
                        🖊
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(entry._id)}
                        title="Delete"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkSheet;

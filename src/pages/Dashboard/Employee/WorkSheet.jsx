import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TaskDropdown from "./TaskDropdown";
import EditModal from "./EditModal";
import WorksheetTable from "./WorksheetTable";
import { showConfirm } from "../../../ui/CustomSwal";
import { Button } from "@material-tailwind/react";

const TASK_OPTIONS = [
  "Sales",
  "Support",
  "Content",
  "Paper-work",
  "Research",
  "Development",
];

const WorkSheet = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date());

  // Modal edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editModalDate, setEditModalDate] = useState(new Date());

  // Modal form
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    setValue: setEditValue,
    watch: editWatch,
    formState: { errors: editErrors },
  } = useForm();

  // Edit mutation for modal
  const editMutation = useMutation({
    mutationFn: async (formData) => {
      if (!editingEntry) return;
      await axiosSecure.put(`/api/worksheets/${editingEntry._id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["worksheets", user?.email]);
      setIsEditModalOpen(false);
      setEditingEntry(null);
      editReset();
      toast.success("Work entry updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update work entry. Please try again.");
    },
  });

  // Fetch worksheet entries (for Employee: use their email)
  const { data, isLoading, error } = useQuery({
    queryKey: ["worksheets", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/worksheets/${user.email}`);
      return res.data.worksheets;
    },
  });

  // Show error toast if query fails
  React.useEffect(() => {
    if (error) {
      console.error("Error fetching worksheet entries:", error);
      toast.error("Failed to load worksheet entries.");
    }
  }, [error]);

  // Add worksheet entry
  const mutation = useMutation({
    mutationFn: async (formData) => {
      await axiosSecure.post("/api/worksheets", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["worksheets", user?.email]);
      toast.success("Work entry added successfully!");
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
    watch,
    formState: { errors },
  } = useForm();

  // Handle form submit
  const onSubmit = (formData) => {
    if (!formData.task) {
      toast.error("Please select a task");
      return;
    }

    const payload = {
      ...formData,
      employeeEmail: user.email,
      date: date,
      hoursWorked: Number(formData.hoursWorked),
    };

    const loadingToast = toast.loading("Adding work entry...");

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        reset();
        setValue("task", ""); // Clear the task dropdown
        setDate(new Date());
      },
      onError: () => {
        toast.dismiss(loadingToast);
      },
    });
  };

  // Handle edit (open modal)
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditValue("task", entry.task);
    setEditValue("hoursWorked", entry.hoursWorked);
    setEditModalDate(new Date(entry.date));
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    showConfirm(
      "Delete Entry",
      "This will permanently delete this worksheet entry. This action cannot be undone.",
      "Delete",
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

  // Cancel edit (close modal)
  const cancelEdit = () => {
    setEditingEntry(null);
    setIsEditModalOpen(false);
    editReset();
    setEditModalDate(new Date());
  };

  // Wait for auth to load before rendering content
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-blue-600 text-lg font-semibold">Loading worksheet...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Work Sheet</h2>
          <p className="text-gray-600 mt-1">
            Track your daily work hours and tasks
          </p>
        </div>

        {/* Form */}
        <form
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tasks
              </label>
              <TaskDropdown
                options={TASK_OPTIONS}
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
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                className="w-full bg-white text-gray-900 border border-gray-300 px-3 py-2 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                color="blue"
                ripple={true}
                disabled={mutation.isLoading}
                className="shadow-none"
              >
                {mutation.isLoading ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </div>
        </form>

        {/* Table/Cards Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <WorksheetTable
              data={data || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Edit Modal */}
        <EditModal
          show={isEditModalOpen}
          onClose={cancelEdit}
          onSubmit={(formData) => {
            const payload = {
              ...formData,
              employeeEmail: user.email,
              date: editModalDate,
              hoursWorked: Number(formData.hoursWorked),
            };
            const loadingToast = toast.loading("Updating work entry...");
            editMutation.mutate(payload, {
              onSuccess: () => {
                toast.dismiss(loadingToast);
              },
              onError: () => {
                toast.dismiss(loadingToast);
              },
            });
          }}
          register={editRegister}
          handleSubmit={handleEditSubmit}
          setValue={setEditValue}
          watch={editWatch}
          errors={editErrors}
          date={editModalDate}
          setDate={setEditModalDate}
          taskOptions={TASK_OPTIONS}
          loading={editMutation.isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default WorkSheet;

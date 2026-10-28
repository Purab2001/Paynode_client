import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { http } from "@/lib/api";
import { reportError } from "@/lib/reportError";
import { todayLocal } from "@/lib/format";

export const worksheetKeys = {
  all: ["worksheets"],
  mine: (params) => ["worksheets", "mine", params],
  summary: () => ["worksheets", "summary"],
  team: (params) => ["worksheets", "team", params],
};

/** The signed-in employee's own entries. */
export const useMyWorksheets = (params) =>
  useQuery({ queryKey: worksheetKeys.mine(params), queryFn: () => http.get("/api/worksheets/mine", params), placeholderData: keepPreviousData });

/** This week's hours per day and the month's totals, based on the browser's idea of "today". */
export const useWorksheetSummary = () =>
  useQuery({ queryKey: worksheetKeys.summary(), queryFn: () => http.get("/api/worksheets/mine/summary", { today: todayLocal() }) });

/** HR and admins: everyone's entries. */
export const useTeamWorksheets = (params) =>
  useQuery({ queryKey: worksheetKeys.team(params), queryFn: () => http.get("/api/worksheets", params), placeholderData: keepPreviousData });

function useWorksheetMutation(mutationFn, message) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: worksheetKeys.all });
      toast.success(message);
    },
    onError: (err) => reportError(err),
  });
}

export const useAddWorksheet = () => useWorksheetMutation((body) => http.post("/api/worksheets", body), "Entry added");

export const useUpdateWorksheet = () =>
  useWorksheetMutation(({ id, ...body }) => http.patch(`/api/worksheets/${id}`, body), "Entry updated");

export const useDeleteWorksheet = () => useWorksheetMutation((id) => http.delete(`/api/worksheets/${id}`), "Entry deleted");

export const useReviewWorksheet = () =>
  useWorksheetMutation(
    ({ id, status }) => http.patch(`/api/worksheets/${id}/status`, { status }),
    "Entry reviewed",
  );

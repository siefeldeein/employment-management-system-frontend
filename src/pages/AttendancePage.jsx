import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  checkIn,
  checkOut,
  fetchAllEmployees,
  fetchDepartments,
  searchAttendance,
} from "../api/http";
import { useUIStore } from "../store/uiStore";
const initialFilters = {
  departmentId: "",
  employeeId: "",
  status: "",
  startDate: "",
  endDate: "",
};
const initialSearch = {
  departmentId: null,
  employeeId: null,
  status: null,
  startDate: null,
  endDate: null,
};
export default function AttendancePage() {
  const [filters, setFilters] = useState(initialFilters);
  const [applied, setApplied] = useState(initialSearch);
  const [page, setPage] = useState(0);
  const [clockEmployeeId, setClockEmployeeId] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => state.pushToast);

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ["attendance", applied, page],
    queryFn: () => searchAttendance(applied, page),
    placeholderData: (prev) => prev,
  });
  const isApplying = isFetching && !isLoading;
  const { data: employeeList } = useQuery({
    queryKey: ["employee-list"],
    queryFn: fetchAllEmployees,
  });
  const { data: departments } = useQuery({
    queryKey: ["departments-list"],
    queryFn: fetchDepartments,
  });
  const { data: todayData } = useQuery({
    queryKey: ["attendance-today", clockEmployeeId],
    queryFn: () =>
      searchAttendance(
        { employeeId: clockEmployeeId, startDate: today, endDate: today },
        0,
        1,
      ),
    enabled: !!clockEmployeeId,
  });
  const todayRow = todayData?.content?.[0];
  const { mutate: checkInMutate, isPending: checkInPending } = useMutation({
    mutationFn: checkIn,
    onSuccess: (data) => {
      pushToast(`Checked in at ${formatTime(data.checkInTime)}`);
      invalidateAttendance();
    },
    onError: (error) => pushToast(error.message, "error"),
  });
  const { mutate: checkOutMutate, isPending: checkOutPending } = useMutation({
    mutationFn: checkOut,
    onSuccess: (data) => {
      pushToast(
        `Checked out at ${formatTime(data.checkOutTime)} — ${statusLabel(
          data.status,
        )}`,
      );
      invalidateAttendance();
    },
    onError: (error) => pushToast(error.message, "error"),
  });
  function invalidateAttendance() {
    queryClient.invalidateQueries({ queryKey: ["attendance"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-attendance"] });
  }
  function handleChange(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleApply(e) {
    e.preventDefault();
    setApplied({
      departmentId: filters.departmentId || null,
      employeeId: filters.employeeId || null,
      status: filters.status || null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
    });
    setPage(0);
  }
  function handleReset() {
    setFilters(initialFilters);
    setApplied(initialSearch);
    setPage(0);
  }
  const rows = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  function formatTime(value) {
    if (!value) return "-";
    return value.slice(11, 16);
  }
  const statusStyles = {
    PRESENT:
      "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
    LATE: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    HALF_DAY:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    INCOMPLETE:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
  };
  function statusLabel(status) {
    return status ? status.replace(/_/g, " ").toLowerCase() : "-";
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Attendance
      </h1>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800 dark:text-slate-100">
        <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Clock In / Out
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
            Employee
            <select
              value={clockEmployeeId}
              onChange={(e) => setClockEmployeeId(e.target.value)}
              className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="">Select employee...</option>
              {(employeeList ?? []).map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </label>
          {todayRow?.checkInTime && !todayRow.checkOutTime ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Checked in at {formatTime(todayRow.checkInTime)}
              </p>
              <button
                onClick={() => checkOutMutate(clockEmployeeId)}
                disabled={checkOutPending}
                className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {checkOutPending ? "Checking out..." : "Check Out"}
              </button>
            </div>
          ) : todayRow?.checkInTime && todayRow.checkOutTime ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Done: {statusLabel(todayRow.status)}
            </p>
          ) : (
            <button
              onClick={() => checkInMutate(clockEmployeeId)}
              disabled={!clockEmployeeId || checkInPending}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {checkInPending ? "Checking in..." : "Check In"}
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleApply} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
          Department
          <select
            name="departmentId"
            value={filters.departmentId}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="">All</option>
            {(departments?.content ?? []).map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
          Employee{" "}
          <select
            name="employeeId"
            value={filters.employeeId}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="">All</option>
            {(employeeList ?? []).map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
          Status
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="">All</option>
            {["PRESENT", "LATE", "HALF_DAY", "INCOMPLETE", "ABSENT"].map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").toLowerCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
          From
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
          To
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Reset
        </button>
      </form>
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left dark:text-slate-300">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Check-in</th>
              <th className="px-4 py-3">Check-out</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((att) => (
              <tr
                key={att.id}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="px-4 py-3">{att.employeeName}</td>
                <td className="px-4 py-3">{att.date}</td>
                <td className="px-4 py-3">{formatTime(att.checkInTime)}</td>
                <td className="px-4 py-3">{formatTime(att.checkOutTime)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[att.status] ??
                      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {statusLabel(att.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <p className="p-4 text-slate-500 dark:text-slate-400">Loading...</p>
        )}
        {isError && <p className="p-4 text-red-600">{error.message}</p>}
        {!isLoading && rows.length === 0 && (
          <p className="p-4 text-slate-500 dark:text-slate-400">
            No attendance found
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Prev
        </button>
        <span className="text-slate-600 dark:text-slate-300">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page + 1 >= totalPages || isLoading}
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  fetchAllEmployees,
  fetchDepartments,
  searchAttendance,
} from "../api/http";
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
    PRESENT: "bg-green-100 text-green-700",
    LATE: "bg-amber-100 text-amber-700",
    HALF_DAY: "bg-blue-100 text-blue-700",
    INCOMPLETE: "bg-slate-100 text-slate-600",
  };
  function statusLabel(status) {
    return status ? status.replace(/_/g, " ").toLowerCase() : "-";
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>

      <form onSubmit={handleApply} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-sm text-slate-600">
          Department
          <select
            name="departmentId"
            value={filters.departmentId}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All</option>
            {(departments?.content ?? []).map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600">
          Employee{" "}
          <select
            name="employeeId"
            value={filters.employeeId}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All</option>
            {(employeeList ?? []).map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600">
          Status
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All</option>
            {["PRESENT", "LATE", "HALF_DAY", "INCOMPLETE"].map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").toLowerCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-600">
          From
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-600">
          To
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300"
        >
          Reset
        </button>
      </form>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
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
              <tr key={att.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{att.employeeName}</td>
                <td className="px-4 py-3">{att.date}</td>
                <td className="px-4 py-3">{formatTime(att.checkInTime)}</td>
                <td className="px-4 py-3">{formatTime(att.checkOutTime)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[att.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {statusLabel(att.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-slate-500">Loading...</p>}
        {isError && <p className="p-4 text-red-600">{error.message}</p>}
        {!isLoading && rows.length === 0 && (
          <p className="p-4 text-slate-500">No attendance found</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-slate-600">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page + 1 >= totalPages || isLoading}
          className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

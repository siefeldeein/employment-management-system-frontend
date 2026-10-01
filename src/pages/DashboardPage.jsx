import { useQuery } from "@tanstack/react-query";
import {
  fetchAllEmployees,
  fetchDepartments,
  searchAttendance,
} from "../api/http";
import { usePermissions } from "../hooks/usePermissions";
import { Navigate } from "react-router-dom";

export default function DashboardPage() {
  const { canManage } = usePermissions();
  const {
    data: employees,
    isLoading: empLoading,
    isError: empError,
  } = useQuery({
    queryKey: ["dashboard-employees"],
    queryFn: fetchAllEmployees,
    enabled: canManage,
  });
  const {
    data: departments,
    isLoading: deptLoading,
    isError: deptError,
  } = useQuery({
    queryKey: ["dashboard-departments"],
    queryFn: fetchDepartments,
    enabled: canManage,
  });
  const {
    data: attendance,
    isLoading: attLoading,
    isError: attError,
  } = useQuery({
    queryKey: ["dashboard-attendance"],
    queryFn: () => searchAttendance({}, 0, 1000),
    enabled: canManage,
  });

  if (!canManage) return <Navigate to="/attendance" replace />;
  const isLoading = attLoading || empLoading || deptLoading;
  const isError = attError || empError || deptError;

  const employeeList = employees ?? [];
  const departmentList = departments?.content ?? [];
  const attendanceRow = attendance?.content ?? [];

  const totalAttendanceCounts = attendance?.totalElements ?? 0;

  const totalStatusCounts = {
    PRESENT: 0,
    LATE: 0,
    HALF_DAY: 0,
    INCOMPLETE: 0,
    ABSENT: 0,
  };
  attendanceRow.forEach((att) => {
    if (totalStatusCounts[att.status] !== undefined)
      totalStatusCounts[att.status]++;
  });

  const recent8 = [...attendanceRow]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  const filterByDept = departmentList.map((dep) => ({
    ...dep,
    count: employeeList.filter((e) => e.department?.id === dep.id).length,
  }));

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
  function formatTime(value) {
    if (!value) return "-";
    return value.slice(11, 16);
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Dashboard
      </h1>

      {isError && <p className="text-red-600">Failed to load dashboard data</p>}
      {isLoading ? (
        <p className="text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Employees
              </p>
              <p className="mt-1 text-3xl font-bold text-sky-600">
                {employeeList.length}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Departments
              </p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {departmentList.length}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Attendance Records
              </p>
              <p className="mt-1 text-3xl font-bold text-violet-600">
                {totalAttendanceCounts}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Attendance Overview
            </h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(totalStatusCounts).map(([status, count]) => (
                <span
                  key={status}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    statusStyles[status]
                  }`}
                >
                  {statusLabel(status)}: {count}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Employees by Department
              </h2>
              {filterByDept.map((dep) => (
                <div
                  key={dep.id}
                  className="flex items-center justify-between border-t border-slate-100 py-2 dark:border-slate-700"
                >
                  <span className="text-slate-700 dark:text-slate-200">
                    {dep.name}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {dep.count}
                  </span>
                </div>
              ))}
              {filterByDept.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">
                  No departments
                </p>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Recent Attendance
              </h2>
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="px-3 py-2">Employee</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">In</th>
                    <th className="px-3 py-2">Out</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent8.map((att) => (
                    <tr
                      key={att.id}
                      className="border-t border-slate-200 dark:border-slate-700  dark:text-slate-300"
                    >
                      <td className="px-3 py-2 ">{att.employeeName}</td>
                      <td className="px-3 py-2">{att.date}</td>
                      <td className="px-3 py-2">
                        {formatTime(att.checkInTime)}
                      </td>
                      <td className="px-3 py-2">
                        {formatTime(att.checkOutTime)}
                      </td>
                      <td className="px-3 py-2">
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
              {recent8.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">
                  No attendance records yet
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { fetchDepartmentEmployees } from "../api/http";

export default function DepartmentDetailsModal({ department, onClose }) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["department-employees", department.id],
    queryFn: () => fetchDepartmentEmployees(department.id),
  });
  const employees = data?.employeeList || [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold">{department.name}</h2>
        <p className="text-slate-600">{department.description}</p>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-200">
                  <td className="px-4 py-2">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">
                    {emp.salary != null
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(emp.salary)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <p className="p-3 text-sm text-slate-500">Loading...</p>
          )}
          {isError && (
            <p className="p-3 text-sm text-red-600">{error.message}</p>
          )}
          {!isLoading && employees.length === 0 && (
            <p className="p-3 text-sm text-slate-500">No employees</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

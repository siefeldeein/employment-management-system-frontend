import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUIStore } from "../store/uiStore";
import { deleteEmployee, fetchEmployees, searchEmployee } from "../api/http";
import EmployeeFormModal from "../components/EmployeeFormModal";

export default function EmployeesPage() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => state.pushToast);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employees", page, search],
    queryFn: () =>
      search.trim() ? searchEmployee(search.trim()) : fetchEmployees(page),
  });
  function handleSubmit(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  }
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      pushToast("Employee Deleted");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => pushToast(error.message, "error"),
  });
  function handleDelete(id) {
    if (window.confirm("Delete this employee?")) {
      deleteMutate(id);
    }
  }
  const rows = search.trim() ? (data ?? []) : (data?.content ?? []);
  const totalPages = data?.totalPages ?? 1;
  const isSearching = search.trim() !== "";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          Add Employee
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name..."
          className="w-full max-w-sm rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
        >
          Search
        </button>
      </form>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((emp) => (
              <tr key={emp.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-4 py-3">{emp.email}</td>
                <td className="px-4 py-3">{emp.phone}</td>
                <td className="px-4 py-3">
                  {emp.salary != null
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(emp.salary)
                    : "-"}
                </td>
                <td className="px-4 py-3">{emp.department?.name || "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModal({ mode: "edit", employee: emp })}
                    className="mr-2 rounded bg-slate-600 px-3 py-1 text-white hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-slate-500">Loading...</p>}

        {isError && <p className="p-4 text-red-600">{error.message}</p>}

        {!isLoading && rows.length === 0 && (
          <p className="p-4 text-slate-500">No employees found</p>
        )}
      </div>

      {!isSearching && (
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
      )}

      {modal && (
        <EmployeeFormModal
          mode={modal.mode}
          employee={modal.employee}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

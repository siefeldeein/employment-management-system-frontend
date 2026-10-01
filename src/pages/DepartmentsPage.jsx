import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteDepartment, fetchDepartmentsPage } from "../api/http";
import { useUIStore } from "../store/uiStore";
import DepartmentFormModal from "../components/DepartmentFormModal";
import DepartmentDetailsModal from "../components/DepartmentDetailsModal";
import { usePermissions } from "../hooks/usePermissions";
import { Navigate } from "react-router-dom";

export default function DepartmentPage() {
  const [modal, setModal] =
    useState(null); /*{ mode: "create" or "update", dep: null }*/
  const [details, setDetails] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => {
    return state.pushToast;
  });

  const { canManage } = usePermissions();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["departments", page],
    queryFn: () => fetchDepartmentsPage(page),
    enabled: canManage,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: () => {
      pushToast("Department Deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      pushToast(error.message, "error");
    },
  });

  if (!canManage) return <Navigate to="/attendance" replace />;

  function handleDelete(id) {
    if (window.confirm("Delete this Department")) deleteMutate(id);
  }
  const rows = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Departments
        </h1>
        {canManage && (
          <button
            onClick={() => setModal({ mode: "create" })}
            className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
          >
            Add Department
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left  dark:text-slate-300">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3  dark:text-slate-300">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((dep) => (
              <tr
                key={dep.id}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="px-4 py-3 font-medium">{dep.name}</td>
                <td className="px-4 py-3">{dep.description}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDetails(dep)}
                    className="mr-2 rounded bg-slate-600 px-3 py-1 text-white hover:bg-slate-700"
                  >
                    View
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() =>
                          setModal({ mode: "edit", department: dep })
                        }
                        className="mr-2 rounded bg-slate-600 px-3 py-1 text-white hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dep.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
            No departments found
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

      {modal && (
        <DepartmentFormModal
          mode={modal.mode}
          department={modal.department}
          onClose={() => setModal(null)}
        />
      )}

      {details && (
        <DepartmentDetailsModal
          department={details}
          onClose={() => setDetails(null)}
        />
      )}
    </div>
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "../store/uiStore";
import { createDepartment, updateDepartment } from "../api/http";
import { useState } from "react";

export default function DepartmentFormModal({ mode, department, onClose }) {
  const inputClass =
    "w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500";
  const pushToast = useUIStore((state) => state.pushToast);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: department?.name || "",
    description: department?.description || "",
  });
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: ({ id, departmentFormData }) =>
      mode === "create"
        ? createDepartment(departmentFormData)
        : updateDepartment(id, departmentFormData),
    onSuccess: () => {
      pushToast(
        mode === "created"
          ? "Department created successfuly"
          : "Department updated successfuly",
      );
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      onClose();
    },
    onError: (error) => {
      pushToast(error?.message, "error");
    },
  });
  function handleSubmit(e) {
    e.preventDefault();
    mutate({ id: department?.id, departmentFormData: form });
  }
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-bold">
          {mode === "create" ? "Create Department" : "Update Department"}
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="3"
            className={inputClass}
          />
        </div>

        {isPending && <p className="text-sm text-slate-500">Saving...</p>}
        {isError && (
          <p className="text-sm text-red-600">Something went wrong</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

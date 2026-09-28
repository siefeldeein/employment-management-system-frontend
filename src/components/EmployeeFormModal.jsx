import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "../store/uiStore";
import { createEmployee, fetchDepartments, updateEmployee } from "../api/http";
import { useState } from "react";

export default function EmployeeFormModal({ mode, employee, onClose }) {
  const inputClass =
    "w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100";
  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => state.pushToast);

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
  const [form, setForm] = useState({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    salary: employee?.salary ?? "",
    hireDate: employee?.hireDate || "",
    departmentName: employee?.department?.name || "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const {
    mutate,
    isPending: isMutationPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: ({ id, employeeFormData }) =>
      mode === "create"
        ? createEmployee(employeeFormData)
        : updateEmployee(id, employeeFormData),

    onSuccess: () => {
      pushToast(mode === "create" ? "Employee Created" : "Employee Updated");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },

    onError: (error) => pushToast(error.message, "error"),
  });
  function handleSubmit(e) {
    e.preventDefault();
    mutate({ id: employee?.id, employeeFormData: form });
  }
  const departments = departmentsData?.content || [];
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800 dark:text-slate-100"
      >
        <h2 className="text-lg font-bold">
          {mode === "create" ? "Create Employee" : "Update Employee"}
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium">First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Salary</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        {mode === "create" && (
          <div>
            <label className="mb-1 block text-sm font-medium">Hire date</label>
            <input
              type="date"
              name="hireDate"
              value={form.hireDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Department</label>
          <select
            name="departmentName"
            value={form.departmentName}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select department...</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.name}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {isMutationPending && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saving...
          </p>
        )}
        {isMutationError && (
          <p className="text-sm text-red-600">Something went wrong</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isMutationPending}
            className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useAuthStore } from "../store/authStore";

//Auth
async function api(path, options = {}) {
  const token = useAuthStore.getState().token;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(path, { ...options, headers });

  if (token && response.status === 401) {
    useAuthStore.getState().logout();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Request failed (${response.status})`,
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

//Employees
export async function fetchEmployees(page) {
  return api(`/api/employees/paged?page=${page}&size=10`);
}
export async function fetchEmployee(id) {
  return api(`/api/employees/${id}`);
}
export async function searchEmployee(name) {
  return api(`/api/employees/search?name=${name}`);
}
export async function createEmployee(employeeData) {
  return api(`/api/employees`, {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
}
export async function updateEmployee(id, employeeData) {
  return api(`/api/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(employeeData),
  });
}
export async function deleteEmployee(id) {
  return api(`/api/employees/${id}`, { method: "DELETE" });
}
export async function fetchAllEmployees() {
  return api(`/api/employees`);
}

//Departments
export async function fetchDepartments() {
  return api(`/api/departments/paginated?page=0&size=100`);
}
export async function fetchDepartmentsPage(page) {
  return api(`/api/departments/paginated?page=${page}&size=10`);
}
export async function fetchDepartmentEmployees(id) {
  return api(`/api/departments/${id}/employees`);
}
export async function createDepartment(departmentData) {
  return api(`/api/departments`, {
    method: "POST",
    body: JSON.stringify(departmentData),
  });
}
export async function updateDepartment(id, departmentData) {
  return api(`/api/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(departmentData),
  });
}
export async function deleteDepartment(id) {
  return api(`/api/departments/${id}`, { method: "DELETE" });
}

//Attendance
export async function searchAttendance(filters, page, size = 10) {
  return api(`/api/attendance/search?page=${page}&size=${size}`, {
    method: "POST",
    body: JSON.stringify(filters),
  });
}
// EMPLOYEE only: the server takes employeeId from the token, never from here.
export async function fetchMyAttendance(page, size = 10, startDate, endDate) {
  const params = new URLSearchParams({ page, size });
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return api(`/api/attendance/me?${params}`);
}
export async function checkIn(employeeId) {
  return api(`/api/attendance/check-in?employeeId=${employeeId}`, {
    method: "POST",
  });
}
export async function checkOut(employeeId) {
  return api(`/api/attendance/check-out?employeeId=${employeeId}`, {
    method: "POST",
  });
}

//Auth
export async function loginUser(credentials) {
  return api(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
export async function registerUser(payload) {
  return api(`/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

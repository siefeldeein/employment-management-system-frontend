//Employees
export async function fetchEmployees(page) {
  const response = await fetch(`/api/employees/paged?page=${page}&size=10`);
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  const resData = await response.json();
  return resData;
}
export async function fetchEmployee(id) {
  const response = await fetch(`/api/employees/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }
  const resData = await response.json();
  return resData;
}
export async function fetchDepartments() {
  const response = await fetch(`/api/departments/paginated?page=0&size=100`);
  if (!response.ok) {
    throw new Error("failed to fetch Departments");
  }
  const resData = await response.json();
  return resData;
}
export async function searchEmployee(name) {
  const response = await fetch(`/api/employees/search?name=${name}`);
  if (!response.ok) {
    throw new Error("failed to search employee");
  }
  const resData = await response.json();
  return resData;
}
export async function createEmployee(employeeData) {
  const response = await fetch(`/api/employees`, {
    body: JSON.stringify(employeeData),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "failed to search employee");
  }
  return response.json();
}
export async function updateEmployee(id, employeeData) {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update employee");
  }
  return response.json();
}
export async function deleteEmployee(id) {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete employee");
  }
  return null;
}
//Departments
export async function fetchDepartmentsPage(page) {
  const response = await fetch(
    `/api/departments/paginated?page=${page}&size=10`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }
  return await response.json();
}
export async function fetchDepartmentEmployees(id) {
  const response = await fetch(`/api/departments/${id}/employees`);
  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }
  return await response.json();
}
export async function createDepartment(departmentData) {
  const response = await fetch(`/api/departments`, {
    body: JSON.stringify(departmentData),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "failed to create department");
  }
  return response.json();
}
export async function updateDepartment(id, departmentData) {
  const response = await fetch(`/api/departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(departmentData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update department");
  }
  return response.json();
}
export async function deleteDepartment(id) {
  const response = await fetch(`/api/departments/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete department");
  }
  return null;
}
//Attendance
export async function fetchAllEmployees() {
  const response = await fetch(`/api/employees`);
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  const resData = await response.json();
  return resData;
}

export async function searchAttendance(filters, page, size = 10) {
  const response = await fetch(`/api/attendance/search?page=${page}&${size}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch attendance");
  }
  return response.json();
}

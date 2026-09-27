import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import DepartmentPage from "./pages/DepartmentsPage";
import AttendancePage from "./pages/AttendancePage";
import Layout from "./components/Layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "employees", element: <EmployeesPage /> },
        { path: "departments", element: <DepartmentPage /> },
        { path: "attendance", element: <AttendancePage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

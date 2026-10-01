import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import Toasts from "./Toasts";

const links = [
  { to: "", label: "Dashboard" },
  { to: "employees", label: "Employees" },
  { to: "departments", label: "Departments" },
  { to: "attendance", label: "Attendance" },
];

export default function Layout() {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside
        className={
          "bg-slate-900 text-slate-100 transition-all " +
          (isSidebarOpen ? "w-56" : "w-14")
        }
      >
        <nav className=" space-y-2 p-4 ">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ""}
              className={({ isActive }) =>
                "block rounded px-3 py-2 " +
                (isActive ? "bg-sky-600 text-white" : "hover:bg-slate-800")
              }
            >
              {isSidebarOpen ? link.label : link.label[0]}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm dark:bg-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {isSidebarOpen ? "Collapse" : "Expand"}
            </button>
            <h1 className="font-semibold">EMS</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {user.username}
                  </p>
                  {user.roles?.[0] && (
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      {user.roles[0].replace("ROLE_", "")}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              className="rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="4" />
                  <path
                    strokeLinecap="round"
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  />
                </svg>
              )}
            </button>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Toasts />
    </div>
  );
}

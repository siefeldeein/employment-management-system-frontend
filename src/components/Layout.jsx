import { NavLink, Outlet } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import Toasts from "./Toasts";
const links = [
  { to: "", label: "Dashboard" },
  { to: "employees", label: "Employees" },
  { to: "departments", label: "Departments" },
  { to: "attendance", label: "Attendance" },
];
export default function Layout() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  return (
    <div className="flex min-h-screen bg-slate-100">
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
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="rounded px-2 py-1 hover:bg-slate-200"
          >
            {isSidebarOpen ? "Collapse" : "Expand"}
          </button>
          <h1 className="font-semibold">EMS</h1>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Toasts />
    </div>
  );
}

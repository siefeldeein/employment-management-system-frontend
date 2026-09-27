# Employee Management System — Frontend

React SPA for the EMS REST API — employees, departments, attendance, with a clean sidebar layout, toasts, and server-state caching.

**Backend:** [`employment-management-system-backend`](https://github.com/siefeldeein/employment-management-system-backend)

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Routing | React Router 7 (nested layout via `<Outlet>`) |
| Server state | TanStack Query 5 (loading / error / refetch states) |
| Client state | Zustand 5 (sidebar toggle + toast notifications) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Linting | Oxlint |

## Features

- **Layout** — collapsible sidebar with active-link highlighting, `<Outlet>`-based routing, global toast notifications (auto-dismiss)
- **Employees page** — paginated table, search-by-name (commit-on-submit), create/edit modal with department dropdown, delete with confirm
- **Departments page** — paginated table, create/edit modal, **View** modal that lists the department's employees (nested DTO endpoint)
- **Attendance & Dashboard pages** — stubs, wired into routing
- **Server state** — every fetch lives in `src/api/http.js` (course-style named fetchers); TanStack Query keys invalidated after mutations so lists refresh automatically

## Getting Started

Prerequisites: **Node 20+**, and the backend running on `http://localhost:8080` (see the [backend repo](https://github.com/siefeldeein/employment-management-system-backend)).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/*` to the backend (see `vite.config.js`), so no CORS config is needed in development.

Other scripts:

```bash
npm run lint     # oxlint
npm run build    # production build → dist/
```

## Project Structure

```
src
├── api/http.js            all fetch helpers (employees, departments, auth…)
├── components/            Layout (sidebar), Toasts, form/details modals
├── pages/                 Dashboard, Employees, Departments, Attendance
├── store/uiStore.js       Zustand: sidebar + toasts
├── App.jsx                router setup
└── main.jsx               QueryClientProvider + RouterProvider
```

## Screenshots

> _Add screenshots here — swap the placeholder paths for real images pushed to the repo._

## How It Connects

`http.js` calls relative `/api/...` paths; the Vite dev server proxies them to Spring Boot on port 8080. When deploying the frontend separately (e.g. Vercel), point the API base URL at the deployed backend or add a `/api/*` rewrite.
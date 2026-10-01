import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../api/http";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = useAuthStore((s) => s.token);
  const setSession = useAuthStore((s) => s.setSession);
  const loadUser = useAuthStore((s) => s.loadUser);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { token } = await registerUser({ username, password, email });
      setSession(token);
      await loadUser();
      navigate("/");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow dark:bg-slate-800">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Create account
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Email must match an existing employee (e.g. jane.smith@company.com).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Employee email"
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

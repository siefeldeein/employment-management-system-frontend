import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const token = useAuthStore.getState().token;
  const user = useAuthStore.getState().user;
  const loadUser = useAuthStore.getState().loadUser;

  useEffect(() => {
    if (token && !user) loadUser();
  }, [token, user, loadUser]);

  if (!token) return <Navigate to="/login" replace></Navigate>;

  return <Outlet />;
}

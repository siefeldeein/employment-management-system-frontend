import { useAuthStore } from "../store/authStore";

export function usePermissions() {
  const roles = useAuthStore((s) => s.user?.roles) ?? [];
  return {
    roles: roles,
    canManage: roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER"),
  };
}

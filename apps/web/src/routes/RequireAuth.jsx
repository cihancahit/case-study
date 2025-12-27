import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RequireAuth() {
  const { token, me } = useAuthStore();
  if (!token || !me) return <Navigate to="/login" replace />;
  return <Outlet />;
}

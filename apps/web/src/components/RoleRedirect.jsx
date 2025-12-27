import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRedirect() {
  const { me } = useAuthStore();

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  switch (me.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "instructor":
      return <Navigate to="/instructor" replace />;
    case "user":
    default:
      return <Navigate to="/courses" replace />;
  }
}
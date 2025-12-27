import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import AppLayout from "./AppLayout";
import RoleRedirect from "../components/RoleRedirect";

import LoginPage from "../pages/LoginPage";
import CoursesPage from "../pages/CoursesPage";
import PurchasesPage from "../pages/PurchasesPage";
import LessonPage from "../pages/LessonPage";
import InstructorPage from "../pages/InstructorPage";
import PurchaseSuccessPage from "../pages/PurchaseSuccessPage";
import AdminPage from "../pages/AdminPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated area */}
      <Route element={<RequireAuth />}>
        {/* Layout for all authed pages */}
        <Route element={<AppLayout />}>
          {/* Role-based root redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* user-only */}
          <Route element={<RequireRole roles={["user"]} />}>
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/lesson" element={<LessonPage />} />
            <Route path="/purchase/success" element={<PurchaseSuccessPage />} />
          </Route>

          {/* instructor-only */}
          <Route element={<RequireRole roles={["instructor"]} />}>
            <Route path="/instructor" element={<InstructorPage />} />
          </Route>
            {/* admin-only */}
            <Route element={<RequireRole roles={["admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
             </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentsPage from "./routes/StudentsPage";
import TeachersPage from "./routes/TeachersPage";
import CoursesPage from "./routes/CoursesPage";
import UsersPage from "./routes/UsersPage";
import NotFoundPage from "./routes/NotFoundPage";
import AuthInit from "./components/AuthInit";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthInit>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Protected app (sidebar + students/teachers/courses) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/students" replace />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthInit>
  );
}

export default App;

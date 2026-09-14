import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/src/context/AuthContext';
import { Toaster } from 'sonner';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  SignupPage,
  LogInPage,
  Dashboard,
  ForgotPasswordPage,
  ResetPasswordPage,
  CoursesPage,
  CourseDetailPage,
  LessonPlayerPage,
  MyCoursesPage,
  CourseStudioPage,
  CreateCoursePage,
  CurriculumBuilderPage,
  ProfilePage,
  SettingsPage,
  UnauthorizedPage,
} from './pages';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Authenticated Dashboard Routes with Sidebar */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Universal Authenticated Views */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route
                path="/courses/:courseId/lessons/:lessonId"
                element={<LessonPlayerPage />}
              />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<Dashboard />} />

              {/* Instructor Protected Routes */}
              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CourseStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/new"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/curriculum"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CurriculumBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/analytics"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CourseStudioPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CourseStudioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

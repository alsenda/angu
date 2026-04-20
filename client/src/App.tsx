import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppLayout from './components/layout/AppLayout';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/courses', element: <CoursesPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/courses/:id', element: <CoursePage /> },
      { path: '/courses/:id/lessons/:lessonId', element: <LessonPage /> },
    ],
  },
  {
    path: '/tests/:id',
    element: <ProtectedRoute><TestPage /></ProtectedRoute>,
  },
  {
    path: '/tests/:id/results/:attemptId',
    element: <ProtectedRoute><ResultsPage /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>,
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

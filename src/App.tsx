import { lazy } from 'react'
import {
  BookOpenIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import AppLayout, { type NavItem } from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import RouteErrorPage from '@/pages/RouteErrorPage'

// Pages are loaded on demand, so each portal only downloads the code it needs
const AdminDashboardPage = lazy(
  () => import('@/pages/admin/AdminDashboardPage'),
)
const StudentsPage = lazy(() => import('@/pages/admin/StudentsPage'))
const CreateStudentPage = lazy(() => import('@/pages/admin/CreateStudentPage'))
const StudentDetailsPage = lazy(
  () => import('@/pages/admin/StudentDetailsPage'),
)
const EditStudentPage = lazy(() => import('@/pages/admin/EditStudentPage'))
const StudentDashboardPage = lazy(
  () => import('@/pages/student/StudentDashboardPage'),
)
const CoursesPage = lazy(() => import('@/pages/student/CoursesPage'))
const ProfilePage = lazy(() => import('@/pages/student/ProfilePage'))
const ApplyPage = lazy(() => import('@/pages/student/ApplyPage'))

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboardIcon, end: true },
  { label: 'Students', to: '/admin/students', icon: UsersIcon },
]

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: LayoutDashboardIcon, end: true },
  { label: 'Courses', to: '/student/courses', icon: BookOpenIcon },
  { label: 'Profile', to: '/student/profile', icon: UserIcon },
  { label: 'Apply', to: '/student/apply', icon: ClipboardListIcon },
]

const router = createBrowserRouter([
  { path: '/', element: <HomePage />, errorElement: <RouteErrorPage /> },
  {
    path: '/admin',
    element: <AppLayout portalName="Admin Panel" navItems={adminNavItems} />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'students/new', element: <CreateStudentPage /> },
      { path: 'students/:id', element: <StudentDetailsPage /> },
      { path: 'students/:id/edit', element: <EditStudentPage /> },
    ],
  },
  {
    path: '/student',
    element: (
      <AppLayout portalName="Student Portal" navItems={studentNavItems} />
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <StudentDashboardPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'apply', element: <ApplyPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  )
}

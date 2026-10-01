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
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import CreateStudentPage from '@/pages/admin/CreateStudentPage'
import EditStudentPage from '@/pages/admin/EditStudentPage'
import StudentDetailsPage from '@/pages/admin/StudentDetailsPage'
import StudentsPage from '@/pages/admin/StudentsPage'
import ApplyPage from '@/pages/student/ApplyPage'
import CoursesPage from '@/pages/student/CoursesPage'
import ProfilePage from '@/pages/student/ProfilePage'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage'

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
  { path: '/', element: <HomePage /> },
  {
    path: '/admin',
    element: <AppLayout portalName="Admin Panel" navItems={adminNavItems} />,
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

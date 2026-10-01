import { ClipboardListIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AppLayout, { type NavItem } from '@/components/layout/AppLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import StudentsPage from '@/pages/admin/StudentsPage'
import ApplyPage from '@/pages/student/ApplyPage'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage'

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboardIcon },
  { label: 'Students', to: '/admin/students', icon: UsersIcon },
]

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: LayoutDashboardIcon },
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
    ],
  },
  {
    path: '/student',
    element: (
      <AppLayout portalName="Student Portal" navItems={studentNavItems} />
    ),
    children: [
      { index: true, element: <StudentDashboardPage /> },
      { path: 'apply', element: <ApplyPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}

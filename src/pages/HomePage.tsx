import { GraduationCapIcon, ShieldCheckIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-10 text-center">
        <GraduationCapIcon className="text-primary mx-auto mb-4 size-12" />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          GradNode
        </h1>
        <p className="text-muted-foreground mt-2">
          Student portal and admin panel. Choose where you want to go.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Link to="/admin" className="rounded-xl">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <ShieldCheckIcon className="text-primary mb-2 size-8" />
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage students, applications and programs.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/student" className="rounded-xl">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <UserIcon className="text-primary mb-2 size-8" />
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>
                View your courses, track your status and apply to programs.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

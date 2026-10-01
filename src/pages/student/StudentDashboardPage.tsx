import {
  BellIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { useCurrentStudent } from '@/api/studentPortal'
import AssignmentStatusBadge from '@/components/AssignmentStatusBadge'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { steps } from '@/components/application/applicationSchema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { assignments, courses } from '@/data/demoCourses'
import { loadDraft, loadSubmittedApplication } from '@/lib/applicationStorage'

export default function StudentDashboardPage() {
  const { data: student } = useCurrentStudent()

  const openAssignments = assignments.filter((a) => a.status !== 'submitted')
  const submittedCount = assignments.length - openAssignments.length
  const overdueCount = assignments.filter((a) => a.status === 'overdue').length

  // Notifications are built from the student's current data
  const notifications: string[] = []
  if (overdueCount > 0) {
    notifications.push(
      overdueCount === 1
        ? 'You have 1 overdue assignment.'
        : `You have ${overdueCount} overdue assignments.`,
    )
  }
  if (openAssignments.length > 0) {
    notifications.push(
      openAssignments.length === 1
        ? '1 assignment still needs to be submitted.'
        : `${openAssignments.length} assignments still need to be submitted.`,
    )
  }
  if (loadSubmittedApplication()) {
    notifications.push('Your program application is being reviewed.')
  } else if (loadDraft()) {
    notifications.push('You have an unfinished program application.')
  }

  return (
    <>
      <PageHeader
        title={student ? `Welcome back, ${student.firstName}` : 'Welcome back'}
        description="Here is an overview of your studies."
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Enrolled courses"
            value={courses.length}
            icon={BookOpenIcon}
          />
          <StatCard
            label="Assignments due"
            value={openAssignments.length}
            icon={ClipboardListIcon}
          />
          <StatCard
            label="Submitted"
            value={submittedCount}
            icon={CheckCircle2Icon}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Your current coursework.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {assignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.courseCode} · Due{' '}
                        {/* Add a time so the date is read in local time, not UTC */}
                        {new Date(
                          `${assignment.dueDate}T00:00`,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <AssignmentStatusBadge status={assignment.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <ApplicationStatusCard />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="size-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You're all caught up.
                  </p>
                ) : (
                  <ul className="space-y-3 text-sm">
                    {notifications.map((notification) => (
                      <li key={notification} className="flex gap-2">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                        {notification}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

function ApplicationStatusCard() {
  const submittedApplication = loadSubmittedApplication()
  const draft = loadDraft()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {submittedApplication ? (
          <>
            <Badge className="bg-blue-100 text-blue-800">Under review</Badge>
            <p className="text-sm text-muted-foreground">
              {submittedApplication.program}, submitted on{' '}
              {new Date(submittedApplication.submittedAt).toLocaleDateString()}
            </p>
          </>
        ) : draft ? (
          <>
            <Badge className="bg-amber-100 text-amber-800">In progress</Badge>
            <p className="text-sm text-muted-foreground">
              You are on step {draft.step + 1} of {steps.length}.
            </p>
            <Button size="sm" asChild>
              <Link to="/student/apply">Continue application</Link>
            </Button>
          </>
        ) : (
          <>
            <Badge variant="secondary">Not started</Badge>
            <p className="text-sm text-muted-foreground">
              Apply to a new program in a few minutes.
            </p>
            <Button size="sm" asChild>
              <Link to="/student/apply">Start application</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

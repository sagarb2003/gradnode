import {
  ClockIcon,
  GraduationCapIcon,
  UserCheckIcon,
  UsersIcon,
} from 'lucide-react'
import { useAllStudents, type Student } from '@/api/students'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import StudentAvatar from '@/components/StudentAvatar'
import StudentStatusBadge from '@/components/StudentStatusBadge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardPage() {
  const { data: students, isPending, isError, refetch } = useAllStudents()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of students and applications."
      />

      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState
          message="We couldn't load the student data. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <DashboardContent students={students} />
      )}
    </>
  )
}

function DashboardContent({ students }: { students: Student[] }) {
  const activeCount = students.filter((s) => s.status === 'active').length
  const pendingCount = students.filter((s) => s.status === 'pending').length
  const graduatedCount = students.filter((s) => s.status === 'graduated').length

  // The API has no "created at" date, so the highest ids are treated as the newest
  const recentStudents = [...students].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total students"
          value={students.length}
          icon={UsersIcon}
        />
        <StatCard label="Active" value={activeCount} icon={UserCheckIcon} />
        <StatCard
          label="Pending applications"
          value={pendingCount}
          icon={ClockIcon}
        />
        <StatCard
          label="Graduated"
          value={graduatedCount}
          icon={GraduationCapIcon}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentStudents students={recentStudents} />
        <TopUniversities students={students} />
      </div>
    </div>
  )
}

function RecentStudents({ students }: { students: Student[] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent students</CardTitle>
        <CardDescription>The most recently added students.</CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <EmptyState title="No students yet" />
        ) : (
          <ul className="divide-y">
            {students.map((student) => (
              <li key={student.id} className="flex items-center gap-3 py-3">
                <StudentAvatar student={student} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {student.university}
                  </p>
                </div>
                <StudentStatusBadge status={student.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function TopUniversities({ students }: { students: Student[] }) {
  // Count how many students attend each university
  const countByUniversity: Record<string, number> = {}
  for (const student of students) {
    countByUniversity[student.university] =
      (countByUniversity[student.university] ?? 0) + 1
  }

  const topUniversities = Object.entries(countByUniversity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const highestCount = topUniversities[0]?.[1] ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top universities</CardTitle>
        <CardDescription>Where most of our students study.</CardDescription>
      </CardHeader>
      <CardContent>
        {topUniversities.length === 0 ? (
          <EmptyState title="No data yet" />
        ) : (
          <ul className="space-y-4">
            {topUniversities.map(([university, count]) => (
              <li key={university}>
                <div className="mb-1 flex justify-between gap-2 text-sm">
                  <span className="truncate">{university}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(count / highestCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

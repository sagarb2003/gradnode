import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useAllStudents } from '@/api/students'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import StudentAvatar from '@/components/StudentAvatar'
import StudentStatusBadge from '@/components/StudentStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudentDetailsPage() {
  const { id } = useParams()
  const { data: students, isPending, isError, refetch } = useAllStudents()

  if (isPending) {
    return <Skeleton className="h-80 rounded-xl" aria-label="Loading student" />
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load this student. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const student = students.find((s) => s.id === Number(id))

  if (!student) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            title="Student not found"
            description="This student may have been removed."
          />
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/admin/students">Back to students</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const details = [
    { label: 'Email', value: student.email },
    { label: 'Phone', value: student.phone || '—' },
    { label: 'Age', value: student.age },
    {
      label: 'Gender',
      value: <span className="capitalize">{student.gender}</span>,
    },
    { label: 'University', value: student.university },
    { label: 'Student ID', value: `#${student.id}` },
  ]

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link to="/admin/students">
          <ArrowLeftIcon />
          Back to students
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <StudentAvatar student={student} className="size-16" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="mt-2">
              <StudentStatusBadge status={student.status} />
            </div>
          </div>
          <Button asChild className="self-start sm:self-center">
            <Link to={`/admin/students/${student.id}/edit`}>
              <PencilIcon />
              Edit student
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 border-t pt-6 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-sm text-muted-foreground">
                  {detail.label}
                </dt>
                <dd className="font-medium break-words">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </>
  )
}

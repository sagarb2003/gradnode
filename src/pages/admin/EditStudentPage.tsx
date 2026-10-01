import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { useAllStudents, useUpdateStudent } from '@/api/students'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import PageHeader from '@/components/PageHeader'
import StudentForm from '@/components/StudentForm'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditStudentPage() {
  const { id } = useParams()
  const studentId = Number(id)
  const navigate = useNavigate()
  const { data: students, isPending, isError, refetch } = useAllStudents()
  const updateStudent = useUpdateStudent(studentId)

  if (isPending) {
    return <Skeleton className="h-96 rounded-xl" aria-label="Loading student" />
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load this student. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const student = students.find((s) => s.id === studentId)

  if (!student) {
    return <EmptyState title="Student not found" />
  }

  const detailsPath = `/admin/students/${student.id}`

  return (
    <>
      <PageHeader
        title="Edit student"
        description={`Update ${student.firstName} ${student.lastName}'s details.`}
      />
      <Card>
        <CardContent>
          <StudentForm
            defaultValues={student}
            submitLabel="Save changes"
            isSubmitting={updateStudent.isPending}
            onCancel={() => navigate(detailsPath)}
            onSubmit={(values) =>
              updateStudent.mutate(values, {
                onSuccess: () => {
                  toast.success('Student updated')
                  navigate(detailsPath)
                },
                onError: () => toast.error('Could not update the student'),
              })
            }
          />
        </CardContent>
      </Card>
    </>
  )
}

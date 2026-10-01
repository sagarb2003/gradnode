import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useCreateStudent } from '@/api/students'
import PageHeader from '@/components/PageHeader'
import StudentForm from '@/components/StudentForm'
import { Card, CardContent } from '@/components/ui/card'

export default function CreateStudentPage() {
  const navigate = useNavigate()
  const createStudent = useCreateStudent()

  return (
    <>
      <PageHeader
        title="Add student"
        description="Create a new student record."
      />
      <Card>
        <CardContent>
          <StudentForm
            submitLabel="Create student"
            isSubmitting={createStudent.isPending}
            onCancel={() => navigate('/admin/students')}
            onSubmit={(values) =>
              createStudent.mutate(values, {
                onSuccess: () => {
                  toast.success('Student created')
                  navigate('/admin/students')
                },
                onError: () => toast.error('Could not create the student'),
              })
            }
          />
        </CardContent>
      </Card>
    </>
  )
}

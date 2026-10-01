import { useCurrentStudent } from '@/api/studentPortal'
import ErrorState from '@/components/ErrorState'
import PageHeader from '@/components/PageHeader'
import StudentAvatar from '@/components/StudentAvatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const { data: student, isPending, isError, refetch } = useCurrentStudent()

  if (isPending) {
    return <Skeleton className="h-96 rounded-xl" aria-label="Loading profile" />
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load your profile. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const { address } = student
  // DummyJSON dates look like "1996-5-30", which not every browser can parse
  const [year, month, day] = student.birthDate.split('-').map(Number)
  const birthDate = new Date(year, month - 1, day).toLocaleDateString()

  const sections = [
    {
      title: 'Personal details',
      items: [
        ['Date of birth', birthDate],
        ['Age', student.age],
        [
          'Gender',
          student.gender.charAt(0).toUpperCase() + student.gender.slice(1),
        ],
      ],
    },
    {
      title: 'Contact',
      items: [
        ['Email', student.email],
        ['Phone', student.phone],
        [
          'Address',
          `${address.address}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`,
        ],
      ],
    },
    {
      title: 'Education',
      items: [['University', student.university]],
    },
  ]

  return (
    <>
      <PageHeader title="My profile" description="Your personal information." />

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4">
          <StudentAvatar student={student} className="size-16" />
          <div className="min-w-0">
            <p className="text-xl font-semibold">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-muted-foreground truncate">{student.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {section.items.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground text-sm">{label}</dt>
                    <dd className="font-medium break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

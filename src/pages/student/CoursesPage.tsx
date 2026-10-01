import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { courses, enrolledProgram } from '@/data/demoCourses'

export default function CoursesPage() {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)

  const programDetails = [
    { label: 'Program', value: enrolledProgram.name },
    { label: 'Year', value: enrolledProgram.year },
    { label: 'Academic year', value: enrolledProgram.academicYear },
    { label: 'Academic advisor', value: enrolledProgram.advisor },
    { label: 'Credits this term', value: totalCredits },
  ]

  return (
    <>
      <PageHeader
        title="My courses"
        description="Your program and the courses you're taking this term."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Program information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {programDetails.map((detail) => (
              <div key={detail.label}>
                <dt className="text-muted-foreground text-sm">
                  {detail.label}
                </dt>
                <dd className="font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.code}>
            <CardHeader>
              <CardDescription>
                {course.code} · {course.credits} credits
              </CardDescription>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {course.instructor}
              </p>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div
                  className="bg-muted h-2 rounded-full"
                  role="progressbar"
                  aria-label={`${course.title} progress`}
                  aria-valuenow={course.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

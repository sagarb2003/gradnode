import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function StudentDashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome back"
        description="Here is an overview of your studies."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My courses</CardTitle>
            <CardDescription>Courses you are enrolled in.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground py-6 text-center text-sm">
            Your courses will appear here.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application status</CardTitle>
            <CardDescription>
              Track the progress of your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground py-6 text-center text-sm">
            Your application status will appear here.
          </CardContent>
        </Card>
      </div>
    </>
  )
}

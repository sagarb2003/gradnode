import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Placeholder stats. Real data from the API is added in a later PR.
const statLabels = [
  'Total students',
  'Active students',
  'Pending applications',
  'Programs',
]

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of students and applications."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statLabels.map((label) => (
          <Card key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl">—</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent students</CardTitle>
          <CardDescription>The latest student records.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          Student data will appear here.
        </CardContent>
      </Card>
    </>
  )
}

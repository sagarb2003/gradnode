import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export default function StudentsPage() {
  return (
    <>
      <PageHeader
        title="Students"
        description="Search, filter and manage student records."
      />
      <Card>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          The student table will appear here.
        </CardContent>
      </Card>
    </>
  )
}

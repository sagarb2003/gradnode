import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        title="Apply to a program"
        description="Complete your application in a few simple steps."
      />
      <Card>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          The application form will appear here.
        </CardContent>
      </Card>
    </>
  )
}

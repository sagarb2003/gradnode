import type { AssignmentStatus } from '@/data/demoCourses'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusStyles: Record<AssignmentStatus, string> = {
  submitted: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  overdue: 'bg-red-100 text-red-800',
}

export default function AssignmentStatusBadge({
  status,
}: {
  status: AssignmentStatus
}) {
  return (
    <Badge className={cn('capitalize', statusStyles[status])}>{status}</Badge>
  )
}

import type { StudentStatus } from '@/api/students'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusStyles: Record<StudentStatus, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  graduated: 'bg-blue-100 text-blue-800',
}

export default function StudentStatusBadge({
  status,
}: {
  status: StudentStatus
}) {
  return (
    <Badge className={cn('capitalize', statusStyles[status])}>{status}</Badge>
  )
}

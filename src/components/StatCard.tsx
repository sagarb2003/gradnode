import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          )}
        </div>
        <div className="bg-muted rounded-lg p-2">
          <Icon className="text-muted-foreground size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

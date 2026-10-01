import { InboxIcon } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <InboxIcon className="size-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

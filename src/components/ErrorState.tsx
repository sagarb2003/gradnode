import { AlertCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = 'Something went wrong while loading the data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <AlertCircleIcon className="size-8 text-destructive" />
      <p className="text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

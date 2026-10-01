import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

// Shown by React Router if a page throws while rendering
export default function RouteErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-2xl font-bold">Something went wrong</p>
      <p className="text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => window.location.reload()}>Reload page</Button>
        <Button variant="outline" asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}

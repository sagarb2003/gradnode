import { Suspense, useState } from 'react'
import {
  GraduationCapIcon,
  Loader2Icon,
  MenuIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  // Only highlight when the URL matches exactly (used for dashboard links)
  end?: boolean
}

type AppLayoutProps = {
  portalName: string
  navItems: NavItem[]
}

export default function AppLayout({ portalName, navItems }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-background md:flex">
        <Logo />
        <SidebarNav navItems={navItems} />
      </aside>

      {/* Mobile sidebar (slides in from the left) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Logo />
          <SidebarNav
            navItems={navItems}
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </Button>
          <h1 className="text-lg font-semibold">{portalName}</h1>
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/">Switch portal</Link>
          </Button>
        </header>

        <main id="main-content" className="mx-auto max-w-6xl p-4 md:p-8">
          {/* Shows a spinner while a lazy-loaded page downloads */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function PageLoader() {
  return (
    <div className="flex justify-center py-20" aria-label="Loading page">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

function Logo() {
  return (
    <Link
      to="/"
      className="flex h-16 items-center gap-2 border-b px-6 font-semibold"
    >
      <GraduationCapIcon className="size-6 text-primary" />
      GradNode
    </Link>
  )
}

type SidebarNavProps = {
  navItems: NavItem[]
  onNavigate?: () => void
}

function SidebarNav({ navItems, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              isActive && 'bg-muted text-foreground',
            )
          }
        >
          <item.icon className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

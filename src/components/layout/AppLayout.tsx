import { useState } from 'react'
import { GraduationCapIcon, MenuIcon, type LucideIcon } from 'lucide-react'
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
}

type AppLayoutProps = {
  portalName: string
  navItems: NavItem[]
}

export default function AppLayout({ portalName, navItems }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-muted/40 min-h-screen">
      {/* Desktop sidebar */}
      <aside className="bg-background fixed inset-y-0 left-0 hidden w-64 flex-col border-r md:flex">
        <Logo />
        <SidebarNav navItems={navItems} />
      </aside>

      {/* Mobile sidebar (slides in from the left) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
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
        <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-3 border-b px-4 md:px-8">
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

        <main className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link
      to="/"
      className="flex h-16 items-center gap-2 border-b px-6 font-semibold"
    >
      <GraduationCapIcon className="text-primary size-6" />
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
          // "end" stops "/admin" from staying active on "/admin/students"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
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

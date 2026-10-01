import { useState } from 'react'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { Link } from 'react-router'
import { useAllStudents, type StudentStatus } from '@/api/students'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import PageHeader from '@/components/PageHeader'
import StudentAvatar from '@/components/StudentAvatar'
import StudentStatusBadge from '@/components/StudentStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const PAGE_SIZE = 10

type StatusFilter = StudentStatus | 'all'

export default function StudentsPage() {
  const { data: students = [], isPending, isError, refetch } = useAllStudents()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const searchText = search.trim().toLowerCase()
  const filteredStudents = students.filter((student) => {
    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter
    const matchesSearch =
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.university.toLowerCase().includes(searchText)
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const firstIndex = (page - 1) * PAGE_SIZE
  const studentsOnPage = filteredStudents.slice(
    firstIndex,
    firstIndex + PAGE_SIZE,
  )

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(value: StatusFilter) {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Students"
          description="Search, filter and manage student records."
        />
        <Button asChild className="mb-6 self-start">
          <Link to="/admin/students/new">
            <PlusIcon />
            Add student
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search by name, email or university"
                aria-label="Search students"
                className="pl-9"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger
                className="w-full sm:w-44"
                aria-label="Filter by status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isPending ? (
            <div className="space-y-2" aria-label="Loading students">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-12" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              message="We couldn't load the students. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              title="No students found"
              description="Try a different search or filter."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">
                      University
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsOnPage.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <StudentAvatar student={student} />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/students/${student.id}`}
                              className="font-medium hover:underline"
                            >
                              {student.firstName} {student.lastName}
                            </Link>
                            <p className="text-muted-foreground max-w-40 truncate text-xs sm:max-w-none">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.university}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {student.age}
                      </TableCell>
                      <TableCell>
                        <StudentStatusBadge status={student.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/students/${student.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between gap-2 text-sm">
                <p className="text-muted-foreground">
                  Showing {firstIndex + 1}–{firstIndex + studentsOnPage.length}{' '}
                  of {filteredStudents.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

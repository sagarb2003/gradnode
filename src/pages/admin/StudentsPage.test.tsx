import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createApiUsers, mockFetch, renderRoutes } from '@/test/utils'
import StudentsPage from './StudentsPage'

function renderStudentsPage() {
  renderRoutes(
    [{ path: '/admin/students', element: <StudentsPage /> }],
    '/admin/students',
  )
}

function getStudentRows() {
  // The first row is the table header
  return screen.getAllByRole('row').slice(1)
}

describe('StudentsPage', () => {
  it('shows 10 students per page and lets the user page through them', async () => {
    const user = userEvent.setup()
    mockFetch(() => ({ users: createApiUsers(25), total: 25 }))
    renderStudentsPage()

    expect(await screen.findByText('Showing 1–10 of 25')).toBeInTheDocument()
    expect(getStudentRows()).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Showing 11–20 of 25')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Showing 21–25 of 25')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('filters students by search text', async () => {
    const user = userEvent.setup()
    mockFetch(() => ({ users: createApiUsers(25), total: 25 }))
    renderStudentsPage()

    await user.type(await screen.findByLabelText('Search students'), 'Last7')

    const rows = getStudentRows()
    expect(rows).toHaveLength(1)
    expect(within(rows[0]).getByText('First7 Last7')).toBeInTheDocument()
  })

  it('filters students by status', async () => {
    const user = userEvent.setup()
    mockFetch(() => ({ users: createApiUsers(25), total: 25 }))
    renderStudentsPage()

    await user.click(await screen.findByLabelText('Filter by status'))
    await user.click(screen.getByRole('option', { name: 'Graduated' }))

    // Ids 5, 10, 15, 20 and 25 are graduated
    expect(screen.getByText('Showing 1–5 of 5')).toBeInTheDocument()
    for (const row of getStudentRows()) {
      expect(within(row).getByText('graduated')).toBeInTheDocument()
    }
  })

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    mockFetch(() => ({ users: createApiUsers(5), total: 5 }))
    renderStudentsPage()

    await user.type(
      await screen.findByLabelText('Search students'),
      'nobody by this name',
    )

    expect(screen.getByText('No students found')).toBeInTheDocument()
  })

  it('shows an error with a retry button when loading fails', async () => {
    const user = userEvent.setup()
    let requestCount = 0
    mockFetch(() => {
      requestCount++
      return requestCount === 1
        ? new Response(null, { status: 500 })
        : { users: createApiUsers(3), total: 3 }
    })
    renderStudentsPage()

    await user.click(await screen.findByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Showing 1–3 of 3')).toBeInTheDocument()
  })
})

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createApiUsers, mockFetch, renderRoutes } from '@/test/utils'
import CreateStudentPage from './CreateStudentPage'
import EditStudentPage from './EditStudentPage'
import StudentDetailsPage from './StudentDetailsPage'
import StudentsPage from './StudentsPage'

const routes = [
  { path: '/admin/students', element: <StudentsPage /> },
  { path: '/admin/students/new', element: <CreateStudentPage /> },
  { path: '/admin/students/:id', element: <StudentDetailsPage /> },
  { path: '/admin/students/:id/edit', element: <EditStudentPage /> },
]

// Answers GET requests with 3 students and echoes back POST/PUT bodies
function mockStudentApi() {
  return mockFetch((_url, options) => {
    if (options?.method === 'POST' || options?.method === 'PUT') {
      return { id: 209, ...JSON.parse(String(options.body)) }
    }
    return { users: createApiUsers(3), total: 3 }
  })
}

describe('Create student', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup()
    const fetchMock = mockStudentApi()
    renderRoutes(routes, '/admin/students/new')

    await user.click(screen.getByRole('button', { name: 'Create student' }))

    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Age is required')).toBeInTheDocument()
    expect(screen.getByText('Select a gender')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('creates a student and shows them in the student list', async () => {
    const user = userEvent.setup()
    const fetchMock = mockStudentApi()
    const { router } = renderRoutes(routes, '/admin/students/new')

    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Phone'), '+1 555-010-0000')
    await user.type(screen.getByLabelText('Age'), '21')
    await user.type(screen.getByLabelText('University'), 'Test University')
    await user.click(screen.getByLabelText('Gender'))
    await user.click(screen.getByRole('option', { name: 'Female' }))
    await user.click(screen.getByRole('button', { name: 'Create student' }))

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/students')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/users/add',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('Edit student', () => {
  it('pre-fills the form with the student data', async () => {
    mockStudentApi()
    renderRoutes(routes, '/admin/students/2/edit')

    expect(await screen.findByLabelText('First name')).toHaveValue('First2')
    expect(screen.getByLabelText('Email')).toHaveValue('student2@example.com')
    expect(screen.getByLabelText('Age')).toHaveValue(20)
  })

  it('saves changes and shows them on the details page', async () => {
    const user = userEvent.setup()
    const fetchMock = mockStudentApi()
    const { router } = renderRoutes(routes, '/admin/students/2/edit')

    const firstNameInput = await screen.findByLabelText('First name')
    await user.clear(firstNameInput)
    await user.type(firstNameInput, 'Grace')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      await screen.findByRole('heading', { name: /Grace Last2/ }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/students/2')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/users/2',
      expect.objectContaining({ method: 'PUT' }),
    )
  })
})

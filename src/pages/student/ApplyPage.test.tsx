import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { emptyApplication } from '@/components/application/applicationSchema'
import { loadDraft, loadSubmittedApplication } from '@/lib/applicationStorage'
import { mockFetch, renderRoutes } from '@/test/utils'
import ApplyPage from './ApplyPage'

const completedApplication = {
  ...emptyApplication,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '+1 555-010-0000',
  dateOfBirth: '2004-03-15',
  highestQualification: 'high-school',
  institution: 'Test High School',
  graduationYear: '2022',
  program: 'data-science',
  startTerm: 'sep-2027',
  studyMode: 'full-time',
  personalStatement:
    'I want to study data science to turn raw data into useful decisions.',
}

function saveTestDraft(step: number, values: object) {
  localStorage.setItem(
    'gradnode:application-draft',
    JSON.stringify({ step, values }),
  )
}

function renderApplyPage() {
  renderRoutes(
    [{ path: '/student/apply', element: <ApplyPage /> }],
    '/student/apply',
  )
}

describe('ApplyPage', () => {
  it('validates only the current step before moving on', async () => {
    const user = userEvent.setup()
    renderApplyPage()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('heading', { name: 'Personal' }),
    ).toBeInTheDocument()
    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument()
    // Fields from later steps are not validated yet
    expect(screen.queryByText('Select a program')).not.toBeInTheDocument()
  })

  it('moves to the next step and saves progress when the step is valid', async () => {
    const user = userEvent.setup()
    renderApplyPage()

    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Phone'), '+1 555-010-0000')
    await user.type(screen.getByLabelText('Date of birth'), '2004-03-15')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      await screen.findByRole('heading', { name: 'Education' }),
    ).toBeInTheDocument()
    expect(loadDraft()).toMatchObject({
      step: 1,
      values: { firstName: 'Ada', email: 'ada@example.com' },
    })
  })

  it('restores the saved step and answers after a refresh', async () => {
    const user = userEvent.setup()
    saveTestDraft(2, { firstName: 'Ada', institution: 'Test High School' })

    renderApplyPage()

    expect(screen.getByRole('heading', { name: 'Program' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous' }))

    expect(screen.getByLabelText('School or university')).toHaveValue(
      'Test High School',
    )
  })

  it('lets the student go back to a step from the review page', async () => {
    const user = userEvent.setup()
    saveTestDraft(4, completedApplication)
    renderApplyPage()

    const educationSection = screen
      .getByRole('heading', { name: 'Education' })
      .closest('section')!
    expect(
      within(educationSection).getByText('Test High School'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Education' }))

    expect(screen.getByLabelText('Graduation year')).toHaveValue('2022')
  })

  it('requires the confirmation checkbox before submitting', async () => {
    const user = userEvent.setup()
    const fetchMock = mockFetch(() => ({ id: 209 }))
    saveTestDraft(4, completedApplication)
    renderApplyPage()

    await user.click(screen.getByRole('button', { name: 'Submit application' }))

    expect(
      screen.getByText('Please confirm before submitting'),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits the application and clears the saved draft', async () => {
    const user = userEvent.setup()
    const fetchMock = mockFetch(() => ({ id: 209 }))
    saveTestDraft(4, completedApplication)
    renderApplyPage()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Submit application' }))

    expect(await screen.findByText('Application submitted')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/users/add',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(loadDraft()).toBeNull()
    expect(loadSubmittedApplication()?.program).toBe('BSc Data Science')
  })

  it('keeps the draft and shows an error when submission fails', async () => {
    const user = userEvent.setup()
    mockFetch(() => new Response(null, { status: 500 }))
    saveTestDraft(4, completedApplication)
    renderApplyPage()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Submit application' }))

    expect(
      await screen.findByText(/Something went wrong while submitting/),
    ).toBeInTheDocument()
    expect(loadDraft()).not.toBeNull()
  })
})

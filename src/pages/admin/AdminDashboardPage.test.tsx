import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createApiUsers, mockFetch, renderRoutes } from '@/test/utils'
import AdminDashboardPage from './AdminDashboardPage'

function renderDashboard() {
  renderRoutes([{ path: '/admin', element: <AdminDashboardPage /> }], '/admin')
}

// Finds the number shown on a stat card by its label
function getStatValue(label: string) {
  return screen.getByText(label).nextElementSibling?.textContent
}

describe('AdminDashboardPage', () => {
  it('shows student statistics from the API', async () => {
    mockFetch(() => ({ users: createApiUsers(15), total: 15 }))
    renderDashboard()

    expect(await screen.findByText('Total students')).toBeInTheDocument()
    expect(getStatValue('Total students')).toBe('15')
    expect(getStatValue('Active')).toBe('8')
    expect(getStatValue('Pending applications')).toBe('4') // ids 3, 6, 9, 12
    expect(getStatValue('Graduated')).toBe('3') // ids 5, 10, 15
  })

  it('lists the newest students first', async () => {
    mockFetch(() => ({ users: createApiUsers(15), total: 15 }))
    renderDashboard()

    const recentNames = await screen.findAllByText(/^First\d+ Last\d+$/)
    expect(recentNames.map((name) => name.textContent)).toEqual([
      'First15 Last15',
      'First14 Last14',
      'First13 Last13',
      'First12 Last12',
      'First11 Last11',
    ])
  })

  it('shows an error state when the API fails', async () => {
    mockFetch(() => new Response(null, { status: 500 }))
    renderDashboard()

    expect(
      await screen.findByText(/couldn't load the student data/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
  })
})

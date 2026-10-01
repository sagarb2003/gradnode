import { expect, test, type Page } from '@playwright/test'

// Mock DummyJSON so the test doesn't depend on a public API being online
async function mockApi(page: Page) {
  await page.route('https://dummyjson.com/users/1?*', (route) =>
    route.fulfill({
      json: {
        id: 1,
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@example.com',
        phone: '+1 555-010-0000',
        birthDate: '1996-5-30',
        age: 29,
        gender: 'female',
        image: '',
        university: 'Test University',
        address: {
          address: '1 Main Street',
          city: 'Phoenix',
          state: 'Arizona',
          postalCode: '85001',
          country: 'United States',
        },
      },
    }),
  )
  await page.route('https://dummyjson.com/users/add', (route) =>
    route.fulfill({ json: { id: 209 } }),
  )
}

async function selectOption(page: Page, label: string, option: string) {
  await page.getByLabel(label).click()
  await page.getByRole('option', { name: option }).click()
}

test('a student completes the application, even after a page refresh', async ({
  page,
}) => {
  await mockApi(page)

  // Start from the student dashboard
  await page.goto('/student')
  await expect(page.getByText('Welcome back, Emily')).toBeVisible()
  await expect(page.getByText('Not started')).toBeVisible()
  await page.getByRole('link', { name: 'Start application' }).click()

  // Step 1: Personal information
  await page.getByLabel('First name').fill('Ada')
  await page.getByLabel('Last name').fill('Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Phone').fill('+1 555-010-0001')
  await page.getByLabel('Date of birth').fill('2004-03-15')
  await page.getByRole('button', { name: 'Next' }).click()

  // Refreshing keeps the student on the same step
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible()

  // Step 2: Education
  await selectOption(page, 'Highest qualification', 'High school diploma')
  await page.getByLabel('School or university').fill('Test High School')
  await page.getByLabel('Graduation year').fill('2022')
  await page.getByRole('button', { name: 'Next' }).click()

  // Step 3: Program
  await selectOption(page, 'Program', 'BSc Data Science')
  await selectOption(page, 'Start term', 'September 2027')
  await selectOption(page, 'Study mode', 'Full-time')
  await page.getByRole('button', { name: 'Next' }).click()

  // Step 4: Additional information
  await page
    .getByLabel('Personal statement')
    .fill(
      'I want to study data science to turn raw data into useful decisions.',
    )
  await page.getByRole('button', { name: 'Next' }).click()

  // Step 5: Review shows the answers from before the refresh
  await expect(page.getByText('Ada Lovelace')).toBeVisible()
  await expect(page.getByText('BSc Data Science')).toBeVisible()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Submit application' }).click()

  // Success, and the dashboard shows the new status
  await expect(page.getByText('Application submitted')).toBeVisible()
  await page.getByRole('link', { name: 'Go to dashboard' }).click()
  await expect(page.getByText('Under review')).toBeVisible()
})

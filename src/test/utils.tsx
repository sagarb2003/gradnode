import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router'
import { vi } from 'vitest'

// Renders the given routes with a fresh QueryClient and an in-memory router
export function renderRoutes(routes: RouteObject[], initialPath: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { router }
}

// Replaces fetch with a mock. The handler receives the URL and request
// options and returns the JSON body (or a Response for errors).
export function mockFetch(
  handler: (url: string, options?: RequestInit) => unknown,
) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (input, options) => {
      const result = handler(String(input), options)
      if (result instanceof Response) return result
      return new Response(JSON.stringify(result), { status: 200 })
    })
}

// Fake DummyJSON users. Their ids decide the derived status:
// multiples of 5 are "graduated", multiples of 3 are "pending", the rest "active".
export function createApiUsers(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    return {
      id,
      firstName: `First${id}`,
      lastName: `Last${id}`,
      email: `student${id}@example.com`,
      phone: '+1 555-010-0000',
      age: 20,
      gender: 'female',
      university: id % 2 === 0 ? 'Boston University' : 'Harvard University',
      image: '',
    }
  })
}

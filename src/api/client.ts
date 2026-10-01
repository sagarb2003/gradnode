// DummyJSON is a free public mock API: https://dummyjson.com/docs/users
// Its "users" resource is used as our student data.
const API_BASE_URL = 'https://dummyjson.com'

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

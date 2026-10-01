import { describe, expect, it } from 'vitest'
import { mockFetch } from '@/test/utils'
import { updateStudent, type StudentInput } from './students'

const input: StudentInput = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '+1 555-010-0000',
  age: 21,
  gender: 'female',
  university: 'Test University',
  status: 'active',
}

describe('updateStudent', () => {
  it('sends a PUT request for students that exist in the API', async () => {
    const fetchMock = mockFetch(() => ({ id: 1 }))

    await updateStudent(1, input)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/users/1',
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('skips the request for students created in the app', async () => {
    // DummyJSON would return 404 for these, because it never saved them
    const fetchMock = mockFetch(() => ({}))

    await updateStudent(209, input)

    expect(fetchMock).not.toHaveBeenCalled()
  })
})

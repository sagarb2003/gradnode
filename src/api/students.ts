import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'

export type StudentStatus = 'active' | 'pending' | 'graduated'

// The fields we use from a DummyJSON user
type ApiUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  gender: string
  university: string
  image: string
}

export type Student = ApiUser & {
  status: StudentStatus
}

type UsersResponse = {
  users: ApiUser[]
  total: number
  skip: number
  limit: number
}

const userFields = 'firstName,lastName,email,age,gender,university,image'

// DummyJSON users have no enrolment status, so we derive a stable one from the id.
function getStatusFromId(id: number): StudentStatus {
  if (id % 5 === 0) return 'graduated'
  if (id % 3 === 0) return 'pending'
  return 'active'
}

function toStudent(user: ApiUser): Student {
  return { ...user, status: getStatusFromId(user.id) }
}

export async function getAllStudents(): Promise<Student[]> {
  // limit=0 tells DummyJSON to return every user
  const data = await apiFetch<UsersResponse>(
    `/users?limit=0&select=${userFields}`,
  )
  return data.users.map(toStudent)
}

export function useAllStudents() {
  return useQuery({
    queryKey: ['students', 'all'],
    queryFn: getAllStudents,
  })
}

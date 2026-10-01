import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { apiFetch } from './client'

export type StudentStatus = 'active' | 'pending' | 'graduated'

// The fields we use from a DummyJSON user
type ApiUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  university: string
  image: string
}

export type Student = ApiUser & {
  status: StudentStatus
}

// The fields an admin can fill in when creating or editing a student
export type StudentInput = Omit<Student, 'id' | 'image'>

type UsersResponse = {
  users: ApiUser[]
  total: number
  skip: number
  limit: number
}

const userFields = 'firstName,lastName,email,phone,age,gender,university,image'

// DummyJSON has 208 users and never saves new ones. Students created in the
// app get ids above this and only exist in the TanStack Query cache.
const LAST_API_STUDENT_ID = 208

const allStudentsKey = ['students', 'all']

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

export async function createStudent(input: StudentInput): Promise<ApiUser> {
  return apiFetch<ApiUser>('/users/add', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateStudent(
  id: number,
  input: StudentInput,
): Promise<void> {
  // Students created in the app don't exist on the server, so there is nothing to send
  if (id > LAST_API_STUDENT_ID) return

  await apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function useAllStudents() {
  return useQuery({
    queryKey: allStudentsKey,
    queryFn: getAllStudents,
    // DummyJSON doesn't save changes, so refetching would undo any students
    // created or edited in this session. We fetch once and keep the cache.
    staleTime: Infinity,
  })
}

// Makes sure the full student list is in the cache before we change it
function loadAllStudents(queryClient: QueryClient) {
  return queryClient.ensureQueryData({
    queryKey: allStudentsKey,
    queryFn: getAllStudents,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudent,
    onSuccess: async (_createdUser, input) => {
      const students = await loadAllStudents(queryClient)

      // DummyJSON returns the same id for every new user, so we pick the next free id
      const highestId = Math.max(...students.map((student) => student.id))
      const newStudent: Student = { ...input, id: highestId + 1, image: '' }

      queryClient.setQueryData(allStudentsKey, [...students, newStudent])
    },
  })
}

export function useUpdateStudent(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: StudentInput) => updateStudent(id, input),
    onSuccess: async (_result, input) => {
      const students = await loadAllStudents(queryClient)

      const updatedStudents = students.map((student) =>
        student.id === id ? { ...student, ...input } : student,
      )
      queryClient.setQueryData(allStudentsKey, updatedStudents)
    },
  })
}

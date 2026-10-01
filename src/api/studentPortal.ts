import { useMutation, useQuery } from '@tanstack/react-query'
import type { ApplicationValues } from '@/components/application/applicationSchema'
import { apiFetch } from './client'

// There is no login, so the portal always shows DummyJSON user #1
// as the signed-in student.
const CURRENT_STUDENT_ID = 1

export type StudentProfile = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  age: number
  gender: string
  image: string
  university: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

const profileFields =
  'firstName,lastName,email,phone,birthDate,age,gender,image,university,address'

export function getCurrentStudent(): Promise<StudentProfile> {
  return apiFetch<StudentProfile>(
    `/users/${CURRENT_STUDENT_ID}?select=${profileFields}`,
  )
}

// DummyJSON has no "applications" resource, so we send the application
// as a new user. The API returns it with an id but does not save it.
export function submitApplication(values: ApplicationValues) {
  return apiFetch<{ id: number }>('/users/add', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function useCurrentStudent() {
  return useQuery({
    queryKey: ['current-student'],
    queryFn: getCurrentStudent,
  })
}

export function useSubmitApplication() {
  return useMutation({ mutationFn: submitApplication })
}

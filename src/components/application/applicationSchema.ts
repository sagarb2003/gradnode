import { z } from 'zod'

export const qualifications = [
  { value: 'high-school', label: 'High school diploma' },
  { value: 'associate', label: 'Associate degree' },
  { value: 'bachelor', label: "Bachelor's degree" },
  { value: 'master', label: "Master's degree" },
]

export const programs = [
  { value: 'computer-science', label: 'BSc Computer Science' },
  { value: 'data-science', label: 'BSc Data Science' },
  { value: 'business', label: 'BA Business Administration' },
  { value: 'design', label: 'BA Digital Design' },
]

export const startTerms = [
  { value: 'jan-2027', label: 'January 2027' },
  { value: 'sep-2027', label: 'September 2027' },
]

export const studyModes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
]

const currentYear = new Date().getFullYear()

export const applicationSchema = z.object({
  // Step 1: Personal information
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (date) => new Date(date) < new Date(),
      'Date of birth must be in the past',
    ),

  // Step 2: Education
  highestQualification: z.string().min(1, 'Select your highest qualification'),
  institution: z.string().trim().min(2, 'School or university is required'),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, 'Enter a 4-digit year')
    .refine(
      (year) => Number(year) >= 1960 && Number(year) <= currentYear + 1,
      `Enter a year between 1960 and ${currentYear + 1}`,
    ),

  // Step 3: Program
  program: z.string().min(1, 'Select a program'),
  startTerm: z.string().min(1, 'Select a start term'),
  studyMode: z.string().min(1, 'Select a study mode'),

  // Step 4: Additional information
  personalStatement: z
    .string()
    .trim()
    .min(50, 'Write at least 50 characters')
    .max(1000, 'Keep it under 1000 characters'),
  additionalNotes: z.string().max(500, 'Keep it under 500 characters'),

  // Step 5: Review
  agreeToTerms: z
    .boolean()
    .refine((agreed) => agreed, 'Please confirm before submitting'),
})

export type ApplicationValues = z.infer<typeof applicationSchema>

export const emptyApplication: ApplicationValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  highestQualification: '',
  institution: '',
  graduationYear: '',
  program: '',
  startTerm: '',
  studyMode: '',
  personalStatement: '',
  additionalNotes: '',
  agreeToTerms: false,
}

type Step = {
  title: string
  fields: (keyof ApplicationValues)[]
}

// The fields on each step are validated before moving to the next step
export const steps: Step[] = [
  {
    title: 'Personal',
    fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
  },
  {
    title: 'Education',
    fields: ['highestQualification', 'institution', 'graduationYear'],
  },
  { title: 'Program', fields: ['program', 'startTerm', 'studyMode'] },
  { title: 'Additional', fields: ['personalStatement', 'additionalNotes'] },
  { title: 'Review', fields: ['agreeToTerms'] },
]

// Turns a stored value (e.g. "computer-science") into its label
export function getOptionLabel(
  options: { value: string; label: string }[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value
}

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { StudentInput } from '@/api/students'
import { SelectField, TextField } from '@/components/FormFields'
import { Button } from '@/components/ui/button'

const studentSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number'),
  age: z
    .number({ error: 'Age is required' })
    .int('Age must be a whole number')
    .min(16, 'Students must be at least 16')
    .max(100, 'Enter a valid age'),
  gender: z.enum(['male', 'female', 'other'], { error: 'Select a gender' }),
  university: z.string().trim().min(2, 'University is required'),
  status: z.enum(['active', 'pending', 'graduated'], {
    error: 'Select a status',
  }),
})

type StudentFormValues = z.infer<typeof studentSchema>

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'graduated', label: 'Graduated' },
]

type StudentFormProps = {
  defaultValues?: Partial<StudentInput>
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: StudentFormValues) => void
  onCancel: () => void
}

export default function StudentForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      university: '',
      status: 'pending',
      ...defaultValues,
    },
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField name="firstName" label="First name" />
          <TextField name="lastName" label="Last name" />
          <TextField name="email" label="Email" type="email" />
          <TextField name="phone" label="Phone" type="tel" />
          <TextField name="age" label="Age" type="number" />
          <SelectField
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={genderOptions}
          />
          <TextField name="university" label="University" />
          <SelectField
            name="status"
            label="Status"
            placeholder="Select status"
            options={statusOptions}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { StudentInput } from '@/api/students'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field data-invalid={!!errors.firstName}>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <Input
            id="firstName"
            aria-invalid={!!errors.firstName}
            {...register('firstName')}
          />
          <FieldError errors={[errors.firstName]} />
        </Field>

        <Field data-invalid={!!errors.lastName}>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <Input
            id="lastName"
            aria-invalid={!!errors.lastName}
            {...register('lastName')}
          />
          <FieldError errors={[errors.lastName]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
            id="phone"
            type="tel"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field data-invalid={!!errors.age}>
          <FieldLabel htmlFor="age">Age</FieldLabel>
          <Input
            id="age"
            type="number"
            aria-invalid={!!errors.age}
            {...register('age', { valueAsNumber: true })}
          />
          <FieldError errors={[errors.age]} />
        </Field>

        <Field data-invalid={!!errors.gender}>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="gender"
                  className="w-full"
                  aria-invalid={!!errors.gender}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.gender]} />
        </Field>

        <Field data-invalid={!!errors.university}>
          <FieldLabel htmlFor="university">University</FieldLabel>
          <Input
            id="university"
            aria-invalid={!!errors.university}
            {...register('university')}
          />
          <FieldError errors={[errors.university]} />
        </Field>

        <Field data-invalid={!!errors.status}>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="status"
                  className="w-full"
                  aria-invalid={!!errors.status}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.status]} />
        </Field>
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
  )
}

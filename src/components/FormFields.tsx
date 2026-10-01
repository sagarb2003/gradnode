import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Small field components for forms wrapped in react-hook-form's <FormProvider>.
// Each one renders a label, the input and its validation error.

type BaseFieldProps = {
  name: string
  label: string
}

export function TextField({
  name,
  label,
  type = 'text',
}: BaseFieldProps & { type?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[name]?.message as string | undefined

  return (
    <Field data-invalid={!!errorMessage}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        type={type}
        aria-invalid={!!errorMessage}
        // Number inputs give us a number instead of a string
        {...register(name, { valueAsNumber: type === 'number' })}
      />
      <FieldError>{errorMessage}</FieldError>
    </Field>
  )
}

export function TextareaField({
  name,
  label,
  placeholder,
}: BaseFieldProps & { placeholder?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[name]?.message as string | undefined

  return (
    <Field data-invalid={!!errorMessage}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea
        id={name}
        rows={5}
        placeholder={placeholder}
        aria-invalid={!!errorMessage}
        {...register(name)}
      />
      <FieldError>{errorMessage}</FieldError>
    </Field>
  )
}

type SelectFieldProps = BaseFieldProps & {
  options: { value: string; label: string }[]
  placeholder: string
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[name]?.message as string | undefined

  return (
    <Field data-invalid={!!errorMessage}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              className="w-full"
              aria-invalid={!!errorMessage}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError>{errorMessage}</FieldError>
    </Field>
  )
}

import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  getOptionLabel,
  programs,
  qualifications,
  startTerms,
  studyModes,
  type ApplicationValues,
} from './applicationSchema'

type ReviewStepProps = {
  onEditStep: (step: number) => void
}

export default function ReviewStep({ onEditStep }: ReviewStepProps) {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<ApplicationValues>()
  const values = getValues()

  const sections = [
    {
      title: 'Personal information',
      step: 0,
      items: [
        ['Name', `${values.firstName} ${values.lastName}`],
        ['Email', values.email],
        ['Phone', values.phone],
        ['Date of birth', values.dateOfBirth],
      ],
    },
    {
      title: 'Education',
      step: 1,
      items: [
        [
          'Highest qualification',
          getOptionLabel(qualifications, values.highestQualification),
        ],
        ['School or university', values.institution],
        ['Graduation year', values.graduationYear],
      ],
    },
    {
      title: 'Program',
      step: 2,
      items: [
        ['Program', getOptionLabel(programs, values.program)],
        ['Start term', getOptionLabel(startTerms, values.startTerm)],
        ['Study mode', getOptionLabel(studyModes, values.studyMode)],
      ],
    },
    {
      title: 'Additional information',
      step: 3,
      items: [
        ['Personal statement', values.personalStatement],
        ['Additional notes', values.additionalNotes || '—'],
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.title} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">{section.title}</h3>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => onEditStep(section.step)}
              aria-label={`Edit ${section.title}`}
            >
              Edit
            </Button>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {section.items.map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground text-sm">{label}</dt>
                <dd className="text-sm break-words whitespace-pre-line">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <Field orientation="horizontal" data-invalid={!!errors.agreeToTerms}>
        <Controller
          control={control}
          name="agreeToTerms"
          render={({ field }) => (
            <Checkbox
              id="agreeToTerms"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              aria-invalid={!!errors.agreeToTerms}
            />
          )}
        />
        <FieldLabel htmlFor="agreeToTerms" className="font-normal">
          I confirm that the information above is correct.
        </FieldLabel>
      </Field>
      <FieldError>{errors.agreeToTerms?.message}</FieldError>
    </div>
  )
}

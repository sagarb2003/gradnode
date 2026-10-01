import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2Icon } from 'lucide-react'
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form'
import { Link } from 'react-router'
import { useSubmitApplication } from '@/api/studentPortal'
import {
  AdditionalStep,
  EducationStep,
  PersonalStep,
  ProgramStep,
} from '@/components/application/ApplicationSteps'
import {
  applicationSchema,
  emptyApplication,
  getOptionLabel,
  programs,
  steps,
  type ApplicationValues,
} from '@/components/application/applicationSchema'
import ReviewStep from '@/components/application/ReviewStep'
import StepProgress from '@/components/application/StepProgress'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  clearDraft,
  clearSubmittedApplication,
  loadDraft,
  loadSubmittedApplication,
  saveDraft,
  saveSubmittedApplication,
  type SubmittedApplication,
} from '@/lib/applicationStorage'

export default function ApplyPage() {
  const [submittedApplication, setSubmittedApplication] = useState(
    loadSubmittedApplication,
  )

  function handleStartNew() {
    clearSubmittedApplication()
    setSubmittedApplication(null)
  }

  return (
    <>
      <PageHeader
        title="Apply to a program"
        description="Complete your application in a few simple steps. Your progress is saved automatically."
      />
      {submittedApplication ? (
        <SubmissionSuccess
          application={submittedApplication}
          onStartNew={handleStartNew}
        />
      ) : (
        <ApplicationForm onSubmitted={setSubmittedApplication} />
      )}
    </>
  )
}

type ApplicationFormProps = {
  onSubmitted: (application: SubmittedApplication) => void
}

function ApplicationForm({ onSubmitted }: ApplicationFormProps) {
  // Restore any saved progress once, when the form first renders
  const [savedDraft] = useState(loadDraft)
  const [step, setStep] = useState(savedDraft?.step ?? 0)

  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { ...emptyApplication, ...savedDraft?.values },
    // Check a field when it loses focus, then again on every change
    mode: 'onTouched',
  })
  const submitApplication = useSubmitApplication()

  const isFirstStep = step === 0
  const isLastStep = step === steps.length - 1

  // Save the answers to localStorage every time a field changes
  useEffect(() => {
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => saveDraft({ step, values }),
    })
    return unsubscribe
  }, [form, step])

  function goToStep(newStep: number) {
    setStep(newStep)
    saveDraft({ step: newStep, values: form.getValues() })
    window.scrollTo({ top: 0 })
  }

  async function handleNext() {
    // Only validate the fields on the current step
    const isStepValid = await form.trigger(steps[step].fields)
    if (isStepValid) {
      goToStep(step + 1)
    }
  }

  function handleValidSubmit(values: ApplicationValues) {
    submitApplication.mutate(values, {
      onSuccess: () => {
        const application = {
          program: getOptionLabel(programs, values.program),
          submittedAt: new Date().toISOString(),
        }
        saveSubmittedApplication(application)
        clearDraft()
        onSubmitted(application)
      },
    })
  }

  // If an earlier step is somehow invalid, send the student back to it
  function handleInvalidSubmit(errors: FieldErrors<ApplicationValues>) {
    const firstInvalidStep = steps.findIndex((s) =>
      s.fields.some((field) => errors[field]),
    )
    if (firstInvalidStep !== -1 && firstInvalidStep !== step) {
      goToStep(firstInvalidStep)
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Pressing Enter on an earlier step should go to the next step, not submit
    if (!isLastStep) {
      event.preventDefault()
      handleNext()
      return
    }
    form.handleSubmit(handleValidSubmit, handleInvalidSubmit)(event)
  }

  return (
    <Card>
      <CardContent>
        <StepProgress currentStep={step} />

        <FormProvider {...form}>
          <form onSubmit={handleFormSubmit} noValidate>
            <h3 className="mb-6 text-lg font-semibold">{steps[step].title}</h3>

            {step === 0 && <PersonalStep />}
            {step === 1 && <EducationStep />}
            {step === 2 && <ProgramStep />}
            {step === 3 && <AdditionalStep />}
            {step === 4 && <ReviewStep onEditStep={goToStep} />}

            {submitApplication.isError && (
              <p
                role="alert"
                className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              >
                Something went wrong while submitting. Your answers are saved,
                so please try again.
              </p>
            )}

            <div className="mt-8 flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(step - 1)}
                disabled={isFirstStep}
              >
                Previous
              </Button>
              {isLastStep ? (
                <Button type="submit" disabled={submitApplication.isPending}>
                  {submitApplication.isPending
                    ? 'Submitting...'
                    : 'Submit application'}
                </Button>
              ) : (
                <Button type="submit">Next</Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

type SubmissionSuccessProps = {
  application: SubmittedApplication
  onStartNew: () => void
}

function SubmissionSuccess({
  application,
  onStartNew,
}: SubmissionSuccessProps) {
  const submittedDate = new Date(application.submittedAt).toLocaleDateString()

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader>
        <CheckCircle2Icon className="mx-auto mb-2 size-12 text-green-600" />
        <CardTitle className="text-xl">Application submitted</CardTitle>
        <CardDescription>
          Thanks! Your application for <strong>{application.program}</strong>{' '}
          was received on {submittedDate}. We'll be in touch soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-2 sm:flex-row">
        <Button asChild>
          <Link to="/student">Go to dashboard</Link>
        </Button>
        <Button variant="outline" onClick={onStartNew}>
          Start a new application
        </Button>
      </CardContent>
    </Card>
  )
}

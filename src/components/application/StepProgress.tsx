import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { steps } from './applicationSchema'

export default function StepProgress({ currentStep }: { currentStep: number }) {
  const progressPercent = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="mb-8">
      {/* Mobile: simple text and progress bar */}
      <div className="sm:hidden">
        <p className="mb-2 text-sm font-medium">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
        <div className="bg-muted h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop: numbered steps */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isComplete = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.title}
              className="flex flex-1 items-center gap-2 last:flex-none"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
                  isComplete &&
                    'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary',
                  !isComplete && !isCurrent && 'text-muted-foreground',
                )}
              >
                {isComplete ? <CheckIcon className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  'text-sm',
                  isCurrent ? 'font-medium' : 'text-muted-foreground',
                )}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <span className="bg-border mx-2 h-px flex-1" />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

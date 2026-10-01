import { SelectField, TextareaField, TextField } from '@/components/FormFields'
import {
  programs,
  qualifications,
  startTerms,
  studyModes,
} from './applicationSchema'

export function PersonalStep() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField name="firstName" label="First name" />
      <TextField name="lastName" label="Last name" />
      <TextField name="email" label="Email" type="email" />
      <TextField name="phone" label="Phone" type="tel" />
      <TextField name="dateOfBirth" label="Date of birth" type="date" />
    </div>
  )
}

export function EducationStep() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SelectField
        name="highestQualification"
        label="Highest qualification"
        placeholder="Select qualification"
        options={qualifications}
      />
      <TextField name="institution" label="School or university" />
      <TextField name="graduationYear" label="Graduation year" />
    </div>
  )
}

export function ProgramStep() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <SelectField
          name="program"
          label="Program"
          placeholder="Select a program"
          options={programs}
        />
      </div>
      <SelectField
        name="startTerm"
        label="Start term"
        placeholder="Select a term"
        options={startTerms}
      />
      <SelectField
        name="studyMode"
        label="Study mode"
        placeholder="Select study mode"
        options={studyModes}
      />
    </div>
  )
}

export function AdditionalStep() {
  return (
    <div className="space-y-6">
      <TextareaField
        name="personalStatement"
        label="Personal statement"
        placeholder="Why do you want to join this program? (at least 50 characters)"
      />
      <TextareaField
        name="additionalNotes"
        label="Anything else we should know? (optional)"
      />
    </div>
  )
}

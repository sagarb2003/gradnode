import type { ApplicationValues } from '@/components/application/applicationSchema'

// The application form saves progress in localStorage, so a refresh
// doesn't lose the student's answers.
const DRAFT_KEY = 'gradnode:application-draft'
const SUBMITTED_KEY = 'gradnode:application-submitted'

export type ApplicationDraft = {
  step: number
  values: Partial<ApplicationValues>
}

export type SubmittedApplication = {
  program: string
  submittedAt: string
}

function readJson<T>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch {
    // Storage can be blocked (e.g. private mode) or hold invalid JSON
    return null
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the form still works, it just won't survive a refresh
  }
}

function removeKey(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore, same as above
  }
}

export function loadDraft() {
  return readJson<ApplicationDraft>(DRAFT_KEY)
}

export function saveDraft(draft: ApplicationDraft) {
  writeJson(DRAFT_KEY, draft)
}

export function clearDraft() {
  removeKey(DRAFT_KEY)
}

export function loadSubmittedApplication() {
  return readJson<SubmittedApplication>(SUBMITTED_KEY)
}

export function saveSubmittedApplication(application: SubmittedApplication) {
  writeJson(SUBMITTED_KEY, application)
}

export function clearSubmittedApplication() {
  removeKey(SUBMITTED_KEY)
}

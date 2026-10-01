import { describe, expect, it } from 'vitest'
import { clearDraft, loadDraft, saveDraft } from './applicationStorage'

describe('applicationStorage', () => {
  it('saves and loads a draft', () => {
    saveDraft({ step: 2, values: { firstName: 'Ada' } })

    expect(loadDraft()).toEqual({ step: 2, values: { firstName: 'Ada' } })
  })

  it('returns null when there is no draft', () => {
    expect(loadDraft()).toBeNull()
  })

  it('clears the draft', () => {
    saveDraft({ step: 1, values: {} })
    clearDraft()

    expect(loadDraft()).toBeNull()
  })

  it('ignores invalid saved data instead of crashing', () => {
    localStorage.setItem('gradnode:application-draft', '{not valid json')

    expect(loadDraft()).toBeNull()
  })
})

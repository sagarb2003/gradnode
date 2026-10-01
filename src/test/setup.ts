import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

// jsdom doesn't implement these browser APIs, but Radix UI (used by the
// shadcn Select) calls them. Simple stubs are enough for tests.
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.releasePointerCapture = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

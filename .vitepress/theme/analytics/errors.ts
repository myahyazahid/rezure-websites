import { record } from './transport'
import { clip } from './util'

/** A broken page can throw on every frame; ten reports per load says enough. */
const MAX_ERRORS_PER_LOAD = 10

let reported = 0
let reporting = false

const lineOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : null

function report(message: string, source: string | null, line: number | null, column: number | null, stack: unknown): void {
  // `reporting` stops an error thrown while reporting from feeding back into itself.
  if (reporting || reported >= MAX_ERRORS_PER_LOAD) return
  reporting = true
  reported++

  try {
    record('error', {
      message: clip(message || 'Unknown error', 1000),
      source: clip(source || null, 2048),
      line,
      column,
      stack: typeof stack === 'string' && stack ? clip(stack, 8000) : null
    })
  } finally {
    reporting = false
  }
}

function describe(reason: unknown): string {
  if (reason instanceof Error) return reason.message || reason.name
  if (typeof reason === 'string') return reason
  try {
    return JSON.stringify(reason) ?? String(reason)
  } catch {
    return String(reason)
  }
}

function onError(event: Event): void {
  try {
    // Resource load failures (img/script 404s) arrive as plain Events; only script errors are ErrorEvents.
    if (!(event instanceof ErrorEvent)) return
    report(
      event.message || describe(event.error),
      event.filename,
      lineOrNull(event.lineno),
      lineOrNull(event.colno),
      (event.error as Error | undefined)?.stack
    )
  } catch {
    // Ignore.
  }
}

function onUnhandledRejection(event: PromiseRejectionEvent): void {
  try {
    const reason = event.reason
    report(
      `Unhandled rejection: ${describe(reason)}`,
      null,
      null,
      null,
      (reason as Error | undefined)?.stack
    )
  } catch {
    // Ignore.
  }
}

export function installErrors(): void {
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onUnhandledRejection)
}

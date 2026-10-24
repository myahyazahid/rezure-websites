import { getFirstVisitAt, type SessionInfo } from './identity'
import { clip } from './util'

/** Non-standard navigator fields; absent in Firefox/Safari, hence all optional. */
interface ExtendedNavigator extends Navigator {
  connection?: { effectiveType?: string }
  deviceMemory?: number
  msDoNotTrack?: string
}

const intOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null

function prefersDark(): boolean | null {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return null
  }
}

function timezone(): string | null {
  try {
    return clip(Intl.DateTimeFormat().resolvedOptions().timeZone, 64)
  } catch {
    return null
  }
}

/**
 * The batch-level `context` block. Built at send time rather than once, because
 * the viewport, site theme and connection type can all change during a visit.
 */
export function buildContext(session: SessionInfo): Record<string, unknown> {
  const nav = navigator as ExtendedNavigator
  const osDark = prefersDark()
  const dnt = nav.doNotTrack ?? (window as { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack

  return {
    is_new_visitor: session.is_new_visitor,
    visit_number: session.visit_number,
    first_visit_at: getFirstVisitAt(),
    screen_width: intOrNull(screen?.width),
    screen_height: intOrNull(screen?.height),
    viewport_width: intOrNull(window.innerWidth),
    viewport_height: intOrNull(window.innerHeight),
    pixel_ratio: typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : null,
    language: clip(nav.language, 35),
    languages: Array.isArray(nav.languages)
      ? nav.languages.slice(0, 10).map((language) => language.slice(0, 35))
      : null,
    timezone: timezone(),
    color_scheme: osDark === null ? null : osDark ? 'dark' : 'light',
    site_theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    connection: clip(nav.connection?.effectiveType, 16),
    cpu_cores: intOrNull(nav.hardwareConcurrency),
    memory_gb: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    touch_points: intOrNull(nav.maxTouchPoints),
    do_not_track: dnt === '1' || dnt === 'yes'
  }
}

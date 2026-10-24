import { storageGet, storageRemove, storageSet } from './util'

/** Same variable the download page uses; the analytics endpoints live under it. */
export const apiBase = (import.meta.env.VITE_REZURE_API_BASE ?? '').replace(/\/+$/, '')

/** Tracked download link, or null when there is no API to count it. */
export const siteDownloadUrl = apiBase ? `${apiBase}/site/download` : null

export const hitUrl = apiBase ? `${apiBase}/site/hit` : null

/**
 * Hosts allowed to report. Keeps `docs:dev`, `docs:preview` and any mirror or
 * preview deploy from polluting production numbers — the server drops foreign
 * hosts as well, but there is no point sending them.
 */
const allowedHosts = (import.meta.env.VITE_REZURE_ANALYTICS_HOSTS ?? 'rezure.redscale.my.id')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean)

const IGNORE_KEY = 'rz_ignore'

/**
 * `?rz_ignore=1` / `?rz_ignore=0` toggles the owner's opt-out for this browser,
 * so the site's own visits don't count. Logged so it is visible that it took.
 */
export function applyOptOutParam(): void {
  let flag: string | null = null
  try {
    flag = new URLSearchParams(location.search).get('rz_ignore')
  } catch {
    return
  }

  if (flag === '1' && storageGet(IGNORE_KEY) !== '1') {
    storageSet(IGNORE_KEY, '1')
    console.info('[rezure analytics] Tracking disabled for this browser (rz_ignore=1).')
  } else if (flag === '0' && storageGet(IGNORE_KEY) !== null) {
    storageRemove(IGNORE_KEY)
    console.info('[rezure analytics] Tracking re-enabled for this browser (rz_ignore=0).')
  }
}

export const isOptedOut = (): boolean => storageGet(IGNORE_KEY) === '1'

/** Every reason not to track, checked once at install. Prerendering is handled by the caller, which waits it out. */
export function shouldTrack(): boolean {
  if (!hitUrl) return false
  if (!allowedHosts.includes(location.hostname.toLowerCase())) return false
  if (navigator.webdriver) return false
  return !isOptedOut()
}

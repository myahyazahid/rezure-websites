/**
 * Website analytics tracker — reports to the Rezure API's `POST /site/hit`.
 * Payload contract: api-documentation/website-analytics-api.md.
 *
 * Nothing in this folder touches `window` or `document` at import time:
 * VitePress server-renders every page at build time and imports the theme
 * there too. All browser work starts inside installAnalytics().
 */
import type { Router } from 'vitepress'
import { applyOptOutParam, shouldTrack } from './config'
import { installClicks } from './clicks'
import { emitEngagement, installEngagement } from './engagement'
import { installErrors } from './errors'
import { installEvents } from './events'
import { currentSession, getVisitorId, initVisitor, sessionForPageview } from './identity'
import { installPageviews } from './pageview'
import { state } from './state'
import { flush, isTransportActive, startTransport } from './transport'
import { installVitals } from './vitals'
import { uuid, whenActivated } from './util'

export { siteDownloadUrl } from './config'

/** The tab is going away (or into the background, which on mobile is often the last chance). */
function onLeave(): void {
  emitEngagement()
  flush()
}

export function installAnalytics(router: Router): void {
  if (import.meta.env.SSR || typeof window === 'undefined') return

  try {
    applyOptOutParam()
    if (!shouldTrack()) return

    // Allocated up front so vitals and early errors have a pageview to belong to
    // before the first route-change hook has run.
    const initialPageviewId = uuid()
    state.pageviewId = initialPageviewId

    // Registered synchronously: enhanceApp is followed immediately by the
    // router's initial go(), which is what fires the first pageview.
    installPageviews(router, initialPageviewId)

    whenActivated(() => {
      try {
        initVisitor()
        // Opened now rather than in the first route hook so hits that land
        // before it (navigation timing, early errors) already have a session.
        sessionForPageview(location.href)
        startTransport()
        installEngagement()
        installEvents()
        installClicks()
        installErrors()
        installVitals(initialPageviewId)

        window.addEventListener('pagehide', onLeave)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') onLeave()
        })
      } catch {
        // Analytics must never break the site.
      }
    })
  } catch {
    // Same.
  }
}

/**
 * The tracked download link with this visit's ids attached, so the server can
 * tie the download to the visitor and the page it came from. Called at click
 * time; returns the link untouched when tracking is off — the server still
 * counts the download, just anonymously.
 */
export function downloadUrlWithIdentity(base: string): string {
  try {
    const session = currentSession()
    if (!isTransportActive() || !session) return base

    const url = new URL(base)
    url.searchParams.set('vid', getVisitorId())
    url.searchParams.set('sid', session.id)
    if (state.pageviewId) url.searchParams.set('pid', state.pageviewId)
    return url.toString()
  } catch {
    return base
  }
}

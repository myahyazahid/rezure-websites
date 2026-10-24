import { nextTick } from 'vue'
import type { Router } from 'vitepress'
import { applyOptOutParam, isOptedOut } from './config'
import { beginEngagement, emitEngagement } from './engagement'
import { checkBlogReadComplete } from './events'
import { sessionForPageview } from './identity'
import { state } from './state'
import { isTransportActive, record, stopTransport } from './transport'
import { clip, uuid, whenActivated } from './util'

let isFirstPageview = true
let previousUrl: string | null = null
/** pathname + search of the current pageview; hash-only history moves aren't new pages. */
let currentPageKey: string | null = null

/**
 * VitePress calls onAfterRouteChange for the initial `router.go()` as well as
 * for every client-side navigation and back/forward, so this one hook covers
 * the first load too. Any hook already set (by the theme or a plugin) is kept
 * and runs first.
 */
export function installPageviews(router: Router, initialPageviewId: string): void {
  const previousHook = router.onAfterRouteChange ?? router.onAfterRouteChanged

  router.onAfterRouteChange = async (to: string) => {
    try {
      await previousHook?.(to)
    } finally {
      whenActivated(() => onRouteChanged(router, initialPageviewId))
    }
  }
}

function onRouteChanged(router: Router, initialPageviewId: string): void {
  try {
    if (!isTransportActive()) return

    applyOptOutParam()
    if (isOptedOut()) {
      stopTransport()
      return
    }

    const pageKey = location.pathname + location.search
    if (pageKey === currentPageKey) return

    // The page being left gets its final engagement before the new pageview starts.
    emitEngagement()

    const url = location.href
    const pageviewId = isFirstPageview ? initialPageviewId : uuid()
    const referrer = isFirstPageview ? document.referrer || null : previousUrl
    const notFound = Boolean(router.route.data?.isNotFound)

    sessionForPageview(url)
    state.pageviewId = pageviewId
    state.pageReady = false
    isFirstPageview = false
    previousUrl = url
    currentPageKey = pageKey

    // The hook fires before Vue re-renders, and document.title is set by a
    // watcher on the route — wait for that flush, then one more task, so the
    // title and the DOM are the new page's.
    nextTick(() => {
      setTimeout(() => {
        record(
          'pageview',
          {
            url: clip(url, 2048),
            title: clip(document.title || null, 255),
            referrer: clip(referrer, 2048),
            not_found: notFound
          },
          pageviewId
        )

        if (state.pageviewId !== pageviewId) return
        state.pageReady = true
        beginEngagement(pageviewId)
        checkBlogReadComplete()
      }, 0)
    })
  } catch {
    // Never let analytics break navigation.
  }
}

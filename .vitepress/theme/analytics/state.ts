/**
 * The pageview every hit is attached to by default. Shared between collectors
 * through this module rather than passed around, since clicks, events and
 * errors all fire from global listeners that know nothing about routing.
 */
export const state = {
  pageviewId: '',
  /** False between a route change and the new page rendering — the DOM still shows the old page. */
  pageReady: false
}

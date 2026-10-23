import { record } from './transport'

/** A visitor who hasn't scrolled, clicked or typed for this long is assumed to have walked away. */
const ACTIVE_WINDOW_MS = 30_000
/** pointermove fires constantly; one interaction per second is plenty of resolution. */
const INTERACTION_THROTTLE_MS = 1000
const MILESTONES = [25, 50, 75, 90, 100]

let pageviewId = ''
let engagedMs = 0
let lastAccrueAt = 0
let lastInteractionAt = 0
let visible = true
let maxScrollPct = 0
const milestones = new Set<number>()
let scrollFrame = 0

/** How far down the document the bottom of the viewport is, 0–100. */
export function scrollPercent(): number {
  const height = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
  if (height <= 0) return 0
  const pct = ((window.scrollY + window.innerHeight) / height) * 100
  return Math.min(100, Math.max(0, Math.round(pct)))
}

function measureScroll(): void {
  maxScrollPct = Math.max(maxScrollPct, scrollPercent())
  for (const milestone of MILESTONES) {
    if (maxScrollPct >= milestone) milestones.add(milestone)
  }
}

/**
 * Credits the time since the last check, but only while the tab was visible
 * and only up to 30 s past the last interaction — an open tab nobody touches
 * stops counting.
 */
function accrue(now = Date.now()): void {
  if (visible && pageviewId) {
    const countedUntil = Math.min(now, lastInteractionAt + ACTIVE_WINDOW_MS)
    if (countedUntil > lastAccrueAt) engagedMs += countedUntil - lastAccrueAt
  }
  lastAccrueAt = now
}

function onInteraction(): void {
  const now = Date.now()
  if (now - lastInteractionAt < INTERACTION_THROTTLE_MS) return
  accrue(now)
  lastInteractionAt = now
}

function onScroll(): void {
  onInteraction()
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    measureScroll()
  })
}

function onVisibilityChange(): void {
  accrue()
  visible = document.visibilityState === 'visible'
  // Coming back to the tab is itself a deliberate act.
  if (visible) lastInteractionAt = Date.now()
}

/** Resets the counters for a freshly rendered page. Landing on a page counts as an interaction. */
export function beginEngagement(id: string): void {
  const now = Date.now()
  pageviewId = id
  engagedMs = 0
  maxScrollPct = 0
  milestones.clear()
  visible = document.visibilityState === 'visible'
  lastAccrueAt = now
  lastInteractionAt = visible ? now : 0
  measureScroll()
}

/** Safe to call repeatedly for one pageview — the server keeps the maximum. */
export function emitEngagement(): void {
  if (!pageviewId) return
  accrue()
  record(
    'engagement',
    {
      engaged_ms: Math.round(engagedMs),
      max_scroll_pct: maxScrollPct,
      scroll_milestones: [...milestones].sort((a, b) => a - b)
    },
    pageviewId
  )
}

export function installEngagement(): void {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measureScroll, { passive: true })
  for (const type of ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel']) {
    window.addEventListener(type, onInteraction, { passive: true, capture: true })
  }
  document.addEventListener('visibilitychange', onVisibilityChange)
}

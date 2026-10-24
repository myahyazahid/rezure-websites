import { hitUrl } from './config'
import { buildContext } from './context'
import { currentSession, getVisitorId, touchSession, type SessionInfo } from './identity'
import { state } from './state'
import { nowIso, uuid } from './util'

export type HitType = 'pageview' | 'engagement' | 'event' | 'click' | 'vitals' | 'error'

interface QueuedHit {
  /** Captured at record time — a batch carries one session_id, so hits are grouped by it on send. */
  session: SessionInfo
  hit: Record<string, unknown>
}

const MAX_BATCH_HITS = 50
const FLUSH_AT_HITS = 20
const FLUSH_INTERVAL_MS = 5000
/**
 * sendBeacon and keepalive fetch both refuse bodies over 64 KiB (summed across
 * in-flight requests), and a 50-hit batch of error stacks can exceed that.
 * Counted in UTF-16 units with headroom for the envelope and multi-byte text.
 */
const MAX_BATCH_CHARS = 40_000

/** Hits that mean the visitor is doing something, and so keep the session alive. */
const ACTIVITY_HITS: HitType[] = ['pageview', 'event', 'click']

let queue: QueuedHit[] = []
let active = false
let timer: ReturnType<typeof setInterval> | undefined

export function startTransport(): void {
  active = true
  timer = setInterval(flush, FLUSH_INTERVAL_MS)
}

/** Owner opted out mid-visit: drop what's pending and ignore everything after. */
export function stopTransport(): void {
  active = false
  queue = []
  clearInterval(timer)
}

export const isTransportActive = (): boolean => active

/**
 * Queues one hit. `id` and `at` are stamped here, so a hit re-sent after a
 * failed beacon would be deduplicated server-side — though nothing is retried.
 */
export function record(type: HitType, fields: Record<string, unknown>, pageviewId = state.pageviewId): void {
  if (!active) return

  try {
    const session = currentSession()
    if (!session || !pageviewId) return

    queue.push({
      session,
      hit: { type, id: uuid(), pageview_id: pageviewId, at: nowIso(), ...fields }
    })
    if (ACTIVITY_HITS.includes(type)) touchSession()

    if (queue.length >= FLUSH_AT_HITS) {
      flush()
    } else if (document.visibilityState === 'hidden') {
      // Late arrivals after the tab hid (web-vitals reports CLS/INP from its own
      // visibilitychange listener) would otherwise wait for a timer that may never run.
      queueMicrotask(flush)
    }
  } catch {
    // Never let analytics surface an error.
  }
}

export function flush(): void {
  if (!queue.length || !hitUrl) return

  try {
    const pending = queue
    queue = []

    const bySession = new Map<string, QueuedHit[]>()
    for (const entry of pending) {
      const group = bySession.get(entry.session.id) ?? []
      group.push(entry)
      bySession.set(entry.session.id, group)
    }

    for (const group of bySession.values()) {
      // The pageview hit is recorded a tick after its route change, so early
      // vitals/errors can be queued ahead of it. Pageviews go first, sparing
      // the server its "hit before its pageview" retry path.
      group.sort((a, b) => Number(b.hit.type === 'pageview') - Number(a.hit.type === 'pageview'))

      let batch: Record<string, unknown>[] = []
      let chars = 0

      for (const { hit } of group) {
        const size = JSON.stringify(hit).length
        if (batch.length && (batch.length >= MAX_BATCH_HITS || chars + size > MAX_BATCH_CHARS)) {
          send(group[0].session, batch)
          batch = []
          chars = 0
        }
        batch.push(hit)
        chars += size
      }

      if (batch.length) send(group[0].session, batch)
    }
  } catch {
    // Dropped batch — acceptable, analytics is best-effort.
  }
}

/**
 * A string body goes out as text/plain, which keeps the request a CORS "simple
 * request" — no preflight, so it survives page unload. fetch(keepalive) is the
 * fallback for browsers without sendBeacon or when the beacon queue is full.
 */
function send(session: SessionInfo, hits: Record<string, unknown>[]): void {
  if (!hitUrl) return

  const body = JSON.stringify({
    v: 1,
    visitor_id: getVisitorId(),
    session_id: session.id,
    sent_at: nowIso(),
    context: buildContext(session),
    hits
  })

  try {
    if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(hitUrl, body)) return
  } catch {
    // Fall through to fetch.
  }

  try {
    fetch(hitUrl, {
      method: 'POST',
      body,
      keepalive: true,
      mode: 'no-cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain' }
    }).catch(() => {})
  } catch {
    // Nothing left to try.
  }
}

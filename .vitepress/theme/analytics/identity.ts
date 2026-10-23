import { cookieGet, cookieSet, nowIso, storageGet, storageSet, UUID_PATTERN, uuid } from './util'

const VISITOR_COOKIE = '_rz_vid'
const VISITOR_KEY = 'rz_vid'
const FIRST_VISIT_KEY = 'rz_first_visit_at'
const VISIT_COUNT_KEY = 'rz_visit_number'
const SESSION_KEY = 'rz_session'

const TWO_YEARS_SECONDS = 60 * 60 * 24 * 365 * 2
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

/** What a queued hit remembers about its session, so a batch never mixes two. */
export interface SessionInfo {
  id: string
  visit_number: number
  is_new_visitor: boolean
}

interface StoredSession extends SessionInfo {
  last_activity_at: number
  /** Landing UTM of the session, serialized — a different campaign starts a new session. */
  utm: string
}

let visitorId = ''
let firstVisitAt: string | null = null
let session: StoredSession | null = null

/**
 * The visitor id lives in both a cookie and localStorage, and is restored from
 * whichever survived — clearing one (cookie cleanup extensions, storage
 * eviction) shouldn't turn a returning visitor into a new one.
 */
export function initVisitor(): void {
  const fromStorage = storageGet(VISITOR_KEY)
  const fromCookie = cookieGet(VISITOR_COOKIE)
  const restored = [fromStorage, fromCookie].find((id) => id && UUID_PATTERN.test(id)) ?? null

  visitorId = restored ?? uuid()
  storageSet(VISITOR_KEY, visitorId)
  cookieSet(VISITOR_COOKIE, visitorId, TWO_YEARS_SECONDS)

  firstVisitAt = storageGet(FIRST_VISIT_KEY)
  if (!firstVisitAt && !restored) {
    firstVisitAt = nowIso()
    storageSet(FIRST_VISIT_KEY, firstVisitAt)
  }

  // A visitor restored from the cookie alone has lost its counter; it has
  // still been here before, so it must not be counted as new.
  if (restored && storageGet(VISIT_COUNT_KEY) === null) {
    storageSet(VISIT_COUNT_KEY, '1')
  }
}

export const getVisitorId = (): string => visitorId
export const getFirstVisitAt = (): string | null => firstVisitAt

function utmOf(url: string): string {
  try {
    const params = new URL(url).searchParams
    return UTM_KEYS.map((key) => `${key}=${params.get(key) ?? ''}`)
      .filter((pair) => !pair.endsWith('='))
      .join('&')
  } catch {
    return ''
  }
}

function readStoredSession(): StoredSession | null {
  try {
    const parsed = JSON.parse(storageGet(SESSION_KEY) ?? 'null')
    if (parsed && typeof parsed.id === 'string' && UUID_PATTERN.test(parsed.id)) return parsed
  } catch {
    // Corrupt value — treated as no session.
  }
  return null
}

/**
 * Called on every pageview: resumes the session shared by all tabs, or starts
 * a new one after 30 minutes idle or when the visitor lands from a different
 * campaign. Rotation is only decided here, so a pageview's later hits
 * (engagement, clicks) always stay in the pageview's session.
 */
export function sessionForPageview(url: string): SessionInfo {
  const now = Date.now()
  const utm = utmOf(url)
  const stored = readStoredSession() ?? session

  const expired = !stored || now - stored.last_activity_at > SESSION_TIMEOUT_MS
  const newCampaign = utm !== '' && stored !== null && utm !== stored.utm

  if (stored && !expired && !newCampaign) {
    session = { ...stored, last_activity_at: now }
  } else {
    const visitNumber = (Number.parseInt(storageGet(VISIT_COUNT_KEY) ?? '0', 10) || 0) + 1
    storageSet(VISIT_COUNT_KEY, String(visitNumber))
    session = {
      id: uuid(),
      visit_number: visitNumber,
      is_new_visitor: visitNumber === 1,
      last_activity_at: now,
      utm
    }
  }

  storageSet(SESSION_KEY, JSON.stringify(session))
  return currentSession()!
}

export function currentSession(): SessionInfo | null {
  if (!session) return null
  return { id: session.id, visit_number: session.visit_number, is_new_visitor: session.is_new_visitor }
}

/** Keeps the session alive. Leaves storage alone if another tab has since rotated it. */
export function touchSession(): void {
  if (!session) return
  session.last_activity_at = Date.now()
  const stored = readStoredSession()
  if (!stored || stored.id === session.id) {
    storageSet(SESSION_KEY, JSON.stringify(session))
  }
}

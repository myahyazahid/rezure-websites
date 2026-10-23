/**
 * Small helpers shared by every collector. Everything here tolerates a hostile
 * environment — storage that throws (Safari private mode, blocked cookies),
 * a missing `crypto.randomUUID` — because analytics must never break the site.
 */

/** RFC 4122 v4. `randomUUID` needs a secure context and a 2021+ browser. */
export function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // Fall through to the manual build.
  }

  const bytes = new Uint8Array(16)
  try {
    crypto.getRandomValues(bytes)
  } catch {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const nowIso = (): string => new Date().toISOString()

/** Clips to the contract's max length; null stays null so nullable fields stay nullable. */
export function clip(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return null
  const text = String(value)
  return text.length > max ? text.slice(0, max) : text
}

export function toInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : null
}

export function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Quota or privacy mode — the in-memory value still works for this tab.
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Same as above.
  }
}

/**
 * Runs `callback` now, or once a prerendered page (speculation rules) is
 * actually shown. A prerender the visitor never opens must not count, but
 * one they do open is a real visit and should.
 */
export function whenActivated(callback: () => void): void {
  if ((document as { prerendering?: boolean }).prerendering) {
    document.addEventListener('prerenderingchange', () => callback(), { once: true })
  } else {
    callback()
  }
}

export function cookieGet(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

export function cookieSet(name: string, value: string, maxAgeSeconds: number): void {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`
  } catch {
    // Cookies disabled — localStorage carries the id alone.
  }
}

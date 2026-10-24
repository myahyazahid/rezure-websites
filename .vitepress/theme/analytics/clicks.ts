import { record } from './transport'
import { clip } from './util'

const RAGE_WINDOW_MS = 700
const RAGE_RADIUS_PX = 30
const RAGE_MIN_CLICKS = 3
const SELECTOR_MAX_ANCESTORS = 4

/** What a click "is on" for the heatmap: the nearest control, not the icon span inside it. */
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

let recentClicks: { at: number; x: number; y: number }[] = []

const escapeCss = (value: string): string =>
  typeof CSS !== 'undefined' && typeof CSS.escape === 'function' ? CSS.escape(value) : value

/**
 * Short, human-readable path: tag plus id (which ends the walk — it's unique
 * enough) or up to two classes, for the element and at most four ancestors.
 */
function selectorOf(element: Element): string {
  const parts: string[] = []
  let node: Element | null = element

  while (node && node !== document.body && node !== document.documentElement && parts.length <= SELECTOR_MAX_ANCESTORS) {
    const tag = node.tagName.toLowerCase()
    if (node.id) {
      parts.unshift(`${tag}#${escapeCss(node.id)}`)
      break
    }
    const classes = Array.from(node.classList).slice(0, 2).map((name) => `.${escapeCss(name)}`)
    parts.unshift(tag + classes.join(''))
    node = node.parentElement
  }

  return parts.join(' > ')
}

function isRageClick(x: number, y: number): boolean {
  const now = Date.now()
  recentClicks = recentClicks.filter((click) => now - click.at <= RAGE_WINDOW_MS)
  recentClicks.push({ at: now, x, y })
  const nearby = recentClicks.filter((click) => Math.hypot(click.x - x, click.y - y) <= RAGE_RADIUS_PX)
  return nearby.length >= RAGE_MIN_CLICKS
}

function onClick(event: MouseEvent): void {
  try {
    // Keyboard-activated clicks have no position — nothing to put on a heatmap.
    if (event.detail === 0) return

    const target = event.target instanceof Element ? event.target : null
    const element = target?.closest(INTERACTIVE) ?? target
    const link = target?.closest('a')

    const docWidth = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth)
    const pageHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
    const xPct = docWidth > 0 ? Math.min(100, Math.max(0, (event.pageX / docWidth) * 100)) : 0
    const text = element?.textContent?.replace(/\s+/g, ' ').trim() || null

    record('click', {
      x_pct: Math.round(xPct * 100) / 100,
      y_px: Math.max(0, Math.round(event.pageY)),
      page_height: Math.round(pageHeight),
      viewport_width: window.innerWidth,
      selector: element ? clip(selectorOf(element), 255) : null,
      tag: element ? clip(element.tagName.toLowerCase(), 32) : null,
      text: clip(text, 120),
      href: link instanceof HTMLAnchorElement && link.href ? clip(link.href, 2048) : null,
      is_rage: isRageClick(event.pageX, event.pageY)
    })
  } catch {
    // Ignore.
  }
}

export function installClicks(): void {
  window.addEventListener('click', onClick, { capture: true, passive: true })
}

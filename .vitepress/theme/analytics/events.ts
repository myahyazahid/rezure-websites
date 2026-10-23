import { siteDownloadUrl } from './config'
import { scrollPercent } from './engagement'
import { state } from './state'
import { record } from './transport'
import { clip } from './util'

const SEARCH_DEBOUNCE_MS = 1000
const SEARCH_MIN_LENGTH = 2
const BLOG_READ_SCROLL_PCT = 90
const BLOG_POST_PATH = /^\/blog\/posts\/([^/]+?)(?:\.html)?\/?$/

/** VitePress's own selectors (vitepress 1.6): code-block copy button, local search input, appearance switch. */
const COPY_BUTTON = 'div[class*="language-"] > button.copy'
const SEARCH_INPUT_ID = 'localsearch-input'
const APPEARANCE_SWITCH = '.VPSwitchAppearance'
/** The post body rendered by BlogPost.vue. */
const ARTICLE_CONTENT = '.BlogPost .article-content'

let searchTimer: ReturnType<typeof setTimeout> | undefined
let lastSearchQuery = ''
let blogReadSentFor = ''
let scrollFrame = 0

function trackEvent(name: string, label: string | null): void {
  record('event', { name, label: clip(label, 255), props: null })
}

/** Links leaving the site. The tracked download link is excluded — the server records that one itself. */
function isOutbound(href: string): boolean {
  try {
    const url = new URL(href, location.href)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    if (siteDownloadUrl && url.href.startsWith(siteDownloadUrl)) return false
    return url.host !== location.host
  } catch {
    return false
  }
}

/**
 * Runs in the capture phase, ahead of the components' own handlers — which is
 * what lets theme_toggle read the theme as it is *before* the switch flips it.
 */
function onClick(event: MouseEvent): void {
  try {
    const target = event.target
    if (!(target instanceof Element)) return

    const copyButton = target.closest(COPY_BUTTON)
    if (copyButton) {
      const language = /(?:^|\s)language-(\S+)/.exec(copyButton.parentElement?.className ?? '')?.[1]
      trackEvent('copy_code', language ?? null)
    }

    const tracked = target.closest('[data-track]')
    if (tracked) trackEvent('cta_click', tracked.getAttribute('data-track'))

    if (target.closest(APPEARANCE_SWITCH)) {
      trackEvent('theme_toggle', document.documentElement.classList.contains('dark') ? 'light' : 'dark')
    }

    const link = target.closest('a')
    if (link instanceof HTMLAnchorElement && link.href && isOutbound(link.href)) {
      trackEvent('outbound_click', link.href)
    }
  } catch {
    // Ignore.
  }
}

function onInput(event: Event): void {
  const target = event.target
  if (!(target instanceof HTMLInputElement) || target.id !== SEARCH_INPUT_ID) return

  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const query = target.value.trim()
    if (query.length < SEARCH_MIN_LENGTH || query === lastSearchQuery) return
    lastSearchQuery = query
    trackEvent('docs_search', query)
  }, SEARCH_DEBOUNCE_MS)
}

/** Once per pageview: the end of the post is on screen, or the reader got 90% down. */
export function checkBlogReadComplete(): void {
  try {
    if (!state.pageReady || blogReadSentFor === state.pageviewId) return

    const slug = BLOG_POST_PATH.exec(location.pathname)?.[1]
    if (!slug) return

    const content = document.querySelector(ARTICLE_CONTENT)
    const rect = content?.getBoundingClientRect()
    const endInView = Boolean(rect && rect.height > 0 && rect.bottom <= window.innerHeight)

    if (endInView || scrollPercent() >= BLOG_READ_SCROLL_PCT) {
      blogReadSentFor = state.pageviewId
      trackEvent('blog_read_complete', decodeURIComponent(slug))
    }
  } catch {
    // Ignore.
  }
}

function onScroll(): void {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    checkBlogReadComplete()
  })
}

export function installEvents(): void {
  window.addEventListener('click', onClick, { capture: true })
  document.addEventListener('input', onInput, { capture: true })
  window.addEventListener('scroll', onScroll, { passive: true })
}

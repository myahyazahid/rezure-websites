import type { Metric } from 'web-vitals'
import { record } from './transport'
import { toInt } from './util'

/** Every vitals field, so each hit is a complete row; the server keeps the latest non-null value per field. */
const EMPTY_VITALS = {
  lcp_ms: null,
  inp_ms: null,
  cls: null,
  fcp_ms: null,
  ttfb_ms: null,
  dom_load_ms: null,
  page_load_ms: null
}

const FIELD_FOR: Record<Metric['name'], keyof typeof EMPTY_VITALS> = {
  LCP: 'lcp_ms',
  INP: 'inp_ms',
  CLS: 'cls',
  FCP: 'fcp_ms',
  TTFB: 'ttfb_ms'
}

/**
 * Load timings from Navigation Timing. Measured from activation for a
 * prerendered page, so a prerender started minutes earlier doesn't inflate it.
 */
function reportNavigationTiming(pageviewId: string): void {
  const entry = performance.getEntriesByType?.('navigation')[0] as
    | (PerformanceNavigationTiming & { activationStart?: number })
    | undefined
  if (!entry || entry.loadEventEnd <= 0) return

  const start = entry.activationStart ?? 0
  record(
    'vitals',
    {
      ...EMPTY_VITALS,
      dom_load_ms: toInt(entry.domContentLoadedEventEnd - start),
      page_load_ms: toInt(entry.loadEventEnd - start)
    },
    pageviewId
  )
}

/**
 * Core Web Vitals describe the hard page load only, so they're pinned to the
 * initial pageview; SPA navigations get engagement but no vitals. web-vitals
 * is loaded lazily to keep it out of the critical path.
 */
export function installVitals(pageviewId: string): void {
  import('web-vitals')
    .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const report = (metric: Metric): void => {
        const value = metric.name === 'CLS'
          ? Math.max(0, Math.round(metric.value * 10000) / 10000)
          : toInt(metric.value)
        record('vitals', { ...EMPTY_VITALS, [FIELD_FOR[metric.name]]: value }, pageviewId)
      }

      onLCP(report)
      onINP(report)
      onCLS(report)
      onFCP(report)
      onTTFB(report)
    })
    .catch(() => {})

  // loadEventEnd is only filled in once the load handlers have returned.
  const measure = () => setTimeout(() => reportNavigationTiming(pageviewId), 0)
  if (document.readyState === 'complete') {
    measure()
  } else {
    window.addEventListener('load', measure, { once: true })
  }
}

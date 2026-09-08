<script setup lang="ts">
/**
 * Custom home layout, selected by `layout: Landing` in index.md — VitePress
 * renders any frontmatter `layout` that isn't doc/page/home as a globally
 * registered component, so this sits inside VPContent with the nav bar,
 * search, and theme toggle still supplied by the default theme.
 *
 * The default theme's `layout: home` was doing the job before, but its hero
 * and feature grid are the stock VitePress arrangement every VitePress site
 * shares — fine for docs, wrong for a product page.
 *
 * Every string here comes from index.md's frontmatter: this file owns the
 * arrangement, the markdown owns the copy, so wording changes never touch Vue.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Action {
  text: string
  link: string
  theme?: 'brand' | 'alt' | 'ghost'
}

interface Hero {
  eyebrow?: string
  headline: string
  tagline?: string
  actions?: Action[]
}

interface Feature {
  title: string
  details: string
  icon?: string
}

interface Service {
  name: string
  version: string
  port: string | number
  running: boolean
  icon?: string
}

interface Cta {
  title: string
  text?: string
  action?: Action
  note?: string
}

/**
 * Official brand marks (Simple Icons, CC0-licensed path data), inlined so
 * icon lookup never costs a network request. Each is a single fill path on a
 * 0 0 24 24 viewBox, rendered in the brand's own hex (BRAND_COLORS) rather
 * than the site's red — the mark is only recognizable in its real color.
 * "windows" is deliberately absent: Simple Icons dropped it from their
 * current index (Microsoft trademark policy), so the one card without a
 * real 1:1 product match falls back to a plain generic icon instead.
 */
const BRAND_ICONS: Record<string, string> = {
  docker:
    '<path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>',
  nginx:
    '<path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z"/>',
  php:
    '<path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/>',
  mariadb:
    '<path d="M23.157 4.412c-.676.284-.79.31-1.673.372-.65.045-.757.057-1.212.209-.75.246-1.395.75-2.02 1.59-.296.398-1.249 1.913-1.249 1.988 0 .057-.65.998-.915 1.32-.574.713-1.08 1.079-2.14 1.59-.77.36-1.224.524-4.102 1.477-1.073.353-2.133.738-2.367.864-.852.449-1.515 1.036-2.203 1.938-1.003 1.32-.972 1.313-3.042.947a12.264 12.264 0 00-.675-.063c-.644-.05-1.023.044-1.332.334L0 17.193l.177.088c.094.05.353.234.561.398.215.17.461.347.55.391.088.044.17.088.183.101.012.013-.089.17-.228.353-.435.581-.593.871-.574 1.048.019.164.032.17.43.17.517-.006.826-.056 1.261-.208.65-.233 2.058-.94 2.784-1.4.776-.5 1.717-.998 1.956-1.042.082-.02.354-.07.594-.114.58-.107 1.464-.095 2.587.05.108.013.373.045.6.064.227.025.43.057.454.076.026.012.474.037.998.056.934.026 1.104.007 1.3-.189.126-.133.385-.631.498-.985.209-.643.417-.921.366-.492-.113.966-.322 1.692-.713 2.411-.259.499-.663 1.092-.934 1.395-.322.347-.315.36.088.315.619-.063 1.471-.397 2.096-.82.827-.562 1.647-1.691 2.19-3.03.107-.27.22-.22.183.083-.013.094-.038.315-.057.498l-.031.328.353-.202c.833-.48 1.414-1.262 2.127-2.884.227-.518.877-2.922 1.073-3.976a9.64 9.64 0 01.271-1.042c.127-.429.196-.555.48-.858.183-.19.625-.555.978-.808.72-.505.953-.75 1.187-1.205.208-.417.284-1.13.132-1.357-.132-.202-.284-.196-.763.006Z"/>',
  tauri:
    '<path d="M13.912 0a8.72 8.72 0 0 0-8.308 6.139c1.05-.515 2.18-.845 3.342-.976 2.415-3.363 7.4-3.412 9.88-.097 2.48 3.315 1.025 8.084-2.883 9.45a6.131 6.131 0 0 1-.3 2.762 8.72 8.72 0 0 0 3.01-1.225A8.72 8.72 0 0 0 13.913 0zm.082 6.451a2.284 2.284 0 1 0-.15 4.566 2.284 2.284 0 0 0 .15-4.566zm-5.629.27a8.72 8.72 0 0 0-3.031 1.235 8.72 8.72 0 1 0 13.06 9.9131 10.173 10.174 0 0 1-3.343.965 6.125 6.125 0 1 1-7.028-9.343 6.114 6.115 0 0 1 .342-2.772zm1.713 6.27a2.284 2.284 0 0 0-2.284 2.283 2.284 2.284 0 0 0 2.284 2.284 2.284 2.284 0 0 0 2.284-2.284 2.284 2.284 0 0 0-2.284-2.284z"/>'
}

/** Each mark's real-world hex (Simple Icons' documented brand color) — the whole point of using an official logo is that it's only recognizable in its own color. */
const BRAND_COLORS: Record<string, string> = {
  docker: '#2496ED',
  nginx: '#009639',
  php: '#777BB4',
  mariadb: '#003545',
  tauri: '#24C8D8'
}

const { frontmatter } = useData()

const hero = computed<Hero | null>(() => frontmatter.value.hero ?? null)
const services = computed<Service[]>(() => frontmatter.value.services ?? [])
const runningCount = computed(() => services.value.filter((s) => s.running).length)
const features = computed<Feature[]>(() => frontmatter.value.features ?? [])
const reasons = computed<Feature[]>(() => frontmatter.value.reasons ?? [])
const cta = computed<Cta | null>(() => frontmatter.value.cta ?? null)

/** Anything not starting a scheme is an in-site route, which VitePress's router intercepts. */
const isExternal = (link: string) => /^https?:\/\//.test(link)
</script>

<template>
  <div class="Landing">
    <!-- ---------- Hero ---------- -->
    <section v-if="hero" class="hero">
      <div class="glow" aria-hidden="true" />

      <div class="container">
        <p v-if="hero.eyebrow" class="eyebrow">{{ hero.eyebrow }}</p>

        <h1 class="headline">{{ hero.headline }}</h1>

        <p v-if="hero.tagline" class="tagline">{{ hero.tagline }}</p>

        <div v-if="hero.actions?.length" class="actions">
          <a
            v-for="action in hero.actions"
            :key="action.link"
            class="btn"
            :class="`btn-${action.theme ?? 'brand'}`"
            :href="action.link"
            :target="isExternal(action.link) ? '_blank' : undefined"
            :rel="isExternal(action.link) ? 'noreferrer' : undefined"
          >
            {{ action.text }}
          </a>
        </div>

        <!--
          Stylised stand-in for the service manager screen so the fold isn't all
          type — not a screenshot. Swap in a real capture when there is one; the
          frame styling does not depend on this markup.
        -->
        <div v-if="services.length" class="app-frame" aria-hidden="true">
          <div class="app-titlebar">
            <span class="dots"><i class="dot-red" /><i class="dot-yellow" /><i class="dot-green" /></span>
            <span class="app-name">Rezure</span>
            <span class="app-summary">{{ runningCount }}/{{ services.length }} running</span>
          </div>

          <div class="app-body">
            <div v-for="service in services" :key="service.name" class="service-row">
              <span class="service-id">
                <span class="service-icon" :style="{ color: BRAND_COLORS[service.icon ?? ''] }">
                  <svg viewBox="0 0 24 24" fill="currentColor" v-html="BRAND_ICONS[service.icon ?? '']" />
                </span>
                <span class="service-name">{{ service.name }}</span>
                <span class="service-version">{{ service.version }}</span>
              </span>

              <span class="service-meta">
                <span class="port">:{{ service.port }}</span>
                <span class="state" :class="{ 'is-running': service.running }">
                  <span class="state-dot" />
                  {{ service.running ? 'Running' : 'Stopped' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ---------- Features ---------- -->
    <section v-if="features.length" class="section">
      <div class="container">
        <h2 v-if="frontmatter.featuresTitle" class="section-title">
          {{ frontmatter.featuresTitle }}
        </h2>

        <div class="feature-grid">
          <article v-for="feature in features" :key="feature.title" class="card">
            <span
              class="icon"
              aria-hidden="true"
              :style="BRAND_ICONS[feature.icon ?? ''] ? { color: BRAND_COLORS[feature.icon!] } : undefined"
            >
              <svg v-if="BRAND_ICONS[feature.icon ?? '']" viewBox="0 0 24 24" fill="currentColor" v-html="BRAND_ICONS[feature.icon!]" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v10" />
                <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
              </svg>
            </span>

            <h3>{{ feature.title }}</h3>
            <p>{{ feature.details }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ---------- Why Rezure ---------- -->
    <section v-if="reasons.length" class="section section-alt">
      <div class="container">
        <h2 v-if="frontmatter.whyTitle" class="section-title">{{ frontmatter.whyTitle }}</h2>
        <p v-if="frontmatter.whyLede" class="section-lede">{{ frontmatter.whyLede }}</p>

        <div class="reason-grid">
          <article v-for="(reason, index) in reasons" :key="reason.title" class="reason">
            <span class="reason-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ reason.title }}</h3>
            <p>{{ reason.details }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ---------- Closing call to action ---------- -->
    <section v-if="cta" class="section">
      <div class="container">
        <div class="cta">
          <h2>{{ cta.title }}</h2>
          <p v-if="cta.text">{{ cta.text }}</p>

          <div v-if="cta.action" class="actions">
            <a
              class="btn btn-brand"
              :href="cta.action.link"
              :target="isExternal(cta.action.link) ? '_blank' : undefined"
              :rel="isExternal(cta.action.link) ? 'noreferrer' : undefined"
            >
              {{ cta.action.text }}
            </a>
          </div>

          <p v-if="cta.note" class="cta-note">{{ cta.note }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ---------- Hero ---------- */

.hero {
  position: relative;
  overflow: hidden;
  padding: 72px 0 24px;
  text-align: center;
}

.glow {
  position: absolute;
  inset: -240px 0 auto 0;
  height: 640px;
  background: radial-gradient(closest-side, var(--brand-glow), transparent 70%);
  pointer-events: none;
}

.hero .container {
  position: relative;
}

.eyebrow {
  display: inline-block;
  margin: 0 0 20px;
  padding: 6px 16px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background-color: var(--brand-soft);
  color: var(--brand-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.02em;
}

.headline {
  max-width: 760px;
  margin: 0 auto;
  font-size: 56px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--foreground);
}

.tagline {
  max-width: 620px;
  margin: 24px auto 0;
  font-size: 19px;
  line-height: 1.6;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.btn {
  display: inline-block;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  line-height: 44px;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.btn-brand {
  background-color: var(--brand);
  color: #fff;
}

.btn-brand:hover {
  background-color: var(--brand-hover);
}

.btn-alt {
  border-color: var(--border-color);
  background-color: var(--surface);
  color: var(--foreground);
}

.btn-alt:hover {
  border-color: var(--brand);
  color: var(--brand-text);
}

.btn-ghost {
  color: var(--muted);
}

.btn-ghost:hover {
  color: var(--foreground);
}

/* ---------- App illustration ---------- */

.app-frame {
  max-width: 720px;
  margin: 64px auto 0;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card), 0 30px 60px -30px rgb(0 0 0 / 0.25);
  overflow: hidden;
  text-align: left;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.app-titlebar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(to bottom, var(--surface-raised), var(--surface));
}

.dots {
  display: inline-flex;
  gap: 7px;
}

.dots i {
  width: 11px;
  height: 11px;
  border-radius: 999px;
}

.dot-red {
  background-color: #ff5f57;
}

.dot-yellow {
  background-color: #febc2e;
}

.dot-green {
  background-color: #28c840;
}

.app-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--brand-text);
}

.app-summary {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: var(--subtle);
}

.app-body {
  padding: 8px;
}

.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 12px;
}

.service-row + .service-row {
  border-top: 1px solid var(--border-color);
}

.service-id {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  /* Fixed light chip in both themes — some brand marks (MariaDB's near-navy)
     would nearly vanish against a dark badge, and a logo is only useful if
     its real color stays readable regardless of site theme. */
  background-color: #f0ecec;
  flex-shrink: 0;
}

.service-icon svg {
  width: 16px;
  height: 16px;
}

.service-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.service-version,
.port {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--subtle);
}

.service-meta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border-radius: 999px;
  background-color: var(--surface-raised);
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}

.state-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: var(--subtle);
}

.state.is-running {
  background-color: color-mix(in oklab, var(--positive) 15%, transparent);
  color: var(--positive);
}

.state.is-running .state-dot {
  background-color: var(--positive);
  box-shadow: 0 0 0 0 color-mix(in oklab, var(--positive) 60%, transparent);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--positive) 45%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in oklab, var(--positive) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--positive) 0%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-frame {
    animation: none;
  }

  .state.is-running .state-dot {
    animation: none;
  }
}

/* ---------- Sections ---------- */

.section {
  padding: 88px 0;
}

.section-alt {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-raised);
}

.section-title {
  max-width: 640px;
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.section-lede {
  max-width: 680px;
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
}

/* ---------- Feature cards ---------- */

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 44px;
}

.card {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: var(--brand);
  transform: translateY(-2px);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  /* Fixed light chip in both themes (see .service-icon) so a brand mark's
     own hex — set inline per feature — stays legible in dark mode too; the
     one generic icon falls back to the site's red. */
  background-color: #f0ecec;
  color: var(--brand-text);
}

.icon svg {
  width: 20px;
  height: 20px;
}

.card h3 {
  margin: 18px 0 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.card p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
}

/* ---------- Why Rezure ---------- */

.reason-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 48px;
}

.reason-index {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  color: var(--brand-text);
}

.reason h3 {
  margin: 12px 0 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.reason p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

/* ---------- Closing CTA ---------- */

.cta {
  padding: 64px 32px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.cta h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.cta > p {
  max-width: 540px;
  margin: 14px auto 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
}

.cta .actions {
  margin-top: 28px;
}

.cta-note {
  margin: 18px 0 0;
  font-size: 13px;
  color: var(--subtle);
}

/* ---------- Responsive ---------- */

@media (max-width: 959px) {
  .headline {
    font-size: 42px;
  }

  .feature-grid,
  .reason-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .hero {
    padding-top: 48px;
  }

  .headline {
    font-size: 32px;
  }

  .tagline {
    font-size: 17px;
  }

  .section {
    padding: 64px 0;
  }

  .section-title {
    font-size: 26px;
  }

  .feature-grid,
  .reason-grid {
    grid-template-columns: 1fr;
  }

  .app-frame {
    margin-top: 44px;
  }

  .app-summary {
    display: none;
  }

  .service-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .cta {
    padding: 44px 20px;
  }

  .cta h2 {
    font-size: 26px;
  }
}
</style>

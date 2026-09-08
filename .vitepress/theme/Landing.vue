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
                <span class="service-icon" :class="{ 'is-running': service.running }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <template v-if="service.icon === 'globe'">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
                    </template>
                    <template v-else-if="service.icon === 'layers'">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </template>
                    <template v-else-if="service.icon === 'database'">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                      <path d="M3 12a9 3 0 0 0 18 0" />
                    </template>
                  </svg>
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
            <span class="icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <template v-if="feature.icon === 'power'">
                  <path d="M12 2v10" />
                  <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
                </template>
                <template v-else-if="feature.icon === 'alert'">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </template>
                <template v-else-if="feature.icon === 'globe'">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
                </template>
                <template v-else-if="feature.icon === 'layers'">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                </template>
                <template v-else-if="feature.icon === 'database'">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                  <path d="M3 12a9 3 0 0 0 18 0" />
                </template>
                <template v-else>
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14Z" />
                </template>
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
  background-color: var(--brand-soft);
  color: var(--brand-text);
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
  background-color: var(--brand-soft);
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

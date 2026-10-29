<script setup lang="ts">
/**
 * EN / ID toggle. Swapped in for the default theme's VPNavBarTranslations
 * through a Vite alias in config.mts, so it sits in the slot VitePress
 * reserves for the language menu: after the nav links, before the appearance
 * switch, with the same divider in front of it.
 *
 * The stock component is a globe flyout that only shows from 1280px up; two
 * languages fit in a pill that stays visible at every width instead.
 *
 * Every page has a twin at the same path under /id/, so switching keeps the
 * reader on the page they were reading. Blog posts are the exception: their
 * content comes from the dashboard API in English only, so ID lands on the
 * Indonesian blog index rather than a page that doesn't exist.
 */
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { localeIndex } = useData()
const route = useRoute()

const isId = computed(() => localeIndex.value === 'id')

const enHref = computed(() => route.path.replace(/^\/id(\/|$)/, '/'))

const idHref = computed(() => {
  const path = enHref.value
  if (path.startsWith('/blog/posts/')) return '/id/blog/'
  return '/id' + path
})
</script>

<template>
  <div class="LangSwitch" role="group" :aria-label="isId ? 'Bahasa' : 'Language'">
    <a
      class="option"
      :class="{ active: !isId }"
      :href="enHref"
      hreflang="en"
      lang="en"
      title="English"
      :aria-current="!isId ? 'true' : undefined"
      data-track="lang:en"
    >
      EN
    </a>
    <a
      class="option"
      :class="{ active: isId }"
      :href="idHref"
      hreflang="id"
      lang="id"
      title="Bahasa Indonesia"
      :aria-current="isId ? 'true' : undefined"
      data-track="lang:id"
    >
      ID
    </a>
  </div>
</template>

<style scoped>
.LangSwitch {
  display: flex;
  align-items: center;
}

/* The pill itself, drawn on a wrapper of the two links so the divider
   VitePress puts in ::before stays outside it. */
.option {
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

.option:first-of-type {
  border-right: none;
  border-radius: 999px 0 0 999px;
  padding-left: 11px;
}

.option:last-of-type {
  border-left: none;
  border-radius: 0 999px 999px 0;
  padding-right: 11px;
}

.option:hover {
  color: var(--vp-c-text-1);
}

.option.active {
  border-color: var(--brand);
  background-color: var(--brand);
  color: #fff;
}
</style>

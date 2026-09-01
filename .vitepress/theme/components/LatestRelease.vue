<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Where the "Download" button points — the GitHub release that carries the installer. */
    releasesUrl?: string
  }>(),
  { releasesUrl: 'https://github.com/myahyazahid/rezure/releases/latest' }
)

/**
 * Shape of `GET /api/v1/version/latest`. Every field is null until a maintainer
 * publishes the first release from the dashboard — that is a normal 200, not an error.
 */
interface LatestVersion {
  version: string | null
  notes: string | null
  published_at: string | null
}

type State = 'loading' | 'ready' | 'unpublished' | 'unavailable'

const state = ref<State>('loading')
const release = ref<LatestVersion | null>(null)

const apiBase = (import.meta.env.VITE_REZURE_API_BASE ?? '').replace(/\/+$/, '')

const publishedOn = computed(() => {
  const raw = release.value?.published_at
  if (!raw) return null
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
})

onMounted(async () => {
  if (!apiBase) {
    state.value = 'unavailable'
    return
  }

  try {
    const response = await fetch(`${apiBase}/version/latest`, {
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = (await response.json()) as LatestVersion
    release.value = data
    state.value = data.version ? 'ready' : 'unpublished'
  } catch {
    state.value = 'unavailable'
  }
})
</script>

<template>
  <div class="latest-release">
    <p v-if="state === 'loading'" class="status">Checking for the latest release…</p>

    <template v-else-if="state === 'ready'">
      <p class="version">
        Rezure <strong>{{ release?.version }}</strong>
        <span v-if="publishedOn" class="published"> · released {{ publishedOn }}</span>
      </p>
      <p v-if="release?.notes" class="notes">{{ release.notes }}</p>
    </template>

    <p v-else-if="state === 'unpublished'" class="status">
      No release has been published yet. Builds land on GitHub first.
    </p>

    <p v-else class="status">
      Couldn't reach the release API right now — the GitHub releases page always has the
      latest build.
    </p>

    <a class="download-button" :href="props.releasesUrl" target="_blank" rel="noreferrer">
      Download for Windows
    </a>
  </div>
</template>

<style scoped>
.latest-release {
  margin: 24px 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.version {
  margin: 0;
  font-size: 18px;
  line-height: 28px;
}

.published,
.status {
  color: var(--vp-c-text-2);
}

.status {
  margin: 0;
  font-size: 14px;
  line-height: 24px;
}

.notes {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 24px;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
}

.download-button {
  display: inline-block;
  margin-top: 20px;
  padding: 0 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 38px;
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  transition: background-color 0.25s;
}

.download-button:hover {
  background-color: var(--vp-button-brand-hover-bg);
}
</style>

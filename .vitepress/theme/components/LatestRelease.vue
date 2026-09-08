<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** owner/name of the GitHub repo carrying the releases. */
    repo?: string
  }>(),
  { repo: 'myahyazahid/rezure' }
)

/**
 * Shape of `GET /api/v1/version/latest`. Every field is null until a maintainer
 * publishes the first release from the dashboard — that is a normal 200, not an error.
 *
 * Note what is *not* here: an installer URL. The endpoint is the desktop app's
 * update checker, so it reports which version is current but never where the
 * binary lives. The download link therefore comes from GitHub instead.
 */
interface LatestVersion {
  version: string | null
  notes: string | null
  published_at: string | null
}

interface Asset {
  url: string
  name: string
  size: number
}

const loading = ref(true)
const release = ref<LatestVersion | null>(null)
const asset = ref<Asset | null>(null)
/** Filled from GitHub only when the Rezure API had nothing to say. */
const fallbackVersion = ref<string | null>(null)
const fallbackPublishedAt = ref<string | null>(null)

const apiBase = (import.meta.env.VITE_REZURE_API_BASE ?? '').replace(/\/+$/, '')
const releasesUrl = `https://github.com/${props.repo}/releases/latest`

/** The maintainer-published version wins; GitHub's tag is the backstop. */
const version = computed(() => release.value?.version ?? fallbackVersion.value)

const publishedOn = computed(() => {
  const raw = release.value?.published_at ?? fallbackPublishedAt.value
  if (!raw) return null
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
})

const assetSize = computed(() => {
  if (!asset.value) return null
  return `${(asset.value.size / 1024 / 1024).toFixed(1)} MB`
})

/**
 * fetch with a deadline. Neither source is worth waiting on indefinitely: a
 * host that accepts the connection and then stalls (an API whose server is
 * down, rather than refusing outright) never rejects on its own, which would
 * pin the box on "Checking…" even when the other source already has a download
 * to offer.
 */
async function fetchWithDeadline(url: string, headers: HeadersInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    return await fetch(url, { headers, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Asking the Rezure API for release metadata. Absent or unreachable is fine. */
async function loadFromApi(): Promise<void> {
  if (!apiBase) return

  const response = await fetchWithDeadline(`${apiBase}/version/latest`, {
    Accept: 'application/json'
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  release.value = (await response.json()) as LatestVersion
}

/**
 * Asking GitHub for the installer itself. The asset filename carries the version
 * (rezureapp_2.0.0_x64-setup.exe), so it cannot be spelled out ahead of time and
 * GitHub's /releases/latest/download/<name> shortcut doesn't apply — the asset
 * list has to be read. Unauthenticated calls are rate-limited per IP; exceeding
 * it just drops us to the releases-page link, same as any other failure.
 */
async function loadFromGitHub(): Promise<void> {
  const response = await fetchWithDeadline(
    `https://api.github.com/repos/${props.repo}/releases/latest`,
    { Accept: 'application/vnd.github+json' }
  )
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()

  const installer = (data.assets ?? []).find((candidate: { name?: string }) =>
    candidate.name?.toLowerCase().endsWith('.exe')
  )

  if (installer) {
    asset.value = {
      url: installer.browser_download_url,
      name: installer.name,
      size: installer.size
    }
  }

  fallbackVersion.value = typeof data.tag_name === 'string' ? data.tag_name.replace(/^v/, '') : null
  fallbackPublishedAt.value = data.published_at ?? null
}

onMounted(async () => {
  // Independent sources — a failure on either side must not sink the other, so
  // neither is awaited in sequence and neither rejection propagates.
  await Promise.allSettled([loadFromApi(), loadFromGitHub()])
  loading.value = false
})
</script>

<template>
  <div class="latest-release">
    <p v-if="loading" class="status">Checking for the latest release…</p>

    <template v-else>
      <p v-if="version" class="version">
        Rezure <strong>{{ version }}</strong>
        <span v-if="publishedOn" class="published"> · released {{ publishedOn }}</span>
      </p>
      <p v-else class="status">
        No release has been published yet. Builds land on GitHub first.
      </p>

      <p v-if="release?.notes" class="notes">{{ release.notes }}</p>

      <a
        class="download-button"
        :href="asset?.url ?? releasesUrl"
        :target="asset ? undefined : '_blank'"
        :rel="asset ? undefined : 'noreferrer'"
      >
        Download for Windows
      </a>

      <p v-if="asset" class="meta">{{ asset.name }} · {{ assetSize }}</p>
      <p v-else class="meta">Opens the GitHub releases page, which always has the latest build.</p>
    </template>
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
  /* The button renders inside .vp-doc, which underlines every anchor. */
  text-decoration: none;
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

.meta {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}
</style>

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Rezure API, including the version prefix — e.g. https://api.example.com/api/v1 */
  readonly VITE_REZURE_API_BASE?: string
  /** Comma-separated hostnames allowed to report analytics. Defaults to rezure.redscale.my.id. */
  readonly VITE_REZURE_ANALYTICS_HOSTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

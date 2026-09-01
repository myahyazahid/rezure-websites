/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Rezure API, including the version prefix — e.g. https://api.example.com/api/v1 */
  readonly VITE_REZURE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

// biome-ignore lint/style/useConsistentTypeDefinitions: interface required for declaration merging
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_PAYLOAD_BASE_URL?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

// biome-ignore lint/style/useConsistentTypeDefinitions: interface required for declaration merging
interface ImportMeta {
  readonly env: ImportMetaEnv
}

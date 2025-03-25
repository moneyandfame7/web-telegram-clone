/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly NODE_ENV: 'production' | 'development' | 'staging'
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

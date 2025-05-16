/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
  export { createRouter, createWebHistory, useRouter, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized }
}

declare module 'pinia' {
  export { createPinia, defineStore }
} 
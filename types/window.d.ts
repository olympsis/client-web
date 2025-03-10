// types/window.d.ts
export {}

declare global {
  interface Window {
    __NUXT_LOADING_SHOWN__?: boolean;
    hideNuxtLoading?: () => void;
    __HIDE_LOADER?: () => void;
  }
}
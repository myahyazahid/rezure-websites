import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LatestRelease from './components/LatestRelease.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LatestRelease', LatestRelease)
  }
} satisfies Theme

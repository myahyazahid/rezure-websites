import { defineAsyncComponent } from 'vue'
import type { Theme } from 'vitepress'
// Without VitePress's bundled Inter: the site sets Instrument Sans (custom.css),
// so Inter was a 68 KB preload that no text ever rendered in.
import DefaultTheme from 'vitepress/theme-without-fonts'
import LatestRelease from './components/LatestRelease.vue'
import Landing from './Landing.vue'
import { installAnalytics } from './analytics'

// The blog layouts load as their own chunks. BlogList imports blog-data.json,
// every post's full content included, which otherwise rode along in the theme
// chunk on every docs page and grew with each post published.
const BlogList = defineAsyncComponent(() => import('./BlogList.vue'))
const BlogPost = defineAsyncComponent(() => import('./BlogPost.vue'))
const BlogPostContent = defineAsyncComponent(() => import('./components/BlogPostContent.vue'))
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('LatestRelease', LatestRelease)
    // Registered globally so `layout: Landing` in a page's frontmatter resolves
    // to it — VitePress renders an unknown layout name as a component.
    app.component('Landing', Landing)
    app.component('BlogList', BlogList)
    app.component('BlogPost', BlogPost)
    app.component('BlogPostContent', BlogPostContent)

    // No-op during the SSR build and on hosts outside VITE_REZURE_ANALYTICS_HOSTS.
    installAnalytics(router)
  }
} satisfies Theme

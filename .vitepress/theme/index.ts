import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LatestRelease from './components/LatestRelease.vue'
import BlogPostContent from './components/BlogPostContent.vue'
import Landing from './Landing.vue'
import BlogList from './BlogList.vue'
import BlogPost from './BlogPost.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LatestRelease', LatestRelease)
    // Registered globally so `layout: Landing` in a page's frontmatter resolves
    // to it — VitePress renders an unknown layout name as a component.
    app.component('Landing', Landing)
    app.component('BlogList', BlogList)
    app.component('BlogPost', BlogPost)
    app.component('BlogPostContent', BlogPostContent)
  }
} satisfies Theme

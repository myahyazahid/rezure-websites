<script setup lang="ts">
/**
 * Blog post detail layout — renders a single post with full article semantics,
 * breadcrumb navigation, and premium typography. All data comes from the
 * frontmatter injected at build time by [slug].paths.ts — zero runtime API calls.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, params } = useData()

interface BlogPostData {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  featured_image: string | null
  status: string
  published_at: string
  updated_at: string
  author: {
    name: string
    avatar: string | null
  }
  author_name?: string
  author_avatar?: string | null
}

const post = computed<BlogPostData | null>(() => {
  return (params.value?.post as BlogPostData) ?? frontmatter.value.blog_post ?? null
})

const authorName = computed(() => post.value?.author?.name ?? post.value?.author_name ?? '')
const authorAvatar = computed(() => post.value?.author?.avatar ?? post.value?.author_avatar ?? null)

const formattedDate = computed(() => {
  if (!post.value?.published_at) return ''
  return new Date(post.value.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isoDate = computed(() => post.value?.published_at ?? '')
</script>

<template>
  <div class="BlogPost" v-if="post">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li aria-current="page">{{ post.title }}</li>
      </ol>
    </nav>

    <article class="article">
      <!-- Header -->
      <header class="article-header">
        <div class="tags" v-if="post.tags?.length">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <h1 class="article-title">{{ post.title }}</h1>

        <p class="article-excerpt">{{ post.excerpt }}</p>

        <div class="article-meta">
          <div class="author">
            <img
              v-if="authorAvatar"
              :src="authorAvatar"
              :alt="authorName"
              class="author-avatar"
              width="36"
              height="36"
              loading="lazy"
            />
            <div class="author-info">
              <span class="author-name">{{ authorName }}</span>
              <time :datetime="isoDate" class="publish-date">{{ formattedDate }}</time>
            </div>
          </div>
        </div>
      </header>

      <!-- Featured image -->
      <div v-if="post.featured_image" class="featured-image">
        <img :src="post.featured_image" :alt="post.title" loading="eager" />
      </div>

      <!-- Content -->
      <div class="article-content">
        <div v-if="post.content" v-html="post.content" />
        <Content v-else />
      </div>
    </article>

    <!-- Back to blog -->
    <div class="back-nav">
      <a href="/blog/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Blog
      </a>
    </div>
  </div>
</template>

<style scoped>
.BlogPost {
  max-width: 768px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* ---------- Breadcrumb ---------- */

.breadcrumb {
  margin-bottom: 40px;
}

.breadcrumb ol {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: var(--subtle);
}

.breadcrumb a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--brand-text);
}

.breadcrumb li + li::before {
  content: '/';
  margin-right: 8px;
  color: var(--subtle);
}

.breadcrumb li[aria-current="page"] {
  color: var(--foreground);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

/* ---------- Article Header ---------- */

.article-header {
  margin-bottom: 40px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: var(--brand-soft);
  color: var(--brand-text);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}

.article-title {
  margin: 0;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--foreground);
}

.article-excerpt {
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.publish-date {
  font-size: 13px;
  color: var(--subtle);
}

/* ---------- Featured Image ---------- */

.featured-image {
  margin-bottom: 40px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* ---------- Article Content ---------- */

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--foreground);
}

.article-content :deep(h2) {
  margin: 40px 0 16px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.article-content :deep(h3) {
  margin: 32px 0 12px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.article-content :deep(p) {
  margin: 0 0 20px;
  color: var(--muted);
  line-height: 1.8;
}

.article-content :deep(a) {
  color: var(--brand-text);
  text-decoration: underline;
  text-decoration-color: var(--brand-soft);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s;
}

.article-content :deep(a:hover) {
  text-decoration-color: var(--brand-text);
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 0 0 20px;
  padding-left: 24px;
  color: var(--muted);
}

.article-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.article-content :deep(code) {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--surface-raised);
  border: 1px solid var(--border-color);
  font-size: 0.9em;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  color: var(--brand-text);
}

.article-content :deep(strong) {
  color: var(--foreground);
  font-weight: 600;
}

.article-content :deep(blockquote) {
  margin: 24px 0;
  padding: 16px 20px;
  border-left: 3px solid var(--brand);
  border-radius: 0 8px 8px 0;
  background-color: var(--surface-raised);
  color: var(--muted);
}

.article-content :deep(blockquote p) {
  margin: 0;
}

/* ---------- Back navigation ---------- */

.back-nav {
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background-color: var(--surface);
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.back-link:hover {
  border-color: var(--brand);
  color: var(--brand-text);
  background-color: var(--brand-soft);
}

/* ---------- Responsive ---------- */

@media (max-width: 639px) {
  .BlogPost {
    padding: 20px 16px 64px;
  }

  .article-title {
    font-size: 28px;
  }

  .article-excerpt {
    font-size: 16px;
  }

  .breadcrumb li[aria-current="page"] {
    max-width: 160px;
  }
}
</style>

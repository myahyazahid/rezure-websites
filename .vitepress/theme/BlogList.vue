<script setup lang="ts">
/**
 * Blog listing layout — displays all published blog posts in a premium card
 * grid. Data is loaded from blog-data.json at build time (imported statically),
 * so this page is fully static with zero runtime API dependency.
 */
import { ref, computed } from 'vue'
import blogData from '../../blog-data.json'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  tags: string[]
  featured_image: string | null
  published_at: string
  updated_at: string
  author: {
    name: string
    avatar: string | null
  }
}

const posts: BlogPost[] = (blogData as BlogPost[]).filter(
  (p) => p.status === 'published'
)

const activeTag = ref<string | null>(null)
const searchQuery = ref('')

/** Collect unique tags from all posts, sorted alphabetically. */
const allTags = computed(() => {
  const tagSet = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) tagSet.add(tag)
  }
  return [...tagSet].sort()
})

/** Filter posts by active tag and search query. */
const filteredPosts = computed(() => {
  let result = posts

  if (activeTag.value) {
    result = result.filter((p) => p.tags.includes(activeTag.value!))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  // Most recent first
  return result.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )
})

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="BlogList">
    <!-- Hero header -->
    <section class="blog-hero">
      <div class="glow" aria-hidden="true" />
      <div class="container">
        <h1 class="blog-title">Blog</h1>
        <p class="blog-subtitle">
          News, tutorials, and behind-the-scenes looks at Rezure.
        </p>
      </div>
    </section>

    <!-- Controls -->
    <section class="container controls">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search posts..."
          class="search-input"
          aria-label="Search blog posts"
        />
      </div>

      <!-- Tag filter -->
      <div class="tag-filters" v-if="allTags.length">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag-btn"
          :class="{ active: activeTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- Post grid -->
    <section class="container">
      <div class="post-grid" v-if="filteredPosts.length">
        <a
          v-for="post in filteredPosts"
          :key="post.id"
          :href="`/blog/posts/${post.slug}`"
          class="post-card"
        >
          <!-- Featured image -->
          <div class="card-image" v-if="post.featured_image">
            <img :src="post.featured_image" :alt="post.title" loading="lazy" />
          </div>
          <div class="card-image card-image-placeholder" v-else aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 19l7-7 3 3V5h-9l3 3-7 7"/>
              <path d="M2 12l7 7 2-2"/>
              <path d="M7 5l-2 2"/>
            </svg>
          </div>

          <div class="card-body">
            <!-- Tags -->
            <div class="card-tags" v-if="post.tags.length">
              <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="card-tag">{{ tag }}</span>
            </div>

            <!-- Title -->
            <h2 class="card-title">{{ post.title }}</h2>

            <!-- Excerpt -->
            <p class="card-excerpt">{{ post.excerpt }}</p>

            <!-- Footer -->
            <div class="card-footer">
              <div class="card-author">
                <img
                  v-if="post.author.avatar"
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="card-avatar"
                  width="22"
                  height="22"
                  loading="lazy"
                />
                <span class="card-author-name">{{ post.author.name }}</span>
              </div>
              <time :datetime="post.published_at" class="card-date">
                {{ formatDate(post.published_at) }}
              </time>
            </div>
          </div>
        </a>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <h3>No posts found</h3>
        <p>Try adjusting your search or filter.</p>
        <button v-if="activeTag || searchQuery" class="reset-btn" @click="activeTag = null; searchQuery = ''">
          Clear filters
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ---------- Hero ---------- */

.blog-hero {
  position: relative;
  overflow: hidden;
  padding: 72px 0 0;
  text-align: center;
}

.glow {
  position: absolute;
  inset: -200px 0 auto 0;
  height: 500px;
  background: radial-gradient(closest-side, var(--brand-glow), transparent 70%);
  pointer-events: none;
}

.blog-hero .container {
  position: relative;
}

.blog-title {
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--foreground);
}

.blog-subtitle {
  margin: 14px 0 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
}

/* ---------- Controls ---------- */

.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 44px;
  margin-bottom: 36px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--subtle);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background-color: var(--surface);
  color: var(--foreground);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder {
  color: var(--subtle);
}

.search-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.tag-btn:hover {
  border-color: var(--brand);
  color: var(--brand-text);
}

.tag-btn.active {
  background-color: var(--brand);
  border-color: var(--brand);
  color: #fff;
}

/* ---------- Post grid ---------- */

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-bottom: 80px;
}

.post-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: var(--surface);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  border-color: var(--brand);
  transform: translateY(-3px);
  box-shadow: var(--shadow-card), 0 12px 32px -8px rgba(224, 38, 44, 0.12);
}

.card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--surface-raised);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .card-image img {
  transform: scale(1.03);
}

.card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--subtle);
  background: linear-gradient(135deg, var(--surface-raised), var(--surface));
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.card-tag {
  padding: 3px 10px;
  border-radius: 999px;
  background-color: var(--brand-soft);
  color: var(--brand-text);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.card-excerpt {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
  flex: 1;
  /* Clamp to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.card-author {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.card-avatar {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.card-author-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 12px;
  color: var(--subtle);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ---------- Empty state ---------- */

.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--subtle);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.empty-state p {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--muted);
}

.reset-btn {
  padding: 8px 20px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: var(--brand);
  color: var(--brand-text);
}

/* ---------- Responsive ---------- */

@media (max-width: 959px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 639px) {
  .blog-hero {
    padding-top: 48px;
  }

  .blog-title {
    font-size: 34px;
  }

  .blog-subtitle {
    font-size: 16px;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .controls {
    margin-top: 32px;
    margin-bottom: 24px;
  }

  .search-box {
    max-width: 100%;
  }
}
</style>

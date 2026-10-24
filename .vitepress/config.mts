import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'
import { defineConfig, type HeadConfig } from 'vitepress'

const github = 'https://github.com/myahyazahid/rezure'

/**
 * Canonical origin, no trailing slash. Every absolute URL the site emits —
 * canonical links, og:url, og:image, sitemap entries, JSON-LD — is built from
 * this, so a domain move is a one-line change here.
 */
const hostname = 'https://rezure.redscale.my.id'

const siteName = 'Rezure'
const description =
  'Rezure is a free, open-source web server for local development and a lightweight Laragon and XAMPP alternative — Nginx, PHP, MySQL or MariaDB, PostgreSQL, SQL Server, Node.js, and Mailpit running with one click. Available now for Windows.'
const ogImage = `${hostname}/og-image.png`
const authorName = 'Muhammad Yahya Zahid'
const authorUrl = 'https://github.com/myahyazahid'

/**
 * Search engine ownership tokens, read from .env on the build machine so they
 * never need a code change. Either can be left unset — DNS verification of the
 * domain in Search Console needs neither.
 */
const env = loadEnv('production', process.cwd(), '')
const verification: HeadConfig[] = [
  ['google-site-verification', env.GOOGLE_SITE_VERIFICATION],
  ['msvalidate.01', env.BING_SITE_VERIFICATION]
]
  .filter(([, content]) => content)
  .map(([name, content]): HeadConfig => ['meta', { name: name!, content: content! }])

/** Stable @ids so every page's JSON-LD points at the same entities instead of redefining them. */
const ids = {
  organization: `${hostname}/#organization`,
  website: `${hostname}/#website`,
  software: `${hostname}/#software`,
  author: `${hostname}/#author`
}

/** `guide/installation.md` -> `/guide/installation`, `index.md` -> `/`. Matches cleanUrls. */
const routeOf = (relativePath: string) =>
  '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')

const jsonLd = (data: Record<string, unknown>): HeadConfig => [
  'script',
  { type: 'application/ld+json' },
  JSON.stringify(data)
]

const author = {
  '@type': 'Person',
  '@id': ids.author,
  name: authorName,
  url: authorUrl
}

/** Who publishes the site. `sameAs` ties the brand name to its GitHub presence for Google's entity matching. */
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ids.organization,
  name: siteName,
  url: hostname,
  logo: {
    '@type': 'ImageObject',
    url: `${hostname}/icon-512.png`,
    width: 512,
    height: 512
  },
  description,
  founder: author,
  sameAs: [github]
}

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': ids.website,
  name: siteName,
  alternateName: ['Rezure Free Web Server', 'Rezure App'],
  url: hostname,
  description,
  inLanguage: 'en-US',
  publisher: { '@id': ids.organization }
}

/** The app itself. Emitted on the pages that are actually about the product. */
const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': ids.software,
  name: 'Rezure',
  alternateName: ['Rezure Free Web Server', 'Rezure App'],
  description,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Local development environment',
  operatingSystem: 'Windows 10 (1809+), Windows 11, 64-bit',
  url: hostname,
  downloadUrl: `${hostname}/download`,
  softwareHelp: `${hostname}/guide/`,
  screenshot: ogImage,
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'One-click service manager for Nginx, PHP, MariaDB or MySQL, PostgreSQL, SQL Server LocalDB, and Mailpit',
    'Port conflict detection that names the process holding a port and can stop it',
    'Automatic Nginx virtual hosts and Windows hosts file entries for .test domains',
    'PHP version switching with builds installed straight from php.net',
    'Per-project PHP version pinning with concurrent php-cgi pools',
    'PHP extension toggles, plus Redis and SQL Server drivers installed from the app',
    'New project templates for Laravel, WordPress, PHP, and static HTML',
    'Per-project requirements check for PHP extensions, HTTPS, mail, and database settings',
    'Database create, export, and import on MariaDB, MySQL, PostgreSQL, and SQL Server',
    'Adopt an existing Laragon or XAMPP MySQL data directory without copying it',
    'PostgreSQL 16, 17, and 18 as a local service',
    'SQL Server LocalDB, ODBC Driver, and pdo_sqlsrv installed from inside the app',
    'Remote MySQL, MariaDB, PostgreSQL, and SQL Server connections with optional SSH tunnel',
    'Node.js and Composer version management with per-project Node pinning',
    'Local mail catcher (Mailpit)',
    'One-click public project sharing via Cloudflare Quick Tunnel',
    'Signed automatic updates'
  ],
  image: `${hostname}/icon-512.png`,
  author,
  publisher: { '@id': ids.organization },
  sameAs: [github]
}

/** Markdown inline syntax -> plain text, for JSON-LD fields that must not carry markup. */
const plainText = (markdown: string) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * FAQPage entries from guide/faq.md: every `### Question` heading and the
 * prose under it, up to the next heading. Read from the source so the JSON-LD
 * can never drift from what the page says.
 */
function faqEntities(file: string) {
  const entities: Record<string, unknown>[] = []
  let question: string | null = null
  let answer: string[] = []
  const flush = () => {
    if (question && answer.length) {
      entities.push({
        '@type': 'Question',
        name: plainText(question),
        acceptedAnswer: { '@type': 'Answer', text: plainText(answer.join(' ')) }
      })
    }
    question = null
    answer = []
  }
  for (const line of readFileSync(file, 'utf-8').split(/\r?\n/)) {
    if (line.startsWith('#')) {
      flush()
      if (line.startsWith('### ')) question = line.slice(4)
    } else if (question && line.trim() && !line.startsWith('```')) {
      answer.push(line)
    }
  }
  flush()
  return entities
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteName,
  description,
  lang: 'en-US',
  cleanUrls: true,
  // Internal planning notes live in the repo but are not part of the site.
  srcExclude: [
    'rezure-website-content-structure.md',
    // The repo's own README, not a page — it was being published at /README.
    'README.md',
    'blog.md',
    'blog_plan.md',
    'docs-screenshot-list.md',
    // Unpublished post drafts; their README links to an .html preview, not a page.
    'blog-drafts/**'
  ],
  lastUpdated: true,

  // Emits /sitemap.xml at build time, which is what Search Console is pointed at.
  sitemap: {
    hostname,
    // Never list the not-found page, even if a build starts emitting it.
    transformItems: (items) => items.filter((item) => !/(^|\/)404(\.html)?$/.test(item.url))
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#e0262c' }],
    ['meta', { name: 'application-name', content: siteName }],
    ['meta', { name: 'author', content: authorName }],
    ...verification,
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Rezure Free Web Server'
      }
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap'
      }
    ]
  ],

  /**
   * robots per page: the not-found page is served for every unknown URL, and
   * must not be indexed as if it were content. Everything else lets Google use
   * a full-size thumbnail and an unclipped snippet.
   */
  transformHead({ pageData }) {
    const notFound = pageData.isNotFound || pageData.relativePath === '404.md'
    return [
      [
        'meta',
        {
          name: 'robots',
          content: notFound
            ? 'noindex, follow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      ]
    ]
  },

  /**
   * Per-page SEO. The static `head` above carries what every page shares; this
   * fills in the parts that differ per URL — canonical, og:url, and the title
   * and description crawlers read from Open Graph rather than from <title>.
   */
  transformPageData(pageData, { siteConfig }) {
    const route = routeOf(pageData.relativePath)
    const url = hostname + route
    const isHome = route === '/'

    // ---- Blog post SEO: JSON-LD Article, og:type=article, article meta ----
    const blogPost = (pageData.params as any)?.post ?? pageData.frontmatter.blog_post
    const isBlogPost = route.startsWith('/blog/posts/') && Boolean(blogPost)

    const rawTitle = blogPost?.title ?? pageData.frontmatter.title ?? pageData.title ?? siteName
    const pageTitle = rawTitle
    if (isBlogPost && blogPost?.title) {
      pageData.title = blogPost.title
    }
    // Pages that already carry the brand in their own title opt out of the suffix.
    const suffixed = !isHome && pageData.frontmatter.titleTemplate !== false
    const fullTitle = suffixed ? `${pageTitle} | ${siteName}` : pageTitle
    const pageDescription = blogPost?.excerpt ?? pageData.frontmatter.description ?? description
    if (isBlogPost && blogPost?.excerpt) {
      pageData.description = blogPost.excerpt
    }

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: fullTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: fullTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }]
    ]

    if (isBlogPost && blogPost) {
      const authorName = blogPost.author?.name ?? blogPost.author_name ?? 'Rezure Team'
      const authorAvatar = blogPost.author?.avatar ?? blogPost.author_avatar ?? null

      // Override og:type from website to article
      head.push(['meta', { property: 'og:type', content: 'article' }])
      head.push(['meta', { property: 'article:published_time', content: blogPost.published_at }])
      head.push(['meta', { property: 'article:modified_time', content: blogPost.updated_at }])
      head.push(['meta', { property: 'article:author', content: authorName }])
      for (const tag of blogPost.tags ?? []) {
        head.push(['meta', { property: 'article:tag', content: tag }])
      }
      if (blogPost.featured_image) {
        head.push(['meta', { property: 'og:image', content: blogPost.featured_image }])
        head.push(['meta', { name: 'twitter:image', content: blogPost.featured_image }])
      }

      // JSON-LD Article schema
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blogPost.title,
          description: blogPost.excerpt,
          datePublished: blogPost.published_at,
          dateModified: blogPost.updated_at,
          author: {
            '@type': 'Person',
            name: authorName,
            ...(authorAvatar ? { image: authorAvatar } : {})
          },
          publisher: { '@id': ids.organization },
          isPartOf: { '@id': ids.website },
          mainEntityOfPage: url,
          ...(blogPost.featured_image ? { image: blogPost.featured_image } : {}),
          keywords: (blogPost.tags ?? []).join(', ')
        })
      )

      // 3-level breadcrumb: Home → Blog → Post Title
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: siteName, item: hostname },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${hostname}/blog/` },
            { '@type': 'ListItem', position: 3, name: blogPost.title, item: url }
          ]
        })
      )
      head.push(jsonLd(organization))
    } else if (isHome) {
      head.push(jsonLd(organization))
      head.push(jsonLd(website))
      head.push(jsonLd(softwareApplication))
    } else if (route.startsWith('/guide/')) {
      const isDocsHome = route === '/guide/'
      const modified = pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : undefined

      // Docs pages are articles about the app: author, freshness, and what they're about.
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: pageTitle,
          description: pageDescription,
          url,
          mainEntityOfPage: url,
          inLanguage: 'en-US',
          ...(modified ? { dateModified: modified } : {}),
          image: ogImage,
          author,
          publisher: { '@id': ids.organization },
          isPartOf: { '@id': ids.website },
          about: { '@id': ids.software }
        })
      )
      if (isDocsHome) head.push(jsonLd(softwareApplication))
      if (route === '/guide/faq') {
        head.push(
          jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqEntities(resolve(siteConfig.srcDir, pageData.relativePath))
          })
        )
      }

      // Home → Docs → Page (the docs home itself stops at Docs).
      const crumbs = [
        { name: siteName, item: hostname },
        { name: 'Docs', item: `${hostname}/guide/` },
        ...(isDocsHome ? [] : [{ name: pageTitle, item: url }])
      ]
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb }))
        })
      )
    } else {
      if (route === '/download') head.push(jsonLd(softwareApplication))
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: siteName, item: hostname },
            { '@type': 'ListItem', position: 2, name: pageTitle, item: url }
          ]
        })
      )
    }

    pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ...head]
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
      { text: 'Download', link: '/download' },
      { text: 'Docs', link: '/guide/', activeMatch: '/guide/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is Rezure?', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'First Run', link: '/guide/first-run' },
            { text: 'Coming from Laragon or XAMPP', link: '/guide/switch-from-laragon-xampp' }
          ]
        },
        {
          text: 'Services',
          items: [
            { text: 'Services', link: '/guide/services' },
            { text: 'Port Conflicts', link: '/guide/port-conflicts' },
            { text: 'Logs', link: '/guide/logs' }
          ]
        },
        {
          text: 'Projects',
          items: [
            { text: 'Projects', link: '/guide/projects' },
            { text: 'New Project', link: '/guide/new-project' },
            { text: 'Requirements Check', link: '/guide/requirements-check' },
            { text: 'Project Terminal', link: '/guide/project-terminal' },
            { text: 'Sharing a Project', link: '/guide/sharing' }
          ]
        },
        {
          text: 'PHP',
          items: [
            { text: 'PHP Versions', link: '/guide/php-versions' },
            { text: 'PHP Per Project', link: '/guide/project-php-version' },
            { text: 'PHP Extensions', link: '/guide/php-extensions' },
            { text: 'PHP Configuration', link: '/guide/php-configuration' }
          ]
        },
        {
          text: 'Databases',
          items: [
            { text: 'MariaDB & MySQL', link: '/guide/mariadb-mysql' },
            { text: 'PostgreSQL', link: '/guide/postgresql' },
            { text: 'SQL Server', link: '/guide/sql-server' },
            { text: 'Remote Databases', link: '/guide/remote-databases' },
            { text: 'Laravel .env Cheatsheet', link: '/guide/laravel-env' }
          ]
        },
        {
          text: 'Tools',
          items: [
            { text: 'Node.js', link: '/guide/nodejs' },
            { text: 'Mailpit', link: '/guide/mailpit' },
            { text: 'AI Coding Agents', link: '/guide/ai-agents' }
          ]
        },
        {
          text: 'Customize',
          items: [
            { text: 'Appearance & Stickers', link: '/guide/appearance' },
            { text: 'Settings', link: '/guide/settings' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Files & Folders', link: '/guide/files-and-folders' },
            { text: 'Ports', link: '/guide/ports' },
            { text: 'Updates & Changelog', link: '/guide/updates' },
            { text: 'Privacy & Usage Data', link: '/guide/privacy' },
            { text: 'Uninstall', link: '/guide/uninstall' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
            { text: 'FAQ', link: '/guide/faq' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: github }],

    search: { provider: 'local' },

    footer: {
      message:
        'Rezure Free Web Server · <a href="/download">Download</a> · <a href="/guide/">Docs</a> · <a href="https://github.com/myahyazahid/rezure">GitHub</a>',
      copyright: `Copyright © ${new Date().getFullYear()} Rezure`
    }
  }
})

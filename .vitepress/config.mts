import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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
  'Rezure is the best free, open-source local development server for Windows and a lightweight Laragon and XAMPP alternative: Nginx, PHP, MySQL or MariaDB, PostgreSQL, SQL Server, Node.js dev servers, and Mailpit in one click.'
const descriptionId =
  'Rezure adalah local development server gratis dan open source terbaik untuk Windows, alternatif ringan Laragon dan XAMPP: Nginx, PHP, MySQL atau MariaDB, PostgreSQL, SQL Server, dev server Node.js, dan Mailpit dalam satu klik.'
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

/** `/id/guide/installation` -> `/guide/installation`. The English route is the one every check below keys on. */
const enRouteOf = (route: string) => route.replace(/^\/id(\/|$)/, '/')

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
  alternateName: ['Rezure Local Dev Environment', 'Rezure Free Web Server', 'Rezure App'],
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
  alternateName: ['Rezure Local Dev Environment', 'Rezure Free Web Server', 'Rezure App'],
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
    'Framework detection for Laravel, CodeIgniter, Symfony, WordPress, Drupal, and more, served from the right document root',
    'Vite, Next.js, Nuxt, Astro, Angular, and Node dev servers on .test domains, with hot reload',
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
    'Open databases in TablePlus, DBeaver, HeidiSQL, or MySQL Workbench, SSH tunnels included',
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
      // The Indonesian FAQ pins each heading to its English anchor with `{#slug}`.
      if (line.startsWith('### ')) question = line.slice(4).replace(/\s*\{#[^}]*\}\s*$/, '')
    } else if (question && line.trim() && !line.startsWith('```')) {
      answer.push(line)
    }
  }
  flush()
  return entities
}

type Locale = 'en' | 'id'

/** Nav bar links, per locale. Indonesian routes are the English ones under /id/. */
function nav(locale: Locale) {
  const p = locale === 'id' ? '/id' : ''
  const t = (en: string, id: string) => (locale === 'id' ? id : en)
  return [
    { text: t('Home', 'Beranda'), link: `${p}/` },
    { text: 'Blog', link: `${p}/blog/`, activeMatch: `${p}/blog/` },
    { text: t('Download', 'Unduh'), link: `${p}/download` },
    { text: t('Docs', 'Dokumentasi'), link: `${p}/guide/`, activeMatch: `${p}/guide/` }
  ]
}

/**
 * The docs sidebar, one table for both languages so the two trees can't drift
 * apart: each entry is [page, English label, Indonesian label].
 */
const docsSidebar: { text: [string, string]; items: [string, string, string][] }[] = [
  {
    text: ['Getting Started', 'Memulai'],
    items: [
      ['', 'What is Rezure?', 'Apa itu Rezure?'],
      ['installation', 'Installation', 'Instalasi'],
      ['first-run', 'First Run', 'Pertama Kali Dijalankan'],
      ['switch-from-laragon-xampp', 'Coming from Laragon or XAMPP', 'Pindah dari Laragon atau XAMPP']
    ]
  },
  {
    text: ['Services', 'Layanan'],
    items: [
      ['services', 'Services', 'Layanan'],
      ['port-conflicts', 'Port Conflicts', 'Konflik Port'],
      ['logs', 'Logs', 'Log']
    ]
  },
  {
    text: ['Projects', 'Proyek'],
    items: [
      ['projects', 'Projects', 'Proyek'],
      ['frameworks', 'Frameworks', 'Framework'],
      ['dev-servers', 'Dev Servers', 'Dev Server'],
      ['new-project', 'New Project', 'Proyek Baru'],
      ['requirements-check', 'Requirements Check', 'Cek Kebutuhan'],
      ['project-terminal', 'Project Terminal', 'Terminal Proyek'],
      ['sharing', 'Sharing a Project', 'Berbagi Proyek']
    ]
  },
  {
    text: ['PHP', 'PHP'],
    items: [
      ['php-versions', 'PHP Versions', 'Versi PHP'],
      ['project-php-version', 'PHP Per Project', 'PHP per Proyek'],
      ['php-extensions', 'PHP Extensions', 'Ekstensi PHP'],
      ['php-configuration', 'PHP Configuration', 'Konfigurasi PHP']
    ]
  },
  {
    text: ['Databases', 'Database'],
    items: [
      ['mariadb-mysql', 'MariaDB & MySQL', 'MariaDB & MySQL'],
      ['postgresql', 'PostgreSQL', 'PostgreSQL'],
      ['sql-server', 'SQL Server', 'SQL Server'],
      ['remote-databases', 'Remote Databases', 'Database Remote'],
      ['laravel-env', 'Laravel .env Cheatsheet', 'Contekan .env Laravel']
    ]
  },
  {
    text: ['Tools', 'Alat'],
    items: [
      ['nodejs', 'Node.js', 'Node.js'],
      ['mailpit', 'Mailpit', 'Mailpit'],
      ['ai-agents', 'AI Coding Agents', 'AI Coding Agent']
    ]
  },
  {
    text: ['Customize', 'Kustomisasi'],
    items: [
      ['appearance', 'Appearance & Stickers', 'Tampilan & Stiker'],
      ['settings', 'Settings', 'Pengaturan']
    ]
  },
  {
    text: ['Reference', 'Referensi'],
    items: [
      ['files-and-folders', 'Files & Folders', 'File & Folder'],
      ['ports', 'Ports', 'Port'],
      ['updates', 'Updates & Changelog', 'Pembaruan & Changelog'],
      ['privacy', 'Privacy & Usage Data', 'Privasi & Data Penggunaan'],
      ['uninstall', 'Uninstall', 'Uninstall'],
      ['troubleshooting', 'Troubleshooting', 'Pemecahan Masalah'],
      ['faq', 'FAQ', 'FAQ']
    ]
  }
]

function sidebar(locale: Locale) {
  const base = locale === 'id' ? '/id/guide/' : '/guide/'
  const i = locale === 'id' ? 1 : 0
  return docsSidebar.map((group) => ({
    text: group.text[i],
    items: group.items.map(([page, en, id]) => ({ text: locale === 'id' ? id : en, link: base + page }))
  }))
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
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    [
      'meta',
      {
        property: 'og:image:alt',
        content: 'Rezure | Best Local Development Server'
      }
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    // Self-hosted, declared in theme/custom.css. Preloaded so the text doesn't
    // wait for the stylesheet to be parsed before the font request starts.
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/instrument-sans-latin.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
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
    // Indonesian pages mirror the English tree under /id/, so every branch
    // below matches on the English route and only the URLs and labels differ.
    const isId = route === '/id/' || route.startsWith('/id/')
    const enRoute = enRouteOf(route)
    const home = isId ? `${hostname}/id/` : hostname
    const inLanguage = isId ? 'id-ID' : 'en-US'
    const isHome = enRoute === '/'

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
    const pageDescription =
      blogPost?.excerpt ?? pageData.frontmatter.description ?? (isId ? descriptionId : description)
    if (isBlogPost && blogPost?.excerpt) {
      pageData.description = blogPost.excerpt
    }

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: fullTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: fullTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { property: 'og:locale', content: isId ? 'id_ID' : 'en_US' }]
    ]

    // Blog posts come from the API in English only; every other page has a
    // twin in the other language, and search engines are told about both.
    if (!isBlogPost) {
      head.push(
        ['meta', { property: 'og:locale:alternate', content: isId ? 'en_US' : 'id_ID' }],
        ['link', { rel: 'alternate', hreflang: 'en', href: hostname + enRoute }],
        ['link', { rel: 'alternate', hreflang: 'id', href: hostname + (enRoute === '/' ? '/id/' : '/id' + enRoute) }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: hostname + enRoute }]
      )
    }

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
      head.push(jsonLd(isId ? { ...website, url: home, description: descriptionId, inLanguage } : website))
      head.push(jsonLd(softwareApplication))
    } else if (enRoute.startsWith('/guide/')) {
      const isDocsHome = enRoute === '/guide/'
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
          inLanguage,
          ...(modified ? { dateModified: modified } : {}),
          image: ogImage,
          author,
          publisher: { '@id': ids.organization },
          isPartOf: { '@id': ids.website },
          about: { '@id': ids.software }
        })
      )
      if (isDocsHome) head.push(jsonLd(softwareApplication))
      if (enRoute === '/guide/faq') {
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
        { name: siteName, item: home },
        { name: isId ? 'Dokumentasi' : 'Docs', item: `${hostname}${isId ? '/id' : ''}/guide/` },
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
      if (enRoute === '/download') head.push(jsonLd(softwareApplication))
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: siteName, item: home },
            { '@type': 'ListItem', position: 2, name: pageTitle, item: url }
          ]
        })
      )
    }

    pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ...head]
  },

  locales: {
    root: { label: 'English', lang: 'en-US' },
    id: {
      label: 'Bahasa Indonesia',
      lang: 'id-ID',
      link: '/id/',
      description: descriptionId,
      themeConfig: {
        nav: nav('id'),
        sidebar: { '/id/guide/': sidebar('id') },
        footer: {
          message:
            'Rezure · Local development server terbaik · <a href="/id/download">Unduh</a> · <a href="/id/guide/">Dokumentasi</a> · <a href="https://github.com/myahyazahid/rezure">GitHub</a>',
          copyright: `Hak cipta © ${new Date().getFullYear()} Rezure`
        },
        outline: { label: 'Di halaman ini' },
        docFooter: { prev: 'Sebelumnya', next: 'Berikutnya' },
        lastUpdated: { text: 'Terakhir diperbarui' },
        darkModeSwitchLabel: 'Tampilan',
        lightModeSwitchTitle: 'Ganti ke mode terang',
        darkModeSwitchTitle: 'Ganti ke mode gelap',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Kembali ke atas',
        langMenuLabel: 'Ganti bahasa',
        skipToContentLabel: 'Langsung ke konten',
        notFound: {
          title: 'HALAMAN TIDAK DITEMUKAN',
          quote: 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
          linkLabel: 'kembali ke beranda',
          linkText: 'Kembali ke beranda'
        }
      }
    }
  },

  // The EN / ID pill takes the place of the default theme's language flyout,
  // in the same spot in the nav bar. See theme/components/LangSwitch.vue.
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarTranslations\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/LangSwitch.vue', import.meta.url))
        }
      ]
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav('en'),

    sidebar: { '/guide/': sidebar('en') },

    socialLinks: [{ icon: 'github', link: github }],

    search: {
      provider: 'local',
      options: {
        locales: {
          id: {
            translations: {
              button: { buttonText: 'Cari', buttonAriaLabel: 'Cari' },
              modal: {
                displayDetails: 'Tampilkan detail',
                resetButtonTitle: 'Hapus pencarian',
                backButtonTitle: 'Tutup pencarian',
                noResultsText: 'Tidak ada hasil untuk',
                footer: {
                  selectText: 'pilih',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'pindah',
                  navigateUpKeyAriaLabel: 'panah atas',
                  navigateDownKeyAriaLabel: 'panah bawah',
                  closeText: 'tutup',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          }
        }
      }
    },

    footer: {
      message:
        'Rezure · The best local development server · <a href="/download">Download</a> · <a href="/guide/">Docs</a> · <a href="https://github.com/myahyazahid/rezure">GitHub</a>',
      copyright: `Copyright © ${new Date().getFullYear()} Rezure`
    }
  }
})

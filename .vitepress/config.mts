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
  'Rezure is a modern, lightweight local development environment manager for Windows — Nginx, PHP, and MariaDB running with one click.'
const ogImage = `${hostname}/og-image.png`

/** `guide/installation.md` -> `/guide/installation`, `index.md` -> `/`. Matches cleanUrls. */
const routeOf = (relativePath: string) =>
  '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')

const jsonLd = (data: Record<string, unknown>): HeadConfig => [
  'script',
  { type: 'application/ld+json' },
  JSON.stringify(data)
]

/** The app itself. Emitted on the pages that are actually about the product. */
const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Rezure',
  alternateName: 'Rezure App',
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
    'One-click Nginx, PHP-FPM, and MariaDB service manager',
    'Port conflict detection before a service starts',
    'Automatic Nginx virtual hosts and Windows hosts file entries',
    'PHP version switching with builds installed straight from php.net',
    'Database create, export, and import on the bundled MariaDB'
  ],
  author: {
    '@type': 'Person',
    name: 'Muhammad Yahya Zahid',
    url: 'https://github.com/myahyazahid'
  },
  codeRepository: github
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteName,
  description,
  lang: 'en-US',
  cleanUrls: true,
  // Internal planning notes live in the repo but are not part of the site.
  srcExclude: ['rezure-website-content-structure.md'],
  lastUpdated: true,

  // Emits /sitemap.xml at build time, which is what Search Console is pointed at.
  sitemap: { hostname },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#e0262c' }],
    ['meta', { name: 'application-name', content: siteName }],
    ['meta', { name: 'author', content: 'Muhammad Yahya Zahid' }],
    // Lets Google use a full-size thumbnail and an unclipped snippet.
    [
      'meta',
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    ],
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
        content: 'Rezure — local development environment manager for Windows'
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
   * Per-page SEO. The static `head` above carries what every page shares; this
   * fills in the parts that differ per URL — canonical, og:url, and the title
   * and description crawlers read from Open Graph rather than from <title>.
   */
  transformPageData(pageData) {
    const route = routeOf(pageData.relativePath)
    const url = hostname + route
    const isHome = route === '/'

    const pageTitle = pageData.frontmatter.title ?? pageData.title ?? siteName
    // Pages that already carry the brand in their own title opt out of the suffix.
    const suffixed = !isHome && pageData.frontmatter.titleTemplate !== false
    const fullTitle = suffixed ? `${pageTitle} | ${siteName}` : pageTitle
    const pageDescription = pageData.frontmatter.description ?? description

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: fullTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: fullTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }]
    ]

    if (isHome) {
      head.push(jsonLd(softwareApplication))
      head.push(
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          alternateName: 'Rezure for Windows',
          url: hostname,
          description,
          inLanguage: 'en-US'
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
            { text: 'FAQ', link: '/guide/faq' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: github }],

    search: { provider: 'local' },

    footer: {
      message: 'Built with VitePress.',
      copyright: `Copyright © ${new Date().getFullYear()} Rezure`
    }
  }
})

import { defineConfig } from 'vitepress'

const github = 'https://github.com/myahyazahid/rezure'
const description =
  'Rezure is a modern, lightweight local development environment manager for Windows — Nginx, PHP, and MariaDB running with one click.'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Rezure',
  description,
  lang: 'en-US',
  cleanUrls: true,
  // Internal planning notes live in the repo but are not part of the site.
  srcExclude: ['rezure-website-content-structure.md'],
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#5b8def' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Rezure' }],
    ['meta', { property: 'og:description', content: description }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      }
    ]
  ],

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
            { text: 'First Run', link: '/guide/first-run' }
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

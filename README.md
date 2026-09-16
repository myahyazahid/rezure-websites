# Rezure Websites

Marketing site and documentation for [Rezure](https://github.com/myahyazahid/rezure) — a local development environment manager for Windows (Nginx, PHP, and MariaDB with one click) — built with [VitePress](https://vitepress.dev).

Live at [rezure.redscale.my.id](https://rezure.redscale.my.id).

## Structure

- `index.md` — landing page (rendered by `.vitepress/theme/Landing.vue`; all copy lives in the frontmatter, the component only owns the layout)
- `download.md` — download page
- `guide/` — user documentation (installation, first run, sharing, remote databases, PHP per project, FAQ)
- `.vitepress/config.mts` — site config, SEO/head tags, nav, and sidebar
- `.vitepress/theme/` — custom theme components
- `public/` — static assets (favicons, OG image)

## Getting started

```sh
npm install
npm run docs:dev
```

Then open the local URL printed in the terminal.

## Environment variables

Copy `.env.example` to `.env` and set:

```
VITE_REZURE_API_BASE=http://localhost:8000/api/v1
```

Used by the download page to fetch the latest release version. If unset, the download page falls back to linking the GitHub releases page.

## Scripts

| Command | Description |
| --- | --- |
| `npm run docs:dev` | Start the local dev server |
| `npm run docs:build` | Build the static site to `.vitepress/dist` |
| `npm run docs:preview` | Preview the production build locally |

## Deployment

`deploy.bat` pulls the latest commit on the VPS and rebuilds the site. Requires SSH access to the deployment server.

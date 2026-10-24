# Rezure Websites

Marketing site and documentation for [Rezure](https://github.com/myahyazahid/rezure), the free web server for local development (Nginx, PHP, MySQL, and PostgreSQL with one click), built with [VitePress](https://vitepress.dev).

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

### Nginx on the VPS (SEO)

Unknown URLs must return a real `404` status (not `200` with the not-found page — Google
treats that as a soft 404), and the `.html` / trailing-slash variants of a page should
redirect to the clean URL the canonical tags and sitemap use:

```nginx
root /var/www/rezure-websites/.vitepress/dist;

# /guide/installation.html -> /guide/installation
location ~ ^(.+)\.html$ { return 301 $1$is_args$args; }

location / {
    try_files $uri $uri.html $uri/index.html =404;
}

error_page 404 /404.html;
```

Check after reloading Nginx: `curl -I https://rezure.redscale.my.id/does-not-exist` should
answer `404`, and `/guide/installation.html` should answer `301`.

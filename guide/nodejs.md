---
title: Install and Switch Node.js Versions on Windows
description: Install Node.js versions from nodejs.org inside Rezure, pick a global version, pin a version per project, and run Vite, Next.js, or Nuxt dev servers on .test domains — npm included.
---

# Node.js

Rezure installs and switches Node.js versions the same way it does PHP: official builds,
checksum-verified, several side by side. Each build comes with its own `npm` and `npx`.

Node in Rezure powers two things: the [project terminal](/guide/project-terminal) (`npm
install`, build tools) and [dev servers](/guide/dev-servers), which serve Vite, Next.js, Nuxt,
Astro, and Node apps at their `.test` domain. See [JavaScript projects](#javascript-projects)
below.

## Install a version

1. On the **Switch** page, click **Install version** and pick **Node.js**.
2. Rezure reads nodejs.org's release index and lists the **newest patch of every LTS line**
   (badge **LTS** plus its codename) and the newest **Current** release (badge **Latest**),
   each with the `npm` version it ships.
3. Click **Install**. The download is checked against that release's published SHA-256 and
   unpacked into `C:\rezure\bin\node\<version>`.

A Node build you downloaded yourself (the Windows `.zip`) can also be unzipped into
`C:\rezure\custom\node` — Rezure picks it up on the next scan, without checksum verification.

## The global version

Pick a version in the **Node.js** row of the Switch page; it shows "active X · npm Y". The
choice is remembered across restarts.

The global version is what a [project terminal](/guide/project-terminal) gets, unless the
project pins its own. Picking a version doesn't restart anything — open a new project terminal
to use it.

There's no "Node everywhere" option like PHP has: Rezure doesn't touch your system `PATH` for
Node. Terminals Rezure didn't open keep using whatever Node you installed yourself, if any.

## Pin Node per project

1. On the **Projects** page, click the project's **Node.js version** icon ("Pin this project to
   its own Node.js version").
2. Choose **Default · follows the global active version**, or one of the installed versions
   ("Node.js 22.x · npm 10.x").
3. Open a terminal from the project's row. `node -v` there shows the pinned version.

While a version is pinned, the icon is filled in and its tooltip reads "Pinned to Node.js X —
click to change".

A pin decides which `node`, `npm`, and `npx` come first on `PATH` in the **next** terminal
opened from that project's row, and which Node.js the project's
[dev server](/guide/dev-servers) runs on the next time it starts. It doesn't restart anything,
and a terminal that's already open keeps the version it started with.

Rezure doesn't read `.nvmrc`, `.node-version`, or the `engines` field in `package.json` — the
pin in Rezure is what counts.

With no Node installed, the dialog says "No Node.js versions installed yet — install one from
the Switch page first."

## JavaScript projects

A folder with a `package.json` is listed on the Projects page as **Vue**, **React**,
**Svelte**, **Angular**, **Astro**, **Next.js**, **Nuxt**, or **Node**. Since Rezure 3.3 these
are served by their own **dev server**: click **Open** and Rezure runs `npm run dev` (or the
project's own script) on a port of its own, waits until it answers, and opens
`http://<name>.test`. Nginx passes the domain to that port, hot reload included. See
[Dev Servers](/guide/dev-servers) for ports, scripts, and troubleshooting.

Dependencies come first. If `node_modules` is missing, the **Dev servers** dialog offers an
**npm install** button (or pnpm, yarn, or bun, going by the project's lockfile). You can also
run it from a project terminal:

```bat
npm install
```

To serve a **built** `dist\` folder as plain files instead, click the project's framework badge
and choose **Custom folder…**. See [Frameworks](/guide/frameworks#change-a-project-s-framework).

### Laravel with Vite

A Laravel project is served by Nginx and PHP as usual, so it isn't a dev server project. Run
`npm run dev` in its project terminal to start Vite alongside for hot reload. Laravel's Vite
plugin writes the dev server's address into the page, so the site at `http://myapp.test` picks
up your CSS and JS changes live. The same goes for CodeIgniter, Symfony, and other PHP projects
that use npm for assets: Rezure detects them as the PHP framework they are.

## Remove a version

There's no uninstall button. Quit Rezure and delete the folder under `C:\rezure\bin\node\` (or
`C:\rezure\custom\node\`). Projects pinned to it go back to the global version.

## Related

- [Dev Servers](/guide/dev-servers) — Vite, Next.js, Astro, and Nuxt on `.test` domains
- [Project Terminal](/guide/project-terminal) — where Node versions apply
- [PHP Versions](/guide/php-versions) — the Switch page in general
- [Frameworks](/guide/frameworks) — how JavaScript projects are detected

---
title: Vite, Next.js, and Nuxt Dev Servers on .test Domains
description: Open Vite, Next.js, Nuxt, Astro, Angular, and Node apps at http://myapp.test on Windows. Rezure proxies the domain to the dev server, starts it on Open, keeps hot reload working, and stops it on exit.
---

# Dev Servers

A Vite, Next.js, Nuxt, or Astro project isn't a folder of files a web server can hand out. It
only works while its own dev server runs. Rezure handles that for you: Nginx passes every
request for the project's `.test` domain to the dev server's port, and Rezure starts the dev
server when you open the project.

So `http://my-astro-site.test` works the same way `http://my-laravel-app.test` does, with hot
reload included, and you don't need to remember `localhost:5173`.

New in Rezure 3.3.

## Which projects use a dev server

Every project detected as **Vue**, **React**, **Svelte**, **Angular**, **Astro**, **Next.js**,
**Nuxt**, or **Node**. That includes Node apps that listen on a port of their own, such as an
Express API or a self-hosted tool. See [Frameworks](/guide/frameworks) for how detection works.

To serve a JavaScript project's **built** output (`dist/`) as plain files instead, open its
framework badge and pick **Custom folder…**. To put a project on a dev server that detection
missed, pick its framework from the same badge.

Laravel with Vite is different: the site is still served by PHP, and Laravel's Vite plugin
talks to `npm run dev` directly. See [Node.js](/guide/nodejs#laravel-with-vite).

## Open a project

Click **Open** on the project's row. If the dev server isn't running, Rezure:

1. Shows "Starting its dev server — the browser opens once it answers".
2. Runs the project's script (`npm run dev`, for example) on the project's port.
3. Waits until the port answers, and **only then** opens your browser, so you land on the app
   and not on an error page.

The small dot on the **Open** button shows its state: grey when stopped, pulsing while it starts,
and green while it runs.

If it fails to start, the browser isn't opened. A message under the header says why, with
**Fix in Dev servers**, which opens the dialog at that project.

With **Open starts it** turned off, **Open** only opens the browser. Until you start the server,
the page reads "This project's dev server isn't running".

## The Dev servers dialog

**Dev servers**, next to **Sync hosts file** on the Projects page, lists every project served
this way. Its badge counts the ones running.

Each project's card shows its domain, framework, status (**Running**, **Starting…**,
**Stopped**), the exact command it runs, and **Start** / **Stop** / **Log**. **Stop all** stops
every dev server at once.

| Setting | What it does |
| --- | --- |
| **Port** | Where Nginx sends the domain. Rezure picks one from **4400–4499** the first time and keeps it, so a domain always reaches the same port. Change it for an app that listens on a fixed port of its own. |
| **Tell it the port with** | How the dev server is told to use that port. The default comes from the framework. See below. |
| **Script** | The `package.json` script that starts it. The dropdown lists the project's scripts. |
| **Open starts it** | On: **Open** starts the dev server first. Off: you start it yourself. |

Port and script can only be changed while the dev server is stopped ("Stop it to change its port
or script."). Click **Save** to keep a change, or **Revert** to drop it.

Settings are kept in `C:\rezure\etc\dev-servers.json`. Don't edit that file while Rezure runs.

### How the port is passed

| Option | Added to the command | For |
| --- | --- | --- |
| **--port + --strictPort** | `-- --port 4400 --strictPort` | Vite (Vue, React, Svelte). Without `--strictPort`, Vite quietly moves to the next port when its own is taken. |
| **--port** | `-- --port 4400` | Next.js, Nuxt, Astro, `ng serve` |
| **PORT variable only** | nothing | Create React App, and Node apps that read `process.env.PORT` |
| **The app's own port** | nothing | Apps that always use the same port. Enter that port in **Port**. |

The `PORT` environment variable is set in every case.

### Default scripts

| Framework | Script |
| --- | --- |
| Vue, React, Svelte, Astro, Next.js, Nuxt | `dev` |
| Angular, Node | `start` |

If `package.json` doesn't have the default, Rezure tries `dev`, then `start`. If neither exists,
the card says so and lets you pick one.

### Port rules

When you save a port, Rezure checks it before keeping it:

- It must be between 1024 and 65535.
- No other project may use it.
- It can't be one of Rezure's own ports: 80, MariaDB/MySQL, PostgreSQL, the PHP ports, Mailpit,
  or the LocalDB bridge. See [Ports](/guide/ports).

## When a dev server can't start yet

The card tells you what's missing and offers the fix:

| Message | Fix |
| --- | --- |
| "Its dependencies aren't installed yet." | Click **npm install** (or **pnpm install**, **yarn install**, **bun install**, depending on the project's lockfile). Its output shows in the card's log. |
| "Node.js isn't installed." / "Set to Node.js x, which isn't installed." | **Open Switch** and install it. See [Node.js](/guide/nodejs). |
| "package.json has no "dev" script — pick another below." | Pick the right script from **Script**. |
| "This project uses pnpm, which isn't installed." | Run `corepack enable` in a terminal, or install pnpm (or yarn). |
| "It's already running outside Rezure …" | Click **Stop it and start here**. See below. |
| The port is held by another program | Click **Free port N and start**, the same flow as [Port Conflicts](/guide/port-conflicts). |

### Already running in a terminal

If you started the same dev server yourself, with `npm run dev` in a terminal or an IDE's run
button, Rezure finds it. It looks for a Node, Bun, or Deno process working in the project's
folder and listening on a port. Astro and Next.js refuse to run twice in one folder, and two
copies would fight over ports anyway.

**Stop it and start here** stops that copy's server and starts Rezure's own on the project's
port. The terminal you typed the command in stays open. A build watcher or test runner in the
same folder is left alone, because it doesn't listen on a port.

### Clear error messages

When a dev server exits during startup, Rezure keeps its last 40 lines of output and shows the
**actual error** rather than the stack trace under it. For familiar failures it adds the fix:
another copy already running, a lock file, `EADDRINUSE`, or a missing module (→ **Install**).
**Log** shows the full output.

## What Rezure does and doesn't do

- Dev servers start **only when you ask**, with **Open** or **Start**. They aren't on the
  [Services](/guide/services) page and **Start all** never starts them, since each can take
  hundreds of MB of memory.
- Each runs on the project's own Node.js version when the project
  [pins one](/guide/nodejs#pin-node-per-project).
- **Every dev server stops when Rezure closes.** One left over from a crash is cleaned up the
  next time that dev server starts.
- A dev server that exits on its own isn't restarted, because a compile error would only crash it
  again. Its log says what happened.
- [Sharing](/guide/sharing) works as for any project: the Cloudflare tunnel goes through Nginx to
  the dev server.
- Dev servers are never included in Rezure's [usage data](/guide/privacy).

## Hot reload, Vite, and Next.js

Nginx passes websockets on, so hot module replacement works through the `.test` domain. Rezure
also handles the two host checks that usually break this kind of setup:

- **Vite** rejects requests for hostnames it doesn't know ("Blocked request. This host is not
  allowed"). Rezure tells Vite to accept the project's domain, so `vite.config` needs no
  `allowedHosts` entry.
- **Next.js 16** rejects its own dev resources (`/_next/*`, including the hot-reload websocket)
  for any origin other than `localhost`, which leaves the page stuck on its loading screen.
  Rezure's virtual host drops the `Origin` header on those paths only when it's the project's
  own domain, so `next.config` needs no `allowedDevOrigins`. Requests from any other site are
  still refused.

Vite listens on `localhost`, which on many Windows machines means IPv6 (`::1`) only. Nginx
tries `127.0.0.1` first and falls back to `[::1]`, so both work.

## Troubleshooting

### "This project's dev server isn't running"

Nothing answers on the project's port. Click **Open**, or **Start** in Dev servers. If you start
the server yourself, make it listen on the port Dev servers shows.

### "Blocked request. This host is not allowed" from Vite

Your Vite version is too old to accept extra hosts from Rezure. Add this to `vite.config`:

```js
export default {
  server: { allowedHosts: ['.test'] }
}
```

### Hot reload doesn't update the page

Open the site through its `.test` domain after the dev server is up, and check the browser
console for a failed websocket. A `server.hmr` setting in `vite.config` that names another host
or port overrides what Nginx forwards.

### "It's listening on :3001 instead of :4400"

The dev server ignored the port it was given. That's typical of a script that wraps it, such as
`concurrently` or a custom `server.js`. Either set **Port** to the one it actually uses and
**Tell it the port with** to **The app's own port**, or make the script pass `--port` on.

### A Next.js page stays on its loading screen

Restart the dev server from Dev servers, then reload through the `.test` domain. Rezure 3.3 and
newer handle Next 16's origin check (see [above](#hot-reload-vite-and-next-js)). If you added
your own `allowedDevOrigins` for a workaround, you can remove it.

### The project shows up as a PHP site instead

Detection didn't see a JavaScript framework. Maybe `package.json` is in a subfolder, or the
framework is a dependency of a dependency. Click the framework badge and pick the right one.

## Related

- [Frameworks](/guide/frameworks) — how projects are detected, and changing it
- [Node.js](/guide/nodejs) — install versions and pin one per project
- [Projects](/guide/projects) — domains, the hosts file, and project actions
- [Ports](/guide/ports) — every port Rezure uses

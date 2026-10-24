---
title: Local .test Domains and Nginx Virtual Hosts
description: How Rezure serves projects — folders in www, linked folders elsewhere, .test domains, stack detection, document roots, the hosts file, and every action on a project's row.
---

# Projects

Every project Rezure serves gets its own Nginx virtual host and a `.test` domain. The
**Projects** page lists them all, shows whether each domain resolves yet, and puts the things
you do with a project — open it, share it, check it, open a terminal — on its row.

## Where projects come from

### Folders in `www`

Each folder in `C:\rezure\www` is a project. A folder named `myapp` becomes `myapp.test`.
Folders whose names start with `.` are skipped.

### Linked folders

A project that lives somewhere else — `D:\work\client-site`, say — can be **linked** in place.
Rezure records the path and nothing else; the folder isn't copied, moved, or written to. Linked
projects carry a **Linked** badge. See [Add an existing folder](#add-an-existing-folder) below.

### New projects

**New project** creates a project in `www` from a template: Laravel, WordPress, blank PHP, or
static HTML. See [New Project](/guide/new-project).

## Domains

- The suffix is always `.test`. It isn't configurable on purpose: browsers force `.dev` onto
  HTTPS, and `.local` belongs to mDNS on many networks.
- A domain may use letters, digits, and hyphens, with dots between parts (`api.myapp.test`).
  A part can't start or end with a hyphen, and is at most 63 characters.
- A folder whose name has an underscore, a space, or other characters can't make a valid
  domain. Its row says "Not served — rename the folder using letters, digits and hyphens
  only." and it gets no virtual host until you rename it.

Sites are served over plain `http://` on port 80. There's no local HTTPS.

## Stack detection and document root

Rezure looks at marker files to label each project, first match wins:

| Marker | Stack |
| --- | --- |
| `artisan` | **Laravel** |
| `wp-config.php` or `wp-load.php` | **WordPress** |
| `package.json` depending on `next`, `nuxt`, `vue`, `react`, or `svelte` | **Next.js**, **Nuxt**, **Vue**, **React**, **Svelte** |
| any other `package.json` | **Node** |
| `composer.json` or `index.php` | **PHP** |
| `index.html` | **Static** |
| none of these | **Unknown** (still served as static files) |
| a linked folder that no longer exists | **Missing** |

The stack decides the **document root**, the folder Nginx serves:

- **Laravel** projects with a `public\` folder are served from `public\`.
- **Everything else** is served from the project folder itself.

A few consequences worth knowing:

- Frameworks that also keep their entry point in `public\` — Symfony, CodeIgniter 4, and
  similar — are detected as **PHP** and served from the project root, so their front page
  won't load as expected. The workaround: keep the project outside `www` and use
  **Add folder** on its `public\` folder itself. Rezure then serves that folder as the site's
  root.
- **Node, Vue, React** and the other JavaScript stacks are served as static files by Nginx.
  Rezure doesn't run or proxy their dev server; run `npm run dev` in a
  [project terminal](/guide/project-terminal) and use the address it prints. A built `dist\`
  folder can be opened by path.

Every virtual host uses the same rules: static files first, everything else through
`index.php` (the front-controller pattern Laravel and WordPress expect), `.ht*` files denied,
request bodies up to 64 MB, and PHP given up to 300 seconds per request.

Rezure regenerates the configs in `C:\rezure\data\nginx\vhosts\` whenever projects change, so
edits made there by hand are lost.

## The hosts file

A `.test` domain only resolves once it has a line in the Windows `hosts` file. On the
Projects page:

- A domain in the **accent colour** resolves ("Resolves in the browser").
- A **muted** domain doesn't yet ("Not in the hosts file yet — it won't resolve until you
  sync").

Click **Sync hosts file** to add every missing domain and drop stale ones. Windows asks for
administrator approval each time the file actually needs to change; the button reads
"Waiting for admin approval…" meanwhile, and greys out with "Every domain already resolves"
when there's nothing to do.

Rezure only touches its own block of the file, between these two lines:

```
# --- Rezure managed entries (do not edit below) ---
127.0.0.1	myapp.test
# --- Rezure managed entries end ---
```

Everything else in the file is left exactly as it was. Any `127.0.0.1 <domain>` line counts
as resolving, including ones you added yourself.

To skip the button, turn on **Auto-write hosts entries** in [Settings](/guide/settings).
Rezure then syncs once each time it starts, with one administrator prompt at startup if
anything changed.

## The project list

- **Search projects or domains** filters by name or domain.
- **List** and **Grid** switch the layout.
- Each project shows its name, folder, domain, stack, and a usage line — "Not opened yet", or
  "Opened 3× · last today". Opening the site, its folder, or its terminal from Rezure counts.
- A linked folder that's gone shows "Folder not found — it may have moved, or be on a drive
  that isn't connected." It stays listed, without a virtual host, so it comes back when the
  drive does.

## Actions on a project

Each row has, in order:

| Action | What it does |
| --- | --- |
| **Open** | Opens `http://<domain>` in your default browser. |
| **Share** | Starts a public Cloudflare link for the project. See [Sharing a Project](/guide/sharing). |
| **Folder** | Opens the project folder in Explorer. |
| **Requirements check** | Checks the project's PHP extensions, HTTPS from PHP, mail, and database settings. See [Requirements Check](/guide/requirements-check). |
| **PHP version** | Pins the project to its own PHP version. See [PHP Per Project](/guide/project-php-version). |
| **Node.js version** | Pins the Node.js version its terminal uses. See [Node.js](/guide/nodejs#pin-node-per-project). |
| **Terminal** | Opens a terminal in the folder with the project's PHP and Node first on `PATH`. See [Project Terminal](/guide/project-terminal). |
| **×** (linked projects only) | Removes the project from Rezure. |

The PHP and Node icons are filled in while a version is pinned, and the Share icon while a
share is live.

There's no rename action. To rename a project in `www`, rename its folder — but note that the
project then counts as a new one, so its usage history and PHP/Node pins don't follow.

## Add an existing folder

1. Click **Add folder** ("Serve a project from a folder outside your www directory").
2. Click **Choose a folder** and pick it.
3. Rezure shows what it found: "Detected as **Laravel** · served from public/", for example.
   With no markers: "No framework markers found here — it'll still be served as static files."
4. Check the **Name** and **Domain**. The domain is suggested from the folder name; if that's
   taken, a number is added (`myapp-2.test`). You can type any valid domain — it doesn't have
   to end in `.test`, though `.test` is the safe choice.
5. Click **Add project**, then **Sync hosts file**.

Rezure refuses some folders and says why before saving anything:

- a drive root ("serving a whole drive isn't safe")
- `C:\Windows`, `C:\Program Files`, or `C:\Program Files (x86)`
- a folder inside `www` ("it's already inside your www folder, so it's listed automatically")
- a folder that's already linked, or a domain another project uses

Linked projects are kept in `C:\rezure\etc\links.json`. Their name and domain can't be edited
after linking; remove the project and add it again to change them.

### Remove a linked project

Click **×** on its row ("Remove from Rezure (the folder is left alone)") and confirm. Rezure
stops serving it and drops its virtual host. The folder and everything in it stays exactly
where it is, and you can add it again any time — re-adding the same path with the same name
brings back its history and pins.

Projects in `www` have no remove action: move the folder out of `www` instead.

## Troubleshooting

### The domain doesn't open

Check, in order: the domain is in the accent colour (if not, **Sync hosts file**); Nginx is
running; the project's PHP service is running. A **502 Bad Gateway** means Nginx is fine but
PHP isn't. Then try a private browser window, in case an old failure is cached.

### The hosts prompt keeps coming back

Another tool — Laragon and XAMPP both do this — is rewriting the `hosts` file and removing
Rezure's entries. Stop the other tool, or turn off its own hosts management.

### "hosts file update was cancelled"

The administrator prompt was declined. Click **Sync hosts file** again and choose **Yes**.

### The project shows "Not served"

Its folder name can't be a domain. Rename the folder to letters, digits, and hyphens.

## Related

- [New Project](/guide/new-project) — start from a template
- [Requirements Check](/guide/requirements-check) — find what a project is missing
- [Project Terminal](/guide/project-terminal) — run `artisan`, `composer`, and `npm`

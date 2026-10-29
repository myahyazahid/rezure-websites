---
title: 'Rezure FAQ: Local Dev Environment for Windows'
titleTemplate: false
description: 'Answers about Rezure: supported PHP versions, frameworks, and databases, Node.js dev servers, ports, admin rights, privacy, and why it''s Windows only.'
---

# Frequently asked questions

## About Rezure

### What is Rezure?

Rezure is a local development environment manager for Windows. It bundles a web server
(Nginx), PHP, and databases (MariaDB or MySQL, PostgreSQL, SQL Server LocalDB) and puts them
behind start/stop buttons instead of config files and service consoles. The longer answer is on
[What is Rezure?](/guide/).

### Is Rezure free?

Yes. Rezure is free and open source, and the source lives on
[GitHub](https://github.com/myahyazahid/rezure). If you'd like to support it, the **Donate** page
in the app lists the ways to do so; nothing is paid for inside the app.

### What makes Rezure different?

A few things Rezure does deliberately:

- **Runtime versions are discovered, not hard-coded.** Installed versions are found by scanning
  Rezure's download folder and a drop-in folder, and the installable lists come live from
  php.net, MariaDB, and nodejs.org, checksums included.
- **Every download is verified** against a published checksum before it's used.
- **Port conflicts are reported before a service fails.** Rezure checks the port first, names
  the program holding it, and can stop it for you.
- **Only what you ask for gets downloaded.** Nginx and PHP 8.3 ship inside the installer;
  databases, Mailpit, Node.js, and extra PHP versions are pulled on demand.
- **A small footprint.** A native webview instead of a bundled browser engine keeps both the
  binary and the memory use modest.

### Does Rezure work on macOS or Linux?

No. Rezure targets Windows 10 (build 1809 or newer) and Windows 11, 64-bit only. There are
no macOS or Linux builds.

### Does Rezure use Docker?

No. Rezure runs native binaries directly on your machine; there is no Docker mode.

### Is the app available in other languages?

Not yet. Rezure's interface is in English.

## Installing and running

### Can I run Rezure alongside another local server stack?

Not at the same time, if the two want the same ports. Nginx and MariaDB listen on port 80
and port 3306, and nothing else can share those while Rezure's services are running. You
don't need to uninstall anything: just stop the other stack before starting Rezure's. If
you forget, Rezure names the program holding the port and offers to stop it. See
[Port Conflicts](/guide/port-conflicts).

Rezure's PHP deliberately avoids port 9000, so it doesn't collide with the PHP that Laragon
and XAMPP run there.

### Why does Rezure need administrator rights?

For two things only: editing the Windows `hosts` file so a project's `.test` domain resolves
(when you click **Sync hosts file**), and installing Microsoft's ODBC Driver or SQL Server
LocalDB if you choose to. Declining the `hosts` prompt leaves the rest of the app working;
the domain just won't resolve until the entry is added.

### Should I run Rezure as administrator?

No. Nothing in Rezure needs it, and PostgreSQL refuses to start under an elevated Rezure. Open
it normally; Windows asks for approval on its own when the `hosts` file needs to change.

### Windows SmartScreen warns about an unrecognized publisher. Is that a problem?

That warning is about code signing, not a virus report. Verify the installer's SHA-256 hash
against the one on the [release page](https://github.com/myahyazahid/rezure/releases) (the
[verification steps](/download#verify-your-download) take about ten seconds), and if it
matches, choose **More info → Run anyway**.

### Do services start when Rezure opens?

No. Nothing starts until you start it: not when Rezure opens, and not with **Start Rezure with
Windows** on either. **Start all** on the Services page brings everything up at once. See
[Services](/guide/services).

### Does closing the window stop my services?

By default, yes: closing the window quits Rezure and stops everything. Turn on **Keep running in
tray on close** in [Settings](/guide/settings) to keep them running in the background.

### How do I update Rezure?

From inside the app. A dot appears on **Changelog** when an update is out; open it and click
**Update**. Updates are signed and verified. See [Updates & Changelog](/guide/updates).

### How do I uninstall Rezure completely?

Run the uninstaller, then remove `C:\rezure` and the few things Rezure set up outside it. See
[Uninstall](/guide/uninstall).

## Projects

### Where do my projects live?

Anything in `C:\rezure\www` is served automatically: a folder named `myapp` becomes
`myapp.test`. Projects stored elsewhere can be linked in place from the **Projects** page,
with nothing copied or moved. Settings, databases, and downloaded runtimes live under
`C:\rezure` too, outside the install folder, so reinstalling or rolling back leaves your work
alone. See [Files & Folders](/guide/files-and-folders).

### Can I move `C:\rezure` to another drive?

Rezure uses whatever folder the `REZURE_HOME` environment variable names, so you can point it at
another drive before you start using it. Moving an existing setup isn't automatic: database
profiles and linked projects record full paths. The simplest route is to export your
databases, set `REZURE_HOME`, start fresh, and import them again. See
[Files & Folders](/guide/files-and-folders).

### Can I use a domain other than `.test`?

Not as the automatic suffix: it's always `.test`, because browsers force `.dev` onto HTTPS and
`.local` belongs to mDNS. A [linked project](/guide/projects#add-an-existing-folder) can be given
any valid domain when you add it.

### Does Rezure support HTTPS on local sites?

Not yet. Sites are served over plain `http://` on `.test` domains.

### Does Rezure support Apache?

No. Rezure's web server is Nginx. Laravel, WordPress, and most PHP apps run on it without
changes; `.htaccess` files are ignored (and denied to visitors).

### Which frameworks does Rezure support?

Laravel, CodeIgniter 3 and 4, WordPress, Bedrock, Drupal, Joomla, Symfony, Yii 2, CakePHP,
Slim, and Laminas on the PHP side, and Next.js, Nuxt, Astro, Vue, React, Svelte, Angular, and
plain Node on the JavaScript side. Rezure detects the framework from the project's files and
serves it from the right folder, such as `public/` for Laravel, CodeIgniter 4, and Symfony. If
detection gets a project wrong, click its framework badge to change it. A framework Rezure
doesn't know can be added in `C:\rezure\etc\frameworks.json`. See
[Frameworks](/guide/frameworks).

### Why does my CodeIgniter 4 or Symfony site show 404?

On Rezure 3.3 and newer it shouldn't: both are detected and served from `public/`. If a project
still answers 404, it's probably served from the wrong folder. Hover its framework badge to see
where it's served from, then click the badge to pick the right framework. If you once linked the
project's `public/` folder directly as a workaround, remove that link and add the project folder
instead. See [Frameworks](/guide/frameworks#troubleshooting).

### Can I open a Vite, Next.js, or Nuxt app on a `.test` domain?

Yes, since Rezure 3.3. JavaScript and Node projects are served by their own dev server: click
**Open** and Rezure starts `npm run dev` on a port of its own, waits until it answers, and opens
`http://myapp.test`. Nginx passes the domain to that port, with hot reload working. Rezure also
takes care of Vite's allowed-hosts check and Next.js 16's dev-origin check. Every dev server
stops when Rezure closes. See [Dev Servers](/guide/dev-servers).

### Can visitors download my project's `.env` file?

No. PHP sites answer **404** for every dotfile (`.env`, `.git`, `.htaccess`, and so on) except
`.well-known`. This closes a gap in versions before 3.3, where a project served from its own
folder, such as WordPress or plain PHP, could expose its `.env`. JavaScript projects never serve
their folder directly: requests go to the dev server. See
[Frameworks](/guide/frameworks#how-nginx-serves-each-kind).

### Can I serve a site to the internet with Rezure?

For a **temporary preview**, yes: use **Share** on the **Projects** page. Rezure opens a
Cloudflare Quick Tunnel and gives you an `https://…trycloudflare.com` link anyone can open
while sharing is on. No Cloudflare account or router setup is required. See
[Sharing a Project](/guide/sharing) for the full walkthrough.

That is **not** production hosting. The URL changes each time you share, the tunnel stops
when you stop sharing or quit Rezure, and the feature is meant for demos and quick checks,
not a permanent public site. For that, deploy to a real host.

### Does Rezure work with Claude Code and other AI coding agents?

Yes. Rezure keeps an `AGENTS.md` in `C:\rezure` that describes your PHP, databases, and projects,
and Claude Code picks it up automatically in projects under `www`. See
[AI Coding Agents](/guide/ai-agents).

## PHP and runtimes

### Which PHP versions can I use?

PHP 8.3 ships inside the installer. From the **Switch** page you can install whatever php.net
currently publishes for Windows (the newest release of each branch, non-thread-safe x64
builds) or drop a build you already downloaded into `C:\rezure\custom\php` and Rezure picks
it up on the next scan. Switching the global default restarts the main **PHP** service only;
Nginx keeps running. See [PHP Versions](/guide/php-versions).

### Can different projects use different PHP versions at the same time?

Yes. On the **Projects** page, pin each project to **Default** or to a specific installed
version. Pinned versions other than the global default get their own **PHP x.y.z** service on
the **Services** page. Those aren't started automatically: start each PHP service your
projects need, or use **Start all**. See [PHP Per Project](/guide/project-php-version).

### How do I change a `php.ini` setting?

Put it in a `.ini` file in `C:\rezure\etc\php\conf.d`: Rezure rewrites its own `php.ini` on
every start, so edits there don't stick. Extensions are toggles on the
[PHP Extensions](/guide/php-extensions) page. See [PHP Configuration](/guide/php-configuration).

### Is Xdebug supported?

Not yet. It's on the roadmap.

### Does Rezure include Composer?

Yes: install versions from the Switch page. Rezure uses Composer itself for new Laravel
projects, but doesn't put a `composer` command on `PATH`. See
[Project Terminal](/guide/project-terminal#running-composer).

### Does Rezure support Node.js?

Yes. Install versions from the Switch page and pin one per project; the pin applies to the
project's terminal and to its dev server. Vite, Next.js, Nuxt, Astro, Angular, and Node apps
open at their `.test` domain through a dev server Rezure starts for you. See
[Node.js](/guide/nodejs) and [Dev Servers](/guide/dev-servers).

### What about Python, Ruby, or Go?

Not available. Python is listed on the Switch page as "not available yet".

## Databases

### Is MariaDB included in the installer?

No, and that's on purpose. MariaDB downloads the first time you start it: a one-time wait
of a minute or two, and only if you actually need a database.

### Can I keep using my Laragon or XAMPP databases?

Yes. **Add data directory** on the Databases page finds Laragon's and XAMPP's MySQL data at
their default locations and serves it with that tool's own server binary; nothing is copied or
converted. Only one of the two tools can run it at a time. See
[MariaDB & MySQL](/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory), and
[Coming from Laragon or XAMPP](/guide/switch-from-laragon-xampp) for moving your projects too.

### Does Rezure support PostgreSQL?

Yes: versions 16, 17, and 18, installed from inside the app and running beside MariaDB. See
[PostgreSQL](/guide/postgresql).

### Does Rezure support SQL Server?

Yes. Rezure installs Microsoft's `pdo_sqlsrv` and `sqlsrv` PHP drivers, the ODBC Driver, and SQL
Server 2022 Express LocalDB, and connects to other SQL Server instances. See
[SQL Server](/guide/sql-server).

### Does Rezure include Redis?

The `redis` PHP extension, yes: install it from PHP Extensions. A Redis server isn't part of
Rezure yet.

### Can Rezure connect to a remote database?

Yes. From the **Databases** page you can add a saved connection to a MySQL, MariaDB,
PostgreSQL, or SQL Server server (staging, a VPS, shared hosting, an office server) and
switch the page to that target to list, export, and import databases. Connections are
**read-only by default** so you don't accidentally write to production.

If the database isn't reachable directly (it only listens on `127.0.0.1` on the server, or
the port is firewalled), enable **Connect through an SSH tunnel** when adding the
connection. Rezure uses Windows' built-in OpenSSH client; no extra SSH software is required.
See [Remote Databases](/guide/remote-databases) for field-by-field setup and examples.

### Can I open a remote database over SSH in TablePlus, DBeaver, or HeidiSQL?

Yes. **Open** on a remote connection hands the client the tunnel's local address, so the client
never deals with SSH. When the connection has a saved password, TablePlus, DBeaver, HeidiSQL,
and the MariaDB console get it too and connect straight away. MySQL Workbench asks for the
password in its own dialog. See
[Remote Databases](/guide/remote-databases#open-in-an-external-client).

### Where are database passwords stored?

In Windows Credential Manager, under **Rezure Database Connections**, or only in memory for the
session, if you choose. Never in Rezure's own files.

## Privacy

### Does Rezure collect data?

Yes, a small amount of usage data: a random install ID, which services start and stop and with
which versions, the kind (not the text) of errors, and periodic heartbeats that include your
Windows version and account name. It never sends paths, project or database names, or anything
you type. The full list, and how to turn it off, is on
[Privacy & Usage Data](/guide/privacy).

### Does Rezure send my code or my databases anywhere?

No. Your projects and data stay on your machine. The only things that leave it are the usage
data above, Feedback tickets you choose to send, and what you deliberately
[share](/guide/sharing) or [connect](/guide/remote-databases) to.

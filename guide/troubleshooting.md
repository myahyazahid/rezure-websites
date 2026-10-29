---
title: Troubleshooting 502 Bad Gateway, .test Domains, and More
description: Fixes for common Rezure problems on Windows — ports in use, .test domains that don't resolve, 502 Bad Gateway, 404 on CodeIgniter 4 or Symfony, Vite dev servers, cURL error 60, could not find driver, and more.
---

# Troubleshooting

Find the symptom, try the fix. Most entries link to the page with the details. When Rezure shows
an error message, it's usually specific — read it first.

## Installing and starting

### SmartScreen says "Windows protected your PC"

That's about code signing, not a virus report. Verify the installer's
[SHA-256 hash](/download#verify-your-download), then choose **More info → Run anyway**.

### Nginx or PHP shows "Not installed" right after installing

The bundled binaries didn't unpack. Reinstall over the top.

### Setup says WebView2 is missing

Install it from [Microsoft's WebView2 page](https://developer.microsoft.com/microsoft-edge/webview2/),
then run the installer again.

## Services

### "port 80 is already in use" / "port 80 is held by …"

Another program has the port — Laragon, XAMPP, IIS, Docker. Click **Stop it and start**, or see
[Port Conflicts](/guide/port-conflicts) for ports Windows reserves.

### A service stays "Stopped" after Start all

**Start all** doesn't show individual errors. Click that row's own **Start** to see why.

### "… isn't installed yet — download it from the Binaries panel first"

An older wording. Install the service from its row on the Services page, or from **Install
version** on the Switch page.

### PostgreSQL "refuses to run with administrator rights"

Rezure was started with **Run as administrator**. Close it and open it normally.

### A database is stuck on "Starting…" or "stopped responding"

Open its log from its row. A database recovering after a crash or a forced stop can take a while
and prints progress as it goes. See [Services](/guide/services#how-long-a-database-may-take-to-start).

### PHP keeps crashing and "automatic restart paused"

Check the [Logs](/guide/logs) page filtered to `php` for the reason. If you recently added a
file to `C:\rezure\etc\php\conf.d`, an invalid setting there is worth ruling out — move the file
out, then start PHP again.

## Sites

### `myapp.test` doesn't open at all

1. On the Projects page, is the domain in the accent colour? If not, click **Sync hosts file**
   and approve the administrator prompt.
2. Is Nginx running?
3. Try a private browser window, in case an old failure is cached.

### The hosts prompt keeps coming back

Another tool — usually Laragon or XAMPP — rewrites the `hosts` file and removes Rezure's lines.
Stop the other tool or turn off its hosts management.

### 502 Bad Gateway

Nginx is running but the PHP service the project uses isn't. Start **PHP** — or, for a
[pinned](/guide/project-php-version) project, its **PHP x.y.z** row.

### The project says "Not served"

Its folder name has an underscore, a space, or another character that can't be in a domain.
Rename it to letters, digits, and hyphens. See [Projects](/guide/projects#domains).

### A Symfony or CodeIgniter 4 site answers 404

Since Rezure 3.3 both are detected and served from `public\`. If a site still answers 404, it's
served from the wrong folder: hover the project's framework badge to check, then click it and
pick the right framework, or **Custom folder…**. An old link to the project's `public\` folder
should be removed and the project folder added instead. See
[Frameworks](/guide/frameworks#troubleshooting).

### "This project's dev server isn't running"

A Vite, Next.js, Nuxt, Astro, or Node project is served by its own dev server, and nothing
answers on its port. Click **Open**, or **Start** in **Dev servers** on the Projects page. See
[Dev Servers](/guide/dev-servers).

### A dev server won't start

The **Dev servers** dialog names the reason and the fix: dependencies not installed
(**npm install**), a Node.js version that isn't installed, a missing script, or a copy already
running in a terminal (**Stop it and start here**). See
[Dev Servers](/guide/dev-servers#when-a-dev-server-can-t-start-yet).

### Vite says "Blocked request. This host is not allowed"

Your Vite version is too old to accept the domain Rezure passes it. Add
`server: { allowedHosts: ['.test'] }` to `vite.config`. See
[Dev Servers](/guide/dev-servers#blocked-request-this-host-is-not-allowed-from-vite).

### A blank page or a 500 error from Laravel

The reason is in `storage\logs\laravel.log` inside the project. A missing PHP extension is the
most common cause — run the [Requirements Check](/guide/requirements-check).

### "cURL error 60: SSL certificate problem"

PHP has no CA bundle. On the Switch page, click **Download** on the **CA certificates** card,
then restart PHP. See [PHP Configuration](/guide/php-configuration#ca-certificates).

### "413 Request Entity Too Large" on upload

Nginx accepts request bodies up to 64 MB. Larger uploads are rejected before PHP sees them,
whatever `upload_max_filesize` says.

### A long request stops after five minutes

PHP's `max_execution_time` and Nginx's FastCGI timeout are both 300 seconds. For longer jobs, run
them from a [project terminal](/guide/project-terminal) or a queue worker instead.

### A setting in `php.ini` doesn't take effect

Rezure rewrites its own `php.ini` on every start. Put your settings in
`C:\rezure\etc\php\conf.d` and restart PHP. See
[PHP Configuration](/guide/php-configuration#your-php-settings).

## PHP and the terminal

### "could not find driver"

The PDO extension for your database is off or missing for the PHP version the project uses:
`pdo_pgsql` for PostgreSQL (off by default), `pdo_sqlsrv` for SQL Server (install it). Turn it on
on [PHP Extensions](/guide/php-extensions), then restart PHP.

### `php -v` in a terminal shows the wrong version

Run `where php`. A terminal opened from the project's row uses that project's version. Elsewhere,
`php` is whatever comes first on `PATH` — turn on
[Use Rezure's PHP everywhere](/guide/php-configuration#use-rezure-s-php-everywhere), and remove
any other PHP from the **system** `PATH`, which Windows reads first.

### An extension works on the site but not in the terminal

The site and the terminal read different `php.ini` files. See
[PHP Extensions](/guide/php-extensions#browser-vs-terminal).

### `composer` is not recognized

Rezure doesn't put Composer on `PATH`. See
[Project Terminal](/guide/project-terminal#running-composer).

## Databases

### "MariaDB isn't running, so there's nothing to list yet"

Start the database from the Services page, then click the refresh icon on the Databases page.
The same message appears when a MySQL profile is active.

### Access denied on an adopted Laragon or XAMPP data directory

Rezure lists the local server as `root` with an empty password. See
[MariaDB & MySQL](/guide/mariadb-mysql#troubleshooting).

### "Unknown collation utf8mb4_0900_ai_ci" on import

A MySQL 8 dump going into MariaDB. Replace it with `utf8mb4_unicode_ci` in the file.

### My PostgreSQL databases disappeared after switching versions

Each major version has its own data folder. Switch back to see them; export and import to move
them. See [PostgreSQL](/guide/postgresql#switch-versions).

### A remote connection fails

See the troubleshooting section of [Remote Databases](/guide/remote-databases#troubleshooting).

### "Access denied (using password: NO)" when opening a remote database in a client

Save the connection's password in Rezure: since 3.3, **Open** hands a saved password to
TablePlus, DBeaver, HeidiSQL, and the MariaDB console, SSH tunnels included. MySQL Workbench
asks for it itself. See
[Remote Databases](/guide/remote-databases#passwords-and-open-with).

## Mail

### Emails never reach the Mailpit inbox

Check, in order: Mailpit is running; `.env` has `MAIL_HOST=127.0.0.1` (not `mailpit`) and
`MAIL_PORT=1025` (not 2525); you've run `php artisan config:clear` if your config is cached;
queued mail needs a running `php artisan queue:work`. See [Mailpit](/guide/mailpit).

## Sharing

### The share link doesn't load, or the modal hangs

See [Sharing a Project](/guide/sharing#troubleshooting).

## Updates

### I know there's a new version, but Changelog shows no update

A failed update check looks the same as "no update". Make sure you're online and open Changelog
again. You can always install the latest version from the [download page](/download) over your
current one.

## Still stuck?

Send a report from the **Feedback** page in the app. Tick **Attach latest log** so the
maintainers can see what happened — the log can include folder paths, so read it first. Or open
an issue on [GitHub](https://github.com/myahyazahid/rezure/issues).

## Related

- [FAQ](/guide/faq) — common questions
- [Logs](/guide/logs) — where to look first

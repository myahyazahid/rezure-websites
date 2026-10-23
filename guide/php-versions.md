---
title: PHP Versions and the Switch Page
description: Install PHP versions from php.net inside Rezure, add your own builds, switch the global default, and manage Composer and the other runtimes on the Switch page.
---

# PHP Versions and the Switch Page

The **Switch** page ("Pick the runtime version each new shell and vhost should use.") lists
every runtime Rezure manages, the version that's active, and how many are installed. Its
**Install version** button adds more. This page covers PHP and Composer in detail; the other
runtimes have their own pages.

## The runtime rows

| Row | Switchable? | What picking a version does |
| --- | --- | --- |
| **PHP** | Yes | Sets the global PHP and restarts the running **PHP** service onto it |
| **Node.js** | Yes | Sets the Node used by project terminals — see [Node.js](/guide/nodejs) |
| **Composer** | Yes | Sets the Composer Rezure itself runs, for [New Project](/guide/new-project) |
| **PostgreSQL** | Yes | Restarts the server on that version's own data — see [PostgreSQL](/guide/postgresql#switch-versions) |
| **MariaDB** | No | Shows the newest installed build. Which build actually runs is decided by the active [data directory profile](/guide/mariadb-mysql) |
| **Nginx**, **Mailpit**, **SQL Server LocalDB** | No | One pinned version each; the row shows whether it's installed |
| **Python** | — | Greyed out, "not available yet" |

Each row shows "active X" (or "not installed"), an "N installed" count, and a dropdown of the
installed versions with the newest marked **latest**. The dropdown lists installed versions
only — new ones come from **Install version**.

## Install a PHP version

1. On the **Switch** page, click **Install version** and pick **PHP**.
2. Rezure reads php.net's Windows release list and shows the **newest release of each
   branch** — 8.5, 8.4, 8.3, and so on — with its release date and size. The newest is marked
   **LATEST**.
3. Click **Install** next to the one you want. Rezure downloads it, checks it against the
   SHA-256 php.net publishes, and unpacks it into `C:\rezure\bin\php\<version>`.

The new version shows up in the PHP dropdown straight away. The dialog can't be closed while a
download is running.

Rezure installs **non-thread-safe x64** builds, the kind that runs under a FastCGI web server
like Nginx. Thread-safe builds are meant for Apache's module mode and aren't offered.

### An older patch release, or a build you already have

php.net's list only carries the newest patch of each branch. For anything else — PHP 8.2.20
exactly, an old 7.4, a build you were sent — download the zip from
[windows.php.net](https://windows.php.net/downloads/releases/archives/) (pick the **NTS x64**
one), unzip it, and either:

- use **Add from folder…** in the same dialog ("Already downloaded one?"). Rezure reads the
  real version from its `php.exe` and copies it into the drop-in folder; or
- copy the folder into `C:\rezure\custom\php` yourself. **Open folder** in the dialog, or the
  **Drop-in folder** card on the Switch page, opens it.

Rezure picks it up on the next scan. Builds you add this way aren't checksum-verified, and the
Switch page says so: "N PHP versions were added by hand — Rezure didn't checksum those."

The folder needs a `php.exe` at its top level or one folder below. Errors you might see: "no
php.exe in X (or one folder below it)", or "PHP X is already installed".

## Switch the global PHP version

Pick a version in the **PHP** row's dropdown. Rezure:

1. saves it as the global default,
2. re-points the `PATH` link if
   [Use Rezure's PHP everywhere](/guide/php-configuration#use-rezure-s-php-everywhere) is on,
3. restarts the main **PHP** service onto the new version if it was running.

You'll see "Switching PHP…", then one of:

- "PHP X is active — the service was reloaded."
- "PHP X is active — it'll be used the next time PHP starts." (PHP wasn't running.)
- "Switched to PHP X, but the service didn't restart: …" — the reason follows; check
  [Logs](/guide/logs).

Nginx keeps running throughout. Projects [pinned](/guide/project-php-version) to their own
version aren't affected.

## Remove a PHP version

There's no uninstall button. Quit Rezure and delete the version's folder —
`C:\rezure\bin\php\<version>` for one Rezure installed, or its folder under
`C:\rezure\custom\php` for one you added. That's a complete removal; projects pinned to it fall
back to the global version.

Don't delete the version that's currently active. Switch to another one first.

## What Rezure sets up for every PHP version

- Its own generated `php.ini`, rewritten on every start, so versions never share each other's
  extension settings. Your own settings go in `C:\rezure\etc\php\conf.d`, which is loaded after
  it — see [PHP Configuration](/guide/php-configuration).
- Sensible local defaults: `memory_limit` 256M, uploads and POST bodies up to 64M (matching
  Nginx's limit), `max_execution_time` 300, `date.timezone` UTC.
- The CA bundle, when one is installed, so HTTPS calls from PHP work.
- Its own set of [extension toggles](/guide/php-extensions).

## Composer

Rezure manages Composer the same way: **Install version → Composer** lists stable 2.x releases
from getcomposer.org, each checked against its published checksum, and installs them into
`C:\rezure\bin\composer\<version>\composer.phar`.

The **Composer** row on the Switch page picks which one Rezure runs itself — for
[New Project](/guide/new-project)'s Laravel template. Two things to know:

- **The choice isn't remembered.** After a restart, Rezure goes back to the newest installed
  Composer.
- **There's no `composer` command on `PATH`.** See
  [Project Terminal](/guide/project-terminal#running-composer) for how to run Composer yourself.

If you never install one, Rezure downloads the newest stable Composer the first time it needs
it.

## The other runtimes

**Install version** also covers Nginx, MariaDB, PostgreSQL, Mailpit, SQL Server LocalDB,
Composer, and Node.js. Each says where its list comes from — "Reading MariaDB's release
index…", for example — and if the source can't be reached you get "Couldn't reach … Retry".
Nginx and Mailpit offer one pinned build each ("Only one build is offered for now — there's
nothing to pick between yet.").

- [Node.js](/guide/nodejs)
- [MariaDB & MySQL](/guide/mariadb-mysql#install-more-mariadb-versions)
- [PostgreSQL](/guide/postgresql)
- [SQL Server LocalDB](/guide/sql-server#install-localdb)
- [Mailpit](/guide/mailpit)

Python isn't available yet: it publishes no checksum Rezure can verify a download against.

## Related

- [PHP Per Project](/guide/project-php-version) — different versions for different projects
- [PHP Extensions](/guide/php-extensions) — turn extensions on per version
- [PHP Configuration](/guide/php-configuration) — your own `php.ini` settings, CA bundle, and
  `PATH`

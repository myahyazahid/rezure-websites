---
title: PHP Extensions
description: Turn PHP extensions on and off per version in Rezure without editing php.ini, and install Redis and the SQL Server drivers that PHP doesn't ship.
---

# PHP Extensions

The **PHP Extensions** page turns on extensions the PHP zip already ships in its `ext\` folder,
and installs the few it doesn't — Redis and the SQL Server drivers. No hand-edited `.ini`
fragment needed.

## Pick a version

Extensions are set **per PHP version**. When more than one version is installed, a
**PHP {version}** picker at the top chooses which one you're editing; it starts on the global
active version. A project [pinned](/guide/project-php-version) to PHP 8.1 uses PHP 8.1's
settings, so edit that version for that project.

With no PHP installed the page says "No PHP version installed yet — install one from Switch
first."

## Turn an extension on or off

Extensions are grouped by category — Database, Debug, Filesystem, Format, Image, Math, Network,
Performance, Security, System — and **Filter extensions** searches them. Each row has a label,
the extension's name, a short description, and a switch.

A switch **saves your choice** for that version. It takes effect the next time that PHP version
starts. If it's running, the page tells you so: restart that PHP service on the **Services**
page for the change to reach your sites.

### What's on by default

| On by default | Off by default |
| --- | --- |
| `curl`, `fileinfo`, `gd`, `intl`, `mbstring`, `mysqli`, `openssl`, `pdo_mysql`, `pdo_sqlite`, `sqlite3`, `zip` | `bcmath`, `bz2`, `calendar`, `com_dotnet`, `dba`, `exif`, `ffi`, `ftp`, `gettext`, `gmp`, `imap`, `ldap`, `odbc`, `opcache`, `pdo_odbc`, `pdo_pgsql`, `pgsql`, `shmop`, `snmp`, `soap`, `sockets`, `sodium`, `tidy`, `xmlrpc`, `xsl` |

`redis`, `pdo_sqlsrv`, and `sqlsrv` switch on as soon as you install them.

Some you'll likely want to turn on:

- **`pdo_pgsql`** for a project on [PostgreSQL](/guide/postgresql). Laravel otherwise fails with
  "could not find driver".
- **`bcmath`**, **`sodium`**, **`exif`** — common Composer requirements. The
  [Requirements Check](/guide/requirements-check) tells you which ones a project asks for.
- **`opcache`** is off on purpose: a stale cache can hide the code change you just made. Turn
  it on if you're measuring performance, not while you edit.

### Badges

- **special** — environment-dependent or debug-only extensions (`oci8`, `pdo_oci`,
  `zend_test`, `phpdbg_webhelper`), not something an ordinary project needs.
- **not in this build** — the extension's DLL isn't in this version's `ext\` folder and there's
  no download for it.
- **not available for PHP X yet** — a download exists for other PHP versions, but not this one.

## Install Redis or the SQL Server drivers

PHP's Windows zip doesn't include these, so Rezure downloads checksum-verified builds
(non-thread-safe x64, for PHP 7.4 through 8.5). The row's button reads **Install {version}**.

| Extension | Version |
| --- | --- |
| `redis` | 6.3.0 |
| `pdo_sqlsrv`, `sqlsrv` | 5.13.3 for PHP 8.3–8.5, 5.12.0 for 8.1–8.2, 5.10.0 for 7.4–8.0 |

Once installed, the extension is switched on. Restart PHP so running sites pick it up.

The SQL Server extensions also need **Microsoft's ODBC Driver for SQL Server**. When one of
them is on and the driver is missing, the page says so ("PHP loads them without it, but every
connection fails until it's installed") with an **Install ODBC Driver** button. See
[SQL Server](/guide/sql-server#php-drivers).

Rezure installs the `redis` extension, not a Redis server. A Redis server isn't part of Rezure
yet.

## Browser vs terminal

Rezure keeps two `php.ini` files per version, because PHP gets started two ways:

- **For your sites** (and everything Rezure runs itself, like Composer during
  [New Project](/guide/new-project)): a generated `php.ini` that's rebuilt on every start from
  your switches on this page.
- **For a terminal**: the `php.ini` inside the version's own folder, such as
  `C:\rezure\bin\php\8.4.x\php.ini`. Rezure writes it once, with the extensions that were on at
  the time, and then leaves it to you.

So **switches on this page don't change what `php` in a terminal loads** — with one exception:
extensions you *install* here (Redis, SQL Server) are added to the terminal `php.ini` too.

If an extension works in the browser but `php -m` in a terminal doesn't list it, open that
version's own `php.ini` and add the line yourself:

```ini
extension=bcmath
```

That file is yours: Rezure only ever repairs its `extension_dir` and CA-bundle lines.

For settings other than extensions (`memory_limit`, `upload_max_filesize`, …) use
`C:\rezure\etc\php\conf.d` instead; it applies to both. See
[PHP Configuration](/guide/php-configuration#your-php-settings).

## Xdebug

Xdebug isn't offered on this page yet. It's on the roadmap.

## Related

- [Requirements Check](/guide/requirements-check) — which extensions a project needs
- [PHP Configuration](/guide/php-configuration) — your own `php.ini` settings
- [PHP Versions](/guide/php-versions) — install more versions

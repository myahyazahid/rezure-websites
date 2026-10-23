---
title: Requirements Check
description: Rezure's per-project Requirements Check finds missing PHP extensions, broken HTTPS from PHP, and mail, PostgreSQL, or SQL Server settings that won't connect — with a fix button where one exists.
---

# Requirements Check

A Laravel app missing one PHP extension usually fails as a blank **500** with the real reason
buried in `laravel.log`. The **Requirements check** on each project's row looks for that kind of
gap before you hit it, and offers a one-click fix where Rezure can make one.

Click the project's **Requirements check** icon ("Check this project's PHP extension
requirements"). The dialog shows "Asking PHP…" while it runs, then a section per check. Checks
that don't apply to the project are left out.

## PHP extensions

Rezure reads the `ext-*` entries in the project's `composer.json` — both `require` and
`require-dev` — and compares them with what PHP actually loads, using the same settings the web
server uses.

| Result | Meaning |
| --- | --- |
| "PHP X has everything this project asks for." | Nothing missing. |
| "PHP X is missing **a, b**." | Those extensions are required but not loaded. |
| "This project doesn't require any PHP extension explicitly." | `composer.json` has no `ext-*` entries. |
| "No composer.json here, so there's nothing to check." | Not a Composer project. |

Each extension gets a ✓ or a **!**; requirements from `require-dev` are tagged **dev only**
and don't count as missing.

**Fixing it:**

- For most extensions the fix is a toggle: open [PHP Extensions](/guide/php-extensions), pick
  the same PHP version, turn the extension on, and restart PHP.
- For the three extensions PHP doesn't ship — **redis**, **pdo_sqlsrv**, and **sqlsrv** — the
  dialog has an **Install** button that downloads a checksum-verified build. Restart the PHP
  service afterwards so running sites pick it up.

## HTTPS from PHP

This check always runs. PHP makes a test request to `https://repo.packagist.org` and reports
whether certificate verification works.

- "HTTPS calls from PHP verify certificates." — all good.
- A message about **cURL error 60** — PHP has no CA bundle to check certificates against, so
  every outgoing HTTPS call (Composer, payment APIs, OAuth) fails. Click **Download CA bundle**
  (or **Update CA bundle**), then restart PHP. See
  [PHP Configuration](/guide/php-configuration#ca-certificates).
- "Couldn't reach the internet to test HTTPS…" — the test couldn't connect at all; check your
  connection and run it again.

## Mail

Shown when the project's `.env` sends mail over SMTP to a local host or to `mailpit`.

- `MAIL_HOST=mailpit` is Laravel Sail's Docker hostname and doesn't exist outside Docker. Set
  `MAIL_HOST=127.0.0.1`.
- A port other than 1025 — Laravel's default `.env` uses 2525 — gets a suggestion to set
  `MAIL_PORT=1025`.
- Mailpit not installed or not running gets **Install and start Mailpit** or **Start
  Mailpit**.
- When everything lines up: "Mail this project sends is caught by Mailpit." with **Open
  inbox**.

See [Mailpit](/guide/mailpit).

## PostgreSQL

Shown when `.env` has `DB_CONNECTION=pgsql`.

- `pdo_pgsql` is off → **Turn on pdo_pgsql**. It ships with PHP but is off by default, and
  without it Laravel fails with "could not find driver".
- PostgreSQL not installed or not running → **Install PostgreSQL** or **Start PostgreSQL**.
- `DB_PORT` isn't 5432 → set `DB_PORT=5432`.
- The username isn't a role on the server → set `DB_USERNAME=root` (or `postgres`); any
  password works.
- When ready: "PostgreSQL is ready — this project uses Rezure's server as root."

See [PostgreSQL](/guide/postgresql).

## SQL Server

Shown when `.env` has `DB_CONNECTION=sqlsrv`.

- `pdo_sqlsrv` not loaded → **Install pdo_sqlsrv**.
- No ODBC driver → **Install ODBC Driver** (Microsoft's license dialog comes first, then one
  administrator prompt).
- `DB_HOST` is `(localdb)\Rezure` but LocalDB isn't installed → **Install LocalDB**.
- LocalDB with a value in `DB_PORT` → set `DB_PORT=` to empty. Laravel otherwise appends
  `,1433`, which LocalDB doesn't listen on.
- ODBC Driver 18 without certificate trust configured → a note to uncomment
  `'trust_server_certificate'` in `config/database.php` and set
  `DB_TRUST_SERVER_CERTIFICATE=true`.
- When ready: "SQL Server is ready — this project uses Rezure's LocalDB." or "PHP can reach SQL
  Server at {host}."

See [SQL Server](/guide/sql-server).

## Limitations

- **It runs on the global active PHP**, even for a project [pinned](/guide/project-php-version)
  to another version. For a pinned project, check its extensions with `php -m` in its
  [project terminal](/guide/project-terminal) instead.
- **Only the default connection is checked** — whatever `DB_CONNECTION` says. Extra
  connections in `config/database.php` aren't.
- A malformed `composer.json` is treated as "nothing to check".
- The dialog's own hint about adding `extension=` lines to an `.ini` file predates the
  [PHP Extensions](/guide/php-extensions) page — use the toggles there instead.

## Related

- [PHP Extensions](/guide/php-extensions) — turn extensions on and off per version
- [Laravel .env Cheatsheet](/guide/laravel-env) — the right values for each engine
- [Logs](/guide/logs) — when the check passes but the site still fails

---
title: Run PostgreSQL 16, 17, or 18 Locally on Windows
description: Run PostgreSQL 16, 17, or 18 locally with Rezure on Windows — install, start, switch versions, create, export, and import databases, and connect Laravel with no .env password.
---

# PostgreSQL

Rezure can run a local PostgreSQL server next to MariaDB — not instead of it. It uses EDB's
portable Windows builds, so nothing is installed into Windows, there's no Windows service, and
no administrator prompt.

## Install

Any of these installs PostgreSQL:

- **Install** on the **PostgreSQL** row of the [Services](/guide/services) page — installs the
  newest version.
- **Switch → Install version → PostgreSQL** — pick a version.
- **Install PostgreSQL** in the [Requirements Check](/guide/requirements-check) of a project
  that uses `pgsql`, or in the Add connection form.

Versions offered: **18.6**, **17.11**, and **16.15**, each checked against a pinned SHA-256. The
download is about 400 MB; Rezure keeps only the server and its tools, about **150 MB** per
version. pgAdmin isn't included. Files go to `C:\rezure\bin\postgres\<version>`.

## Start and stop

Start it from the **PostgreSQL** row on the Services page. It listens on **`127.0.0.1:5432`**.

The first start of each major version creates its data folder,
`C:\rezure\data\postgres\<major>\`, as UTF-8.

**Stop** shuts the server down cleanly (a "fast" shutdown: open connections are closed,
nothing is lost).

::: warning Don't run Rezure as administrator
PostgreSQL refuses to run with administrator rights. If Rezure was started with **Run as
administrator**, starting PostgreSQL fails with "PostgreSQL refuses to run with administrator
rights … close it and open it normally". Open Rezure normally and start it again.
:::

## Users and passwords

The server has two superusers: **`postgres`**, PostgreSQL's usual one, and **`root`**, which
Rezure adds because it's Laravel's default `pgsql` username.

Local connections use **trust** authentication, so **no password is needed** — any password,
or none, is accepted. That's convenient on your own laptop and would be unsafe anywhere else;
the server only listens on `127.0.0.1`.

## Connect Laravel

Turn on **`pdo_pgsql`** for your PHP version first — it ships with PHP but is off by default.
Do it on [PHP Extensions](/guide/php-extensions), or click **Turn on pdo_pgsql** in the
project's Requirements Check. Without it Laravel fails with "could not find driver".

Then in `.env`:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

Laravel's default `pgsql` settings already use `root` and port 5432, so a fresh project
connects with only `DB_CONNECTION` and `DB_DATABASE` changed. Create the database first —
below — and restart PHP after turning the extension on.

## On the Databases page

Once a version is installed, a connection called **PostgreSQL** (tagged "PostgreSQL · this PC")
appears in the **Connections** section of the target switcher. Pick it to work with the local
server. It can't be removed.

| Action | What it does |
| --- | --- |
| List | Every database you can connect to, with table count and size. The encoding shows under the name. System databases (`postgres`, `template0`, `template1`) are hidden. |
| **New database** | Creates it with the **UTF8** encoding. |
| **Export** | A plain `.sql` dump (`pg_dump`, without owner or privilege statements) into `C:\rezure\dumps`. It shows progress but can't be cancelled. |
| **Import .sql** | Creates the database if it's missing, then runs the file. It stops at the first error and names the line ("line 12: …"). Not transactional. |

There's no drop button — use `DROP DATABASE myapp;` in a client.

Importing into a database that **already exists** stops at the first table that's already
there, so import into a new name to be safe.

If the server isn't running, the page says "Rezure's PostgreSQL isn't running, so there's
nothing to list yet. Start it from Services, then retry."

## Open in a SQL client

| Client | Opens |
| --- | --- |
| TablePlus | The database |
| DBeaver | The database |
| pgAdmin 4 | Just opens ("server only") — add the server in pgAdmin yourself |
| **psql console** | Always listed — a `psql` session on the database |

For TablePlus, DBeaver, or anything else, the details are host `127.0.0.1`, port `5432`, user
`postgres` or `root`, and any password.

## Switch versions

With more than one version installed, pick one in the **PostgreSQL** row of the **Switch**
page. Each option shows where its data lives ("data: postgres\18"). If the server is running,
Rezure stops it cleanly and starts the new version ("Switching PostgreSQL…"). The choice is
remembered.

::: warning Each major version has its own data
Switching from 17 to 18 starts on **18's** data folder — your databases from 17 don't come
along. To move them, export each one while 17 is active, switch, and import them into 18.
Rezure doesn't run `pg_upgrade`.
:::

## Remote PostgreSQL servers

Rezure can also connect to a PostgreSQL server elsewhere, using the `psql` and `pg_dump` from
your **newest** local build. See [Remote Databases](/guide/remote-databases).

## Troubleshooting

### Port 5432 is already in use

Usually a PostgreSQL installed with EDB's regular Windows installer, which runs as a Windows
service. Stop it in `services.msc` (it's named like **postgresql-x64-17**). See
[Port Conflicts](/guide/port-conflicts).

### "could not find driver" in Laravel

`pdo_pgsql` is off for the PHP version the project uses. Turn it on and restart PHP.

### "role … does not exist"

The `DB_USERNAME` isn't `root` or `postgres`. Use one of those — any password works.

### My databases disappeared after switching versions

They're in the previous version's data folder, untouched. Switch back to see them, and use
export and import to move them.

## Related

- [Laravel .env Cheatsheet](/guide/laravel-env) — values for every engine
- [Remote Databases](/guide/remote-databases) — PostgreSQL on another server
- [PHP Extensions](/guide/php-extensions) — turning on `pdo_pgsql`

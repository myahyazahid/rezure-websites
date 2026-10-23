---
title: SQL Server
description: Use SQL Server with PHP and Laravel on Windows through Rezure — install pdo_sqlsrv, Microsoft's ODBC Driver, and SQL Server LocalDB from inside the app, and connect to other SQL Server instances.
---

# SQL Server

PHP projects that use SQL Server need three things on Windows: Microsoft's PHP drivers, the
Microsoft ODBC Driver they talk through, and a server. Rezure installs all three from inside the
app — the server being **SQL Server 2022 Express LocalDB**, a lightweight SQL Server that runs
on demand.

You can use any part on its own: just the drivers to reach an office SQL Server, or the whole
set for a local database.

## PHP drivers

On [PHP Extensions](/guide/php-extensions), in the **Database** group, install:

- **`pdo_sqlsrv`** ("PDO SQL Server") — what Laravel uses.
- **`sqlsrv`** ("SQL Server") — the non-PDO functions.

Click **Install {version}** on each. Rezure picks the right Microsoft release for the PHP
version — 5.13.3 for PHP 8.3–8.5, 5.12.0 for 8.1–8.2, 5.10.0 for 7.4–8.0 — and switches it on.
Restart PHP afterwards. Install them separately for each PHP version you use with SQL Server.

## ODBC Driver

The PHP drivers connect through **Microsoft ODBC Driver 18 for SQL Server**. PHP loads them
without it, but every connection fails. Install it from any of:

- the banner on **PHP Extensions** (shown when a SQL Server extension is on and the driver is
  missing),
- **Install ODBC Driver** in the Add connection form on the Databases page,
- the project's [Requirements Check](/guide/requirements-check).

An ODBC Driver **17 or 18** you already have counts. The very old built-in "SQL Server" driver
that comes with Windows doesn't.

### What installing a Microsoft package looks like

The ODBC Driver (18.7.1.1) and LocalDB (16.0.1000.6) are real Windows installs, so they work a
little differently from everything else in Rezure:

1. A dialog titled **Install {name}** explains what will happen and links to **Read
   Microsoft's license terms**.
2. Tick **I accept the Microsoft license terms for {name}.** — **Install** stays disabled until
   you do. Rezure never accepts the license on your behalf.
3. Rezure downloads Microsoft's installer and checks both its checksum and Microsoft's
   signature.
4. Windows asks for administrator permission **once**. Click **Yes**.
5. The package appears in **Settings → Apps** like any other program. **Uninstalling Rezure
   doesn't remove it.**

The installer file and its log are kept in `C:\rezure\data\installers\`.

## Install LocalDB

Install **SQL Server LocalDB** from **Switch → Install version → SQL Server LocalDB**, the
**Install** button on its Services row, or a project's Requirements Check. The license and
administrator steps are the same as above.

Rezure then creates a LocalDB instance named **`Rezure`**. You reach it as:

```
(localdb)\Rezure
```

LocalDB starts itself the moment something connects to it, so you don't strictly need to start
it from the Services page. Its row there shows `(localdb)\Rezure · :14330`; **Stop** shuts it
down cleanly and **Force stop** kills it.

Database files for databases Rezure creates are kept in `C:\rezure\data\mssql\`.

### Connect Laravel to LocalDB

You need `pdo_sqlsrv` and the ODBC Driver from above. Then in `.env`:

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=(localdb)\Rezure
DB_PORT=
DB_DATABASE=myapp
DB_USERNAME=
DB_PASSWORD=
```

- **`DB_PORT=` must be present and empty.** LocalDB is reached through a named pipe, not a TCP
  port; with a port set, Laravel appends `,1433` and the connection fails.
- **An empty username means Windows authentication** — you sign in as your own Windows user,
  with no password.
- With ODBC Driver 18, encryption is on by default. If you get a certificate error, uncomment
  `'trust_server_certificate'` in `config/database.php` and add
  `DB_TRUST_SERVER_CERTIFICATE=true` to `.env`.

The Requirements Check verifies all of this for a `sqlsrv` project.

### The TCP bridge for GUI clients

Many GUI clients can't reach a named pipe. For them, Rezure relays **`127.0.0.1:14330`** to
LocalDB, with a SQL login **`rezure`** that has no password. Connect TablePlus, DBeaver, or
another client with:

```
Host: 127.0.0.1
Port: 14330
User: rezure
Password: (empty)
Encryption: off
```

The bridge only works with encryption **off**.

## On the Databases page

Once LocalDB is installed, a connection called **SQL Server LocalDB** (tagged "SQL Server · this
PC") appears in the **Connections** section of the target switcher. It uses Windows
authentication and can't be removed.

| Action | LocalDB | Another SQL Server |
| --- | --- | --- |
| List | Your databases, with table count and size (system databases hidden) | Same |
| **New database** | With a collation — the server's default first, then common Latin1 and UTF-8 options | Same |
| **Export** | A `.bak` backup (copy-only) into `C:\rezure\dumps` | Not available — `BACKUP` writes onto the server's own disk |
| **Import .sql / .bak** | A `.sql` script, or **Restore .bak** | `.sql` scripts only |

About imports:

- `.sql` scripts are split on `GO` lines (`GO 5` repeats the batch five times), and UTF-16 files
  saved by SSMS work. Errors name the batch: "batch 3: …".
- **Restoring a `.bak` replaces** a database with the same name entirely.

There's no drop button — use `DROP DATABASE myapp;` in a client.

## Connect to another SQL Server

Rezure can work with any SQL Server you can reach — SQL Server Express on this PC, a server on
your office network, or one behind SSH. On the Databases page, open the target switcher, click
**+ Add connection**, and choose **SQL Server**.

Rezure scans this PC first and lists what it finds under **Found on this computer**: installed
editions such as "SQL Server 2022 (SQLEXPRESS)" (host `localhost\SQLEXPRESS`), and other LocalDB
instances such as `(localdb)\MSSQLLocalDB`. Clicking one fills in the form, with **Windows
account** sign-in and — for installed editions — **Trust server certificate** ticked. You still
**Test connection** and **Save**.

Field-by-field details, SSH tunnels, and troubleshooting are on
[Remote Databases](/guide/remote-databases#sql-server-specifics).

## Open in a SQL client

| Client | Opens |
| --- | --- |
| SQL Server Management Studio (SSMS) | Always — the database, with Windows or SQL sign-in; SSMS asks for a password itself |
| TablePlus, DBeaver | Only for a SQL login on a known port — which includes LocalDB, through the `rezure` login on the bridge |

If none are installed: "No SQL Server client found. Install SQL Server Management Studio to open
databases from here."

## Limitations

- Rezure's driver downloads are for **non-thread-safe x64** PHP — the builds Rezure installs. A
  thread-safe PHP you added by hand can't use them.
- A remote SQL Server can't be exported or restored from `.bak` through Rezure.
- LocalDB is meant for development and has no SQL Server Agent. If a project relies on
  features LocalDB doesn't have, install SQL Server Express or Developer edition and connect to
  it as another SQL Server.

## Troubleshooting

### Every connection fails, even though `pdo_sqlsrv` is installed

The ODBC Driver is missing. Install it from PHP Extensions.

### "could not find driver"

`pdo_sqlsrv` isn't installed or isn't on for the PHP version the project uses. Install it on
PHP Extensions for that version, then restart PHP.

### Connection fails with `,1433` in the error

`DB_PORT` has a value. Set it to empty: `DB_PORT=`.

### Certificate or SSL errors

ODBC Driver 18 encrypts by default and doesn't trust self-signed certificates. For Laravel,
uncomment `'trust_server_certificate'` in `config/database.php` and set
`DB_TRUST_SERVER_CERTIFICATE=true`. For a saved connection, re-add it with **Trust server
certificate** ticked.

### The Microsoft installer fails

Rezure translates the common Windows Installer errors:

- **cancelled** — the license or administrator prompt was declined; try again and click
  **Yes**.
- **another installation is already running** — wait for Windows Update or another installer
  to finish.
- **another version is installed** — remove the other version from Settings → Apps first.
- **no administrator rights** — your account can't install software; ask whoever manages the
  PC.

Anything else points to the log file in `C:\rezure\data\installers\`.

## Related

- [Laravel .env Cheatsheet](/guide/laravel-env) — values for every engine
- [Remote Databases](/guide/remote-databases) — SQL Server on another machine
- [PHP Extensions](/guide/php-extensions) — the driver toggles

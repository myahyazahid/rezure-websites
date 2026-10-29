---
title: Local MariaDB and MySQL on Windows
description: 'Run MariaDB or MySQL locally on Windows with Rezure: create, export, and import databases, open them in your SQL client, or reuse Laragon or XAMPP data.'
---

# MariaDB and MySQL

Rezure runs one MySQL-family server on `127.0.0.1:3306`. Out of the box that's MariaDB with its
own data folder, but the same service can also serve an existing MySQL or MariaDB **data
directory**, Laragon's or XAMPP's, for example, without copying or converting anything.

## The local server

The default setup is a profile called **Rezure**:

| | |
| --- | --- |
| Engine | MariaDB 11.2 |
| Data folder | `C:\rezure\data\mariadb\data` |
| Address | `127.0.0.1:3306` (it never listens on your network) |
| User | `root` |
| Password | empty |

Start and stop it from the **MariaDB** row on the [Services](/guide/services) page. When a
different profile is active, that row shows its engine and version instead, **MySQL 8.4**, for
example.

## The Databases page

With the local server as the target, the **Databases** page lists every database with:

- **Tables** and **Size**.
- Its collation, under the name.
- **Used by**: the project whose name matches the database, treating `_` and `-` alike (a
  database `my_shop` matches the project `my-shop`).

**Search databases** filters by name, and the refresh icon re-reads the list. If the server
isn't running you'll see "MariaDB isn't running, so there's nothing to list yet. Start it from
Services, then retry."

### Create a database

**New database** asks for a **Database name** and a **Collation** (default
`utf8mb4_unicode_ci`). Names can use letters, digits, `_`, and `-`, up to 64 characters.

### Export

**Export** on a row writes a `.sql` dump to `C:\rezure\dumps`, named
`<database>-<YYYYMMDD-HHMMSS>.sql` (the timestamp is UTC). A progress bar and **Cancel** appear
while it runs, and **Show folder** opens the result. A cancelled or failed export leaves no
half-written file behind.

### Import

**Import .sql** asks for the file and the database to load it into, pre-filled from the file
name, with Rezure's own timestamp suffix removed.

- If the database doesn't exist, it's created.
- If it does, the dialog warns you: a dump usually contains `DROP TABLE`, so the tables it
  defines are replaced.
- Imports aren't transactional. If one fails halfway, everything before the failing statement
  stays applied.

### Dropping a database

There's no drop button. Drop a database from your SQL client or the console:

```sql
DROP DATABASE my_shop;
```

## Open in a SQL client

**Open** on a database launches a SQL client you have installed. With exactly one client it
opens directly; with several you get "Open {db} with" and a choice.

| Client | Opens |
| --- | --- |
| TablePlus | The database |
| DBeaver | The database (it may ask to download its driver the first time) |
| HeidiSQL | The database |
| MySQL Workbench, Navicat | The server ("server only") |
| **MariaDB console (bundled)** | Always listed: a `mariadb` command-line session |

Clients are found in their usual install locations, including Laragon's bundled HeidiSQL and
DBeaver. Each one is listed with its own logo, taken from the client you have installed.

DBeaver and MySQL Workbench take a few seconds to show a window, so the page shows **Opening
{client}…** in the meantime and **Open** is disabled, which keeps a second click from starting a
second copy.

For a **remote** connection with a saved password, TablePlus, DBeaver, HeidiSQL, and the
MariaDB console are given that password so they connect straight away; MySQL Workbench asks for
it itself. See
[Remote Databases](/guide/remote-databases#open-in-an-external-client).

## Data directory profiles

A **profile** is a saved pointer to a MySQL or MariaDB data directory: its path, engine,
version, and port, plus, for an adopted install, that install's own server binaries and
`my.ini`. Rezure runs one profile at a time and switches which data directory the server
opens. Your data is never copied, moved, or converted.

Profiles are listed in the **Data directory** section of the target switcher at the top of the
Databases page, with the active one tagged **Active**.

### Use a Laragon or XAMPP data directory

1. Open the target switcher and click **+ Add data directory**.
2. Rezure looks for other tools at their default locations ("Looking for other tools…"):
   - **Laragon**: each `C:\laragon\bin\mysql\*` install, using the `datadir` in its `my.ini`.
   - **XAMPP**: `C:\xampp\mysql\data`.
3. Each one found is listed with its engine, version, and path. Click **Add**.
4. Pick the new profile in the switcher to switch to it.

An adopted profile runs on that tool's **own** server binary and `my.ini`, so a Laragon MySQL
8.4 data folder is opened by Laragon's MySQL 8.4, never by a different version that might
upgrade it. Rezure only overrides the data directory, port (always **3306**), and listen address
(`127.0.0.1`).

If the install came without its server binaries, the card says "No server binary found beside
it: you'll need a matching {engine} {version} build."

Nothing found? "No other database directories found. Laragon and XAMPP are checked in their
default locations." Use the manual option below for anything else, including WAMP or a
standalone MySQL.

### Point at a folder yourself

**Point at a folder myself** asks for:

- **Name**: defaults to the folder name.
- **Data directory**: the folder that holds `ibdata1`. **Browse** picks it. Rezure reads the
  engine from the folder itself: a `mysql.ibd` file means MySQL 8+, `aria_log_control` means
  MariaDB.
- **Port**: default 3306.

A manually added profile has no recorded version, binary, or `my.ini`. It runs on the
**newest** installed build of its engine. Be careful with an older data directory: a newer
server may upgrade it in place, after which the older server can't open it. For Laragon and
XAMPP folders, prefer the automatic detection above, which keeps their own binary and
`my.ini`.

### What happens when you switch

1. **Checks first, before anything is stopped.** Rezure refuses to switch if the folder was
   written by a different engine than the profile says ("opening it with the wrong engine can
   corrupt it"), if no compatible server build is installed, or if another server is still
   running against that folder ("Laragon's database server looks like it's still running
   against this data directory: stop it there first").
2. **A clean stop** of the current server, up to two minutes before it's forced.
3. **A start on the new profile**, whether or not the server was running before. The overlay
   reads "Switching to {profile}…".
4. **Rollback if it fails.** If the old server was running and the new one won't start, Rezure
   goes back: "switched back to "{previous}": {reason}". If nothing was running before, the
   new profile stays selected with the error.

A compatible build means the same major and minor version: a MariaDB 10.11 data directory needs
a MariaDB 10.11.x server. A different minor or major version is refused rather than risking an
upgrade.

### Managing profiles

Profiles can't be renamed or removed from the app yet. They're stored in
`C:\rezure\etc\profiles.json`; to remove one, quit Rezure, delete its entry from that file, and
start Rezure again. Removing a profile never touches its data directory.

## Install more MariaDB versions

**Switch → Install version → MariaDB** lists releases from MariaDB's own release index for the
**10.6, 10.11, 11.4, and 11.8** branches, each checked against MariaDB's published checksum. They
install into `C:\rezure\bin\mariadb\<version>`.

An installed version is used by any profile with the same major and minor version, and by
manually added profiles (which take the newest build). Installing a newer MariaDB doesn't
upgrade an existing profile's data; the version rule above protects it.

The **MariaDB** row on the Switch page only shows the newest installed build; there's no
version switch there, because the active profile decides.

### MySQL

Rezure doesn't download MySQL. To run MySQL (for a MySQL 8 data directory, or so remote
connections can use MySQL's own client), download the **ZIP Archive** from
[dev.mysql.com](https://dev.mysql.com/downloads/mysql/) and unzip it into
`C:\rezure\custom\mysql\`. Rezure finds it there. Builds added this way aren't
checksum-verified.

## Connecting from PHP

The default profile:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

`pdo_mysql` and `mysqli` are on by default in every PHP version. An adopted Laragon or XAMPP
data directory keeps its own users and passwords (both tools default to `root` with an empty
password). See the [Laravel .env Cheatsheet](/guide/laravel-env) for the other engines.

## Troubleshooting

### Listing fails with "access denied" on an adopted profile

Rezure reads the local server as `root` with an empty password. If the adopted data
directory's `root` has a password, the server starts but the Databases page can't list it. Set
the `root` password back to empty in that server, or use a SQL client for that profile.

### "no MariaDB 10.11 binary is installed: add one before switching to this profile"

The profile needs a server of that major and minor version. Install it from **Switch →
Install version → MariaDB**, or for MySQL, unzip a matching build into
`C:\rezure\custom\mysql\`.

### "… doesn't look like a MySQL or MariaDB data directory"

You picked the wrong folder. Pick the one that directly contains `ibdata1`; for XAMPP that's
`C:\xampp\mysql\data`.

### A manually added XAMPP folder fails with "Incorrect file format"

The server needs XAMPP's own `my.ini` settings. Remove that profile and add the folder through
the automatic detection instead, which uses XAMPP's binary and `my.ini`.

### MariaDB won't start: port 3306 is in use

Laragon's or XAMPP's MySQL, or a MySQL Windows service, has the port. See
[Port Conflicts](/guide/port-conflicts).

### Import fails with "Unknown collation utf8mb4_0900_ai_ci"

The dump came from MySQL 8, and MariaDB doesn't have that collation. Replace
`utf8mb4_0900_ai_ci` with `utf8mb4_unicode_ci` in the file, or import it into a MySQL profile.

## Related

- [Remote Databases](/guide/remote-databases): staging servers and VPS databases
- [PostgreSQL](/guide/postgresql) and [SQL Server](/guide/sql-server): the other local engines
- [Port Conflicts](/guide/port-conflicts): when 3306 is taken

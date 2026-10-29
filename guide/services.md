---
title: Start and Stop Nginx, PHP, and Databases
description: Start, stop, and restart Nginx, PHP, MariaDB, PostgreSQL, SQL Server LocalDB, and Mailpit from Rezure's Services page — bulk actions, force stop, crash recovery, and which services the page shows.
---

# Services

The **Services** page is Rezure's home screen: every process your projects depend on, with a
status, a version, its ports, and Start/Stop/Restart. Nothing on it starts by itself — not
when Rezure opens, and not when Windows signs in. You decide what runs.

## The services

| Service | What it does | Port | Where it comes from |
| --- | --- | --- | --- |
| **Nginx** | Web server for every project | 80 | Ships with the installer |
| **PHP** | Runs PHP for projects on the global version, as 4 workers | 9100–9103 | Ships with the installer (PHP 8.3); more versions on the [Switch](/guide/php-versions) page |
| **PHP x.y.z** | One row per extra version that a project is [pinned](/guide/project-php-version) to | 9110–9113, 9120–9123, … | Appears when you pin a project |
| **MariaDB** / **MySQL** | The local MySQL-family database. The row shows whichever engine the active [data directory profile](/guide/mariadb-mysql) uses | 3306 | See [MariaDB & MySQL](/guide/mariadb-mysql) |
| **PostgreSQL** | Local PostgreSQL server | 5432 | **Install** on its row (newest version), or the Switch page — see [PostgreSQL](/guide/postgresql) |
| **SQL Server LocalDB** | Local SQL Server, reached as `(localdb)\Rezure` | named pipe, plus a bridge on 14330 | Microsoft installer, with a license prompt — see [SQL Server](/guide/sql-server) |
| **Mailpit** | Catches outgoing mail | 1025 (SMTP), 8025 (inbox) | **Install** on its row — see [Mailpit](/guide/mailpit) |

Every service except Nginx listens on `127.0.0.1` only. Nginx listens on all interfaces on
port 80, so other devices on your network could reach your sites if Windows Firewall lets
them. The full list is on [Ports](/guide/ports).

Dev servers for Vite, Next.js, Nuxt, Astro, and Node projects aren't on this page, and **Start
all** never starts them. Each is started from the Projects page, with **Open** or in **Dev
servers**. See [Dev Servers](/guide/dev-servers).

## Start, stop, restart

Each row has its own **Start** or **Stop** button and a **Restart** icon. Restart is a stop
followed by a start.

The toolbar at the top acts on the whole page at once:

- **Start all** starts every listed service that is stopped *and* installed. Rows that show
  **Not installed** are skipped.
- **Restart all** restarts every running service.
- **Stop all** stops everything that's running.

They run in parallel, and the rows update as each service comes up. If one service fails
during **Start all**, its row just stays **Stopped** without an error message — click that
row's own **Start** to see the reason.

### What a row shows

- **Status** — **Running**, **Stopped**, **Starting…**, **Stopping…**, or **Not installed**.
- **Version** and **port** pills. PHP shows its port range and worker count, for example
  `:9100–9103 · 4/4 workers`; Mailpit shows both of its ports.
- **CPU** — a small sparkline and a percentage while the service runs (in a wide enough
  window). It's a snapshot taken whenever the page refreshes its list, after an action for
  example, not a live meter.
- **Open** — on the Mailpit row while it runs, opens the inbox at `http://127.0.0.1:8025`.
- **Toggle logs** — the last 20 lines of that service's output, right under the row. The
  [Logs](/guide/logs) page has the full combined view.

### Installing from a row

Rows for services that one download makes usable show **Install** instead of **Start**:
Nginx, Mailpit, and PostgreSQL. While it works, the button shows **Downloading… N%**,
**Verifying…**, **Extracting…**, then **Installing…**. Every download is checked against a
published checksum before it's used.

SQL Server LocalDB is a Microsoft installer, so its **Install** first asks you to accept
Microsoft's license and then shows one Windows administrator prompt. See
[SQL Server](/guide/sql-server#install-localdb).

PHP versions and Node.js are added on the [Switch](/guide/php-versions) page instead.

## How stopping works

- **Nginx and PHP** are stopped immediately.
- **Databases** (MariaDB/MySQL and PostgreSQL) are asked to shut down cleanly, so they can
  close their data files. Rezure waits up to two minutes before it forces them.

### Force stop

When a service won't respond, open **More actions** (⋮) on its row and choose **Force stop**.
That kills the process at once. For a database Rezure asks first, because the database never
gets to close its data directory and has to run crash recovery on the next start. Use
**Stop** unless it's genuinely stuck.

### How long a database may take to start

A database row stays on **Starting…** until the server actually accepts connections. That's
usually seconds, but a large data directory that needs recovery can take longer. Rezure keeps
waiting as long as the server keeps writing log output, and only gives up after 90 seconds of
silence ("the server stopped responding") or 15 minutes in total.

## When a service crashes

**PHP restarts itself.** Rezure checks its workers every two seconds and restarts one that
died, waiting 1, 2, 5, 10, then 30 seconds between attempts. While that's happening the worker
count turns amber ("Some workers stopped unexpectedly and are being restarted. The rest keep
serving."). If PHP keeps crashing for five minutes, Rezure pauses the automatic restarts until
you start or stop it yourself.

**Other services are not restarted.** A database or Nginx that exits on its own shows
**Stopped** the next time the page refreshes. Check its log, then start it again.

To get a Windows notification when either happens, turn on **Notify when a service crashes**
in [Settings](/guide/settings): "{name} stopped unexpectedly", or "{name} keeps crashing —
automatic restart paused" when PHP gives up.

Processes left behind by an earlier crash of Rezure itself are cleaned up the next time it
starts — but only ones Rezure can prove it started.

## Manage services

Not every project needs PostgreSQL, SQL Server, or Mailpit. **Manage services** ("Choose
which services this page shows") lets you keep only the rows you use.

- The dialog has two groups: **On the Services page** and **Not added**. **Remove** and
  **Add** move a service between them.
- Removing a service **doesn't uninstall it or touch its data** — add it back any time.
- A running service is stopped first ("Running — removing it stops it first"). A removed
  service is also left out of **Start all**, **Restart all**, and **Stop all**.
- Nginx and PHP are marked "Your project sites need it". You can still remove them.
- Pinned PHP versions follow the **PHP** row; they can't be removed on their own.

Services added in future versions of Rezure show up on the page by default.

## Closing the window

By default, closing Rezure's window **quits** it, and quitting stops every service, every SSH
tunnel, and every shared project.

To keep things running in the background, turn on **Keep running in tray on close** in
[Settings](/guide/settings). Closing the window then only hides it. The tray icon's menu has
**Show Rezure** and **Quit**, and **Quit** still stops everything first.

## The sidebar summary

The card at the bottom of the sidebar shows how many services are up ("Services up … of N"),
and **Uptime** — how long Rezure itself has been open, not how long any one service has been
running. The **Services** item in the sidebar shows the same running/total count.

## Troubleshooting

### "port 80 is already in use" or "can't start Nginx — port 80 is held by …"

Another program has the port. See [Port Conflicts](/guide/port-conflicts) — for most programs
Rezure can stop it for you.

### "{name} isn't installed yet — download it from the Binaries panel first"

That message predates the current layout. Install the service from its row, or from
**Install version** on the [Switch](/guide/php-versions) page.

### PostgreSQL refuses to start "with administrator rights"

Rezure was started with **Run as administrator**, and PostgreSQL won't run elevated. Close
Rezure, open it normally, and start PostgreSQL again.

### A database is stuck on "Starting…"

Open its log (the logs toggle on the row). If it's still printing recovery messages, let it
finish. If it says "the server stopped responding: no output and no connections for 90s", the
data directory may be damaged or held by another program — check
[MariaDB & MySQL](/guide/mariadb-mysql#troubleshooting).

## Related

- [Port Conflicts](/guide/port-conflicts) — when a port is already taken
- [Logs](/guide/logs) — every service's output in one place
- [Settings](/guide/settings) — tray, notifications, and start with Windows

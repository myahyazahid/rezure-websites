---
title: How to Install Rezure on Windows
titleTemplate: false
description: Step-by-step install of Rezure on Windows 10 and 11 — requirements, checksum verification, what the installer sets up, where your data lives, and how to check it started cleanly.
---

# Installation

## Before you start

Rezure needs 64-bit Windows 10 (build 1809 or newer) or Windows 11, roughly 400 MB of free
disk space, and the WebView2 runtime, which is already present on virtually every current
Windows install. The full list is on the [download page](/download).

One thing worth checking first: **if another local server stack is running, stop it.** Port
80 and port 3306 can't be shared with Rezure. You don't need to uninstall anything, just
don't run two stacks at once. If you forget, Rezure tells you which program holds the port
and can stop it for you — see [Port Conflicts](/guide/port-conflicts).

## Install

1. Download the installer from the [download page](/download).
2. Verify its SHA-256 hash against the one on the release page: the
   [verification steps](/download#verify-your-download) take about ten seconds.
3. Run the installer and accept the default location unless you have a reason not to.
4. Launch Rezure from the Start menu.

Windows SmartScreen may warn you about an unrecognized publisher on the first run. That's
code-signing, not a virus report: choose **More info → Run anyway** if the hash you checked
in step 2 matched.

Run Rezure as your normal user, not with **Run as administrator**. Nothing in it needs that,
and PostgreSQL refuses to start under an elevated Rezure.

## What the installer sets up

The installer puts the app itself, plus a bundled Nginx 1.25.3, PHP 8.3, and a CA certificate
bundle, into the install folder. On first launch Rezure copies those into its own home folder,
`C:\rezure`, and everything it works with from then on lives there:

| Path | What lives there |
|---|---|
| `C:\rezure\www` | Your projects. Each folder here is served as its own `.test` site. |
| `C:\rezure\bin` | Runtimes Rezure downloaded and checksum-verified: PHP, MariaDB, PostgreSQL, Node.js, Composer, Mailpit |
| `C:\rezure\custom` | Drop-in folder for runtimes you downloaded yourself, such as `custom\php` |
| `C:\rezure\data` | Service state: database data, generated Nginx and PHP config, Mailpit's mailbox |
| `C:\rezure\etc` | Settings, database profiles and connections, linked projects, your own PHP settings |
| `C:\rezure\dumps` | Database exports |

The full map is on [Files & Folders](/guide/files-and-folders). If `C:\` isn't writable on
your machine, Rezure uses `%LOCALAPPDATA%\Rezure` instead.

Your projects and settings live outside the install folder, so reinstalling or rolling back
to an older version leaves them untouched.

### Upgrading from an older Rezure

Earlier versions spread their files across `%LOCALAPPDATA%\Rezure`, `%APPDATA%\Rezure`, and
`%USERPROFILE%\rezure`. The first time a current version starts, it moves all of that into
`C:\rezure` for you. It never overwrites anything already there, and if a step fails it leaves
the old files where they were rather than deleting them.

## Administrator rights

Rezure asks for administrator approval in only two situations:

- **Editing the Windows `hosts` file**, so a project's `.test` domain resolves. That happens
  when you click **Sync hosts file** on the Projects page and something actually needs to
  change. If you decline, the rest of the app keeps working: the domain just won't resolve
  until the entry is added.
- **Installing Microsoft's ODBC Driver or SQL Server LocalDB**, which are real Windows
  installs. Windows asks once per install. See [SQL Server](/guide/sql-server).

Everything else — starting services, downloading runtimes, putting PHP on your `PATH` — runs
as your normal user.

## Verify the install

Open Rezure and look at the **Services** page. Nginx and PHP should both be listed as
**Stopped**, with a version next to each. That's a healthy first launch. The other rows show
**Not installed** until you add them. Head to [First Run](/guide/first-run) to start the
services.

If Nginx or PHP is listed as **Not installed** instead, the bundled binaries didn't unpack.
Reinstalling over the top is the fastest fix.

## Related

- [First Run](/guide/first-run): start your services and serve a first project
- [Updates & Changelog](/guide/updates): how Rezure updates itself
- [Uninstall](/guide/uninstall): remove Rezure and everything it set up

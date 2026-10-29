---
title: Privacy and Usage Data
description: 'Exactly what usage data Rezure sends and when: the device ID, events, and heartbeats. What it never sends, and how to turn it off.'
---

# Privacy and Usage Data

Rezure sends a small amount of usage data to its own server, so the maintainers can see which
versions and stacks people run and which errors come up most. This page lists all of it. It's
**on by default**, and there is no switch for it in the app.

## The device ID

On first run Rezure creates a random ID (a UUID) for this install and keeps it in
`C:\rezure\etc\device.json`. It isn't derived from your hardware or account. It's sent with
every usage event and heartbeat below, **and with every Feedback ticket**, so tickets and
usage data from one install can be linked to each other.

Deleting `device.json` (with Rezure closed) makes the install look new.

## What is sent

### Events

| When | Event | What it contains |
| --- | --- | --- |
| Rezure opens | `app_opened` | Nothing beyond the basics below |
| A service starts | `service.start` | The service's name (e.g. "Nginx"), and the versions of PHP, MariaDB/MySQL, PostgreSQL, and SQL Server LocalDB in use, only the ones installed |
| A service stops | `service.stop` | The service's name |
| Starting, stopping, or restarting fails | `error.report` | The **kind** of error only (e.g. `PortInUse`), plus the action and service. Never the error message. |
| A service crashes on its own | `error.report` | `ServiceCrashed` and the service |
| You add a folder with **Add folder** | `project.linked` | The [framework](/guide/frameworks) id detection found and the one you chose, if different, such as `node` and `codeigniter4` |
| You change a project's framework, or set it back to Auto | `project.framework_changed` | The same two framework ids |

The framework events show where detection gets projects wrong and which frameworks people use
that Rezure doesn't recognise yet. Only built-in ids such as `laravel` are sent as they are. A
framework from your own `frameworks.json` is sent as `user-defined`, since its id could name
your company or client, a custom folder as `custom`, and no match as `unknown`. The project's
name, path, domain, and files are never included.

[Dev servers](/guide/dev-servers) send nothing at all: starting, stopping, or a crash of one
records no event, because their ids are project names.

Every event also carries the device ID, a random event ID, the Rezure version, and the time it
happened.

### Heartbeats

Once when Rezure starts and every five minutes while it's open, Rezure sends a heartbeat with:

- the device ID,
- a session ID: a new random ID each time Rezure starts, kept only in memory,
- the Rezure version,
- the Windows edition and build (e.g. "Windows 11 Home", "11 (26200)"),
- **your Windows account name** (the `%USERNAME%` value), cut to 64 characters.

When Rezure quits it sends one last heartbeat with the end time, without the Windows details or
account name.

### Where and how

Events and heartbeats are queued in `C:\rezure\rezure.db` and sent every 60 seconds, a few at a
time, over HTTPS to `api.redscale.my.id`. If sending fails, you're offline, say, they stay
queued and go out later. Rows that were sent are deleted from the local queue after seven days.

Like any request to any server, these reach it from your IP address. The server uses it to tell
which country usage comes from; it isn't part of what Rezure sends.

## What is never sent

- File or folder paths
- Project names, domains, or database names
- Anything you type: queries, passwords, `.env` contents
- Error messages or log lines (except a log you choose to attach to a Feedback ticket)
- Your code or your data

## Turning it off

There's no switch in the app. Rezure honours a setting in its settings file:

1. **Quit** Rezure completely, from the tray icon, if it's kept there. (Rezure writes this file
   while it runs, so an edit made with the app open can be overwritten.)
2. Open `C:\rezure\etc\settings.json` and set:

   ```json
   "shareUsageData": false
   ```

3. Start Rezure again.

From then on nothing new is recorded and nothing queued is sent. The setting survives updates.
Rows queued before you turned it off stay in the local database, unsent.

## Feedback tickets

The **Feedback** page sends a ticket only when you click **Send ticket**. It contains:

- the device ID (always),
- the category, title, and description you wrote,
- the Rezure version and Windows version, if **Include Rezure version & OS info** is ticked (it is
  by default),
- any files you attached. **Attach latest log** adds the last 200 lines of the
  [Logs](/guide/logs) page, which can include folder paths; read it before sending.

**Your reports** on the same page lists your previous tickets and their status (Open, In
Progress, Resolved), looked up by the device ID. A draft you haven't sent is kept only on your
machine.

## Everything else Rezure connects to

None of these carry the device ID or any usage data:

| What | Where | When |
| --- | --- | --- |
| Update check | `api.redscale.my.id` | At start, and when you open Changelog |
| Changelog, new-major notice | `api.redscale.my.id` | At start / when you open Changelog |
| Donate page content | `api.redscale.my.id` | When you open Donate |
| Sticker catalog | `api.redscale.my.id` | When you open **Browse** on Decorations |
| Runtime lists and downloads | php.net, MariaDB, nodejs.org, getcomposer.org, EDB, GitHub, Microsoft, curl.se, wordpress.org | Only when you install something |
| Cloudflare | Cloudflare's tunnel network | Only while you [share](/guide/sharing) a project |
| Your remote databases and SSH servers | Wherever you pointed them | Only when you use a [connection](/guide/remote-databases) |

## Passwords stay on your machine

Saved database and SSH passwords go to **Windows Credential Manager**, under **Rezure Database
Connections**, never into Rezure's own files, and never off your PC. See
[Remote Databases](/guide/remote-databases#where-connections-are-stored).

The only place a saved database password leaves Rezure is when you click **Open** on a remote
connection: it's handed to the SQL client you picked on your own PC, so the client can connect.
See [Passwords and "Open with"](/guide/remote-databases#passwords-and-open-with).

## Related

- [Files & Folders](/guide/files-and-folders): where `device.json` and `settings.json` live
- [Updates & Changelog](/guide/updates): what the update check sends

---
title: "Settings: Startup, Tray, and .test Domains"
description: 'Every option on Rezure''s Settings page: start with Windows, keep running in the tray, crash notifications, automatic hosts entries, and the .test suffix.'
---

# Settings

The **Settings** page is short on purpose. Changes are saved the moment you make them.

## General

"How Rezure starts and what it does in the background."

| Option | Default | What it does |
| --- | --- | --- |
| **Start Rezure with Windows** | Off | Opens Rezure when you sign in to Windows. The window opens normally, and **services stay stopped** until you start them; use **Start all** on the Services page. |
| **Keep running in tray on close** | Off | Closing the window only hides it; services, tunnels, and shares keep running. Use **Show Rezure** or **Quit** from the tray icon. With it off, closing the window quits Rezure and stops everything. |
| **Notify when a service crashes** | Off | A Windows notification when a service exits unexpectedly ("{name} stopped unexpectedly"), and when PHP's automatic restarts give up. See [Services](/guide/services#when-a-service-crashes). |

## Domains

"Applied to every generated virtual host."

- **Domain suffix**: always `.test`, and not changeable. Browsers force `.dev` onto HTTPS, and
  `.local` is claimed by mDNS on many networks, so `.test` (reserved for exactly this) is the
  one that just works.
- **Auto-write hosts entries** (default off): "Syncs once at startup so new projects resolve
  without an extra UAC prompt each time." With it on, Rezure updates the `hosts` file once each
  time it starts, which means at most one administrator prompt at startup. Projects you add
  while Rezure is running still need **Sync hosts file** on the Projects page.

## Default port

A port field, default **80**, labelled "Used to pre-fill new virtual hosts". In the current
version every virtual host listens on port 80 regardless, so changing it has no effect yet.

## Where things live

"Read-only: Rezure scans these folders directly, so there's nothing to redirect."

| Row | Folder |
| --- | --- |
| Projects | `C:\rezure\www` |
| Downloaded binaries | `C:\rezure\bin` |
| PHP drop-in folder | `C:\rezure\custom` |
| Database exports | `C:\rezure\dumps` |

To move all of Rezure's data to another drive, set a `REZURE_HOME` environment variable before
starting Rezure. See [Files & Folders](/guide/files-and-folders).

## Settings that live elsewhere

| Looking for | Where |
| --- | --- |
| Theme, light/dark, brightness, interface size | [Appearance](/guide/appearance), and the **Light/Dark** button in the title bar |
| Active PHP, Node.js, PostgreSQL version | The [Switch](/guide/php-versions) page |
| Which services the Services page shows | **Manage services** on the [Services](/guide/services#manage-services) page |
| Your own `php.ini` values | `C:\rezure\etc\php\conf.d`. See [PHP Configuration](/guide/php-configuration) |
| Usage data | See [Privacy & Usage Data](/guide/privacy) |

There's no setting for your editor, terminal, or language; Rezure's interface is in English.

## Related

- [Files & Folders](/guide/files-and-folders): `settings.json` and the rest of `C:\rezure\etc`
- [Services](/guide/services): tray behaviour and crash handling

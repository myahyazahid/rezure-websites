---
title: Files and Folders
description: Where Rezure keeps your projects, databases, runtimes, settings, and logs on disk — the C:\rezure layout, what's safe to edit, and what Rezure changes outside that folder.
---

# Files and Folders

Rezure keeps everything it works with in **one folder**, `C:\rezure`, separate from the app's
install folder. Reinstalling, updating, or rolling back the app leaves it alone.

If `C:\` isn't writable on your machine, Rezure uses `%LOCALAPPDATA%\Rezure` instead. To put it
somewhere else entirely — another drive, say — set a `REZURE_HOME` environment variable to the
folder you want before starting Rezure.

## The layout

```
C:\rezure
├── www\          your projects
├── dumps\        database exports
├── bin\          runtimes Rezure downloaded and verified
├── custom\       runtimes you added yourself
├── data\         service state (generated)
├── etc\          settings and your own config
├── current\      the PHP link used by "PHP everywhere"
├── stickers\     downloaded stickers
├── rezure.db     projects and pending usage data
├── AGENTS.md     notes for AI coding agents
├── CLAUDE.md
└── docs\how-rezure-works.md
```

### `www\` — projects

Each folder is a project, served as `<folder>.test`. See [Projects](/guide/projects).

### `dumps\` — exports

Every database export, named `<database>-<YYYYMMDD-HHMMSS>.sql` (or `.bak` for SQL Server
LocalDB). Exports from a remote connection get the connection's name as a prefix.

### `bin\` — downloaded runtimes

One folder per runtime and version, all checked against a published checksum:
`bin\php\8.4.x`, `bin\mariadb\11.4.x`, `bin\postgres\18.6`, `bin\node\22.x`,
`bin\composer\2.x`, `bin\nginx`, `bin\mailpit`, `bin\cloudflared`.

Deleting a version's folder (with Rezure closed) removes that version completely.

### `custom\` — your own runtimes

Builds you downloaded yourself and want Rezure to use: `custom\php`, `custom\mysql`,
`custom\node`, and the same for the other runtimes. They're found automatically but not
checksum-verified.

### `data\` — service state

Generated and managed by Rezure. **Don't edit anything here by hand**; most of it is rewritten
on every start.

| Path | What |
| --- | --- |
| `data\nginx\` | Nginx config, one virtual host per project in `vhosts\`, and `logs\error.log` |
| `data\php\ini\` | The generated `php.ini` for each PHP version |
| `data\php\<version>\extensions.json` | Your extension toggles for that version |
| `data\php\tmp\` | PHP sessions and uploads in progress |
| `data\mariadb\data\` | The default MariaDB data directory — **your databases** |
| `data\postgres\<major>\` | PostgreSQL data, one folder per major version — **your databases** |
| `data\mssql\` | SQL Server LocalDB database files — **your databases** |
| `data\mailpit\mailpit.db` | Mail caught by Mailpit |
| `data\installers\` | Microsoft installers Rezure ran, and their logs |

The database folders hold your actual data. Back them up — or better, export the databases —
before deleting `data\`.

### `etc\` — settings

| File | What |
| --- | --- |
| `settings.json` | Your [Settings](/guide/settings), plus active versions, appearance, and which services the Services page shows |
| `profiles.json` | MySQL/MariaDB [data directory profiles](/guide/mariadb-mysql#data-directory-profiles) |
| `connections.json` | Saved [database connections](/guide/remote-databases) — never passwords |
| `links.json` | Projects linked from outside `www` |
| `project-frameworks.json` | Frameworks or custom folders you chose for a project. See [Frameworks](/guide/frameworks#change-a-project-s-framework) |
| `frameworks.json` | **Your own framework definitions**, if you add any — meant for hand edits. See [Frameworks](/guide/frameworks#add-a-framework-rezure-doesn-t-know) |
| `dev-servers.json` | Each JavaScript project's dev server port, script, and **Open starts it** setting. See [Dev Servers](/guide/dev-servers) |
| `php\conf.d\` | **Your own PHP settings** — the one place meant for hand edits. See [PHP Configuration](/guide/php-configuration#your-php-settings) |
| `cacert.pem` | The CA bundle PHP uses for HTTPS |
| `device.json` | This install's random ID, used for [usage data](/guide/privacy) and Feedback tickets |
| `stickers.json` | Your downloaded sticker library |
| `changelog_cache.json`, `changelog_state.json`, `donate_cache.json`, … | Cached copies of what the app fetched, so it works offline |

Rezure holds these settings in memory while it runs and writes them back when something
changes. **Quit Rezure** (from the tray, if it's kept there) before editing a JSON file in
`etc\`, or your edit may be overwritten.

### `rezure.db`

A small SQLite database with project details (usage counts, PHP and Node pins) and the queue of
usage data waiting to be sent.

### `AGENTS.md`, `CLAUDE.md`, `docs\`

Notes for AI coding agents, regenerated while Rezure runs. See
[AI Coding Agents](/guide/ai-agents).

## Outside `C:\rezure`

A few things live elsewhere because Windows requires it:

| What | Where | When |
| --- | --- | --- |
| Project domains | Rezure's block in `C:\Windows\System32\drivers\etc\hosts` | When you sync hosts |
| PHP on `PATH` | An entry in your **user** `PATH`, and `PHP_INI_SCAN_DIR` | Only with [Use Rezure's PHP everywhere](/guide/php-configuration#use-rezure-s-php-everywhere) on |
| Database passwords | Windows Credential Manager, under **Rezure Database Connections** | When you save a connection's password |
| Start with Windows | Your user's startup entries | Only with **Start Rezure with Windows** on |
| ODBC Driver, SQL Server LocalDB | Normal Windows installs, listed in **Settings → Apps**, plus a LocalDB instance named `Rezure` | Only if you install them |
| The app's own window state | WebView2's profile folder under `%LOCALAPPDATA%` | Always |

## Moving from an older version

Rezure versions before the single-folder layout used `%LOCALAPPDATA%\Rezure`,
`%APPDATA%\Rezure`, and `%USERPROFILE%\rezure`. A current version moves those into `C:\rezure`
on first start, never overwriting anything and never deleting on failure. See
[Installation](/guide/installation#upgrading-from-an-older-rezure).

## Related

- [Uninstall](/guide/uninstall) — removing all of this
- [Ports](/guide/ports) — the other half of "what does Rezure use"

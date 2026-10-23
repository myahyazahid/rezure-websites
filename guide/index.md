---
title: What is Rezure?
titleTemplate: false
description: An introduction to Rezure, the one-click local development environment manager for Windows — Nginx, PHP, MariaDB, PostgreSQL, SQL Server, Node.js, and Mailpit in one app.
---

# What is Rezure?

Rezure is a local development environment manager for Windows. It bundles the pieces a PHP
project needs (a web server, PHP, and a database) and puts them behind start/stop buttons
instead of config files and service consoles.

Rezure is built on Tauri and Rust, and leans on a few ideas of its own: runtime versions are
discovered rather than hard-coded, every download is checked against a published checksum,
port conflicts are reported before a service fails to start, and the pieces you don't ask for
are never downloaded.

## What you get

- **Services**: Nginx, PHP, MariaDB or MySQL, PostgreSQL, SQL Server LocalDB, and Mailpit,
  each with a status, a live log, and Start/Stop/Restart. **Start all** brings the whole stack
  up at once, and **Manage services** hides the ones you never use. See
  [Services](/guide/services).
- **Projects**: a folder in `C:\rezure\www` becomes `folder-name.test`, virtual host included.
  Folders that live elsewhere can be linked in place. New projects can start from a Laravel,
  WordPress, PHP, or HTML template. See [Projects](/guide/projects) and
  [New Project](/guide/new-project).
- **PHP**: install versions from php.net inside the app or drop in your own, switch the global
  default, and **pin** any project to its own version so several run at once. Extensions are
  toggles, not `.ini` edits. See [PHP Versions](/guide/php-versions),
  [PHP Per Project](/guide/project-php-version), and
  [PHP Extensions](/guide/php-extensions).
- **Databases**: create, export, and import on the local MariaDB, adopt an existing Laragon
  or XAMPP data directory, run [PostgreSQL](/guide/postgresql) and
  [SQL Server LocalDB](/guide/sql-server) beside it, and reach
  [remote servers](/guide/remote-databases) — including over an SSH tunnel.
- **Node.js and Composer**: install versions from their official release feeds, pin Node per
  project, and open a [project terminal](/guide/project-terminal) with the right PHP and Node
  already first on `PATH`. See [Node.js](/guide/nodejs).
- **Mail**: [Mailpit](/guide/mailpit) catches every email your app sends and shows it in a
  local inbox.
- **Checks**: a [Requirements Check](/guide/requirements-check) per project spots missing PHP
  extensions, broken HTTPS from PHP, and mail or database settings that won't connect — with
  a fix button where one exists.
- **Sharing**: expose a project temporarily on the internet with one click, via a Cloudflare
  Quick Tunnel — no account or router setup. See [Sharing a Project](/guide/sharing).
- **AI coding agents**: Rezure keeps an `AGENTS.md` describing your machine's setup, so tools
  like Claude Code know how your stack runs. See [AI Coding Agents](/guide/ai-agents).
- **Personal touches**: 14 themes, adjustable glass and brightness, and stickers you can place
  anywhere on the window. See [Appearance & Stickers](/guide/appearance).

## What it isn't

Rezure runs native binaries on your machine, not containers: there's no Docker mode. It
targets Windows only, and it's built for local development — not as a production web host.
Sites are served over plain HTTP on `.test` domains; there's no local HTTPS yet. The Share
feature is for short-lived demos and previews, not permanent public deployment.

## Next steps

- [Installation](/guide/installation): download, install, and check it started cleanly
- [First Run](/guide/first-run): start your services and serve a first project
- [Services](/guide/services): everything the Services page does
- [Laravel .env Cheatsheet](/guide/laravel-env): the connection values for every database and
  for Mailpit, in one place
- [Troubleshooting](/guide/troubleshooting) and [FAQ](/guide/faq): when something doesn't
  behave

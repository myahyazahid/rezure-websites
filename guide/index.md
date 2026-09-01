---
title: What is Rezure?
description: An introduction to Rezure, a local development environment manager for Windows.
---

# What is Rezure?

Rezure is a local development environment manager for Windows. It bundles the pieces a PHP
project needs — a web server, PHP, and a database — and puts them behind start/stop buttons
instead of config files and service consoles.

If you've used Laragon, the shape will feel familiar. Rezure is built on Tauri and Rust, and
leans on a few ideas of its own: runtime versions are discovered rather than hard-coded,
port conflicts are reported before a service fails to start, and the pieces you don't ask
for are never downloaded.

## What you get

- **Services** — Nginx, PHP-FPM, and MariaDB, each with a status indicator and a live log
  view. Nginx and PHP 8.3 come inside the installer; MariaDB downloads on first use.
- **Projects** — a folder in `C:\rezure\www` becomes `folder-name.test`, virtual host and
  Windows `hosts` entry included. Folders that live elsewhere can be linked in place.
- **PHP versions** — install extra versions from php.net inside the app, or drop a build you
  already have into `C:\rezure\custom\php`, then pick which one is active.
- **Databases** — list, create, drop, export, and import schemas on the bundled MariaDB, and
  open one in the SQL client you already have installed.

## What it isn't

Rezure runs native binaries on your machine, not containers — there's no Docker mode yet. It
targets Windows only, and it's meant for local development, never for serving anything to
the public internet.

## Next steps

- [Installation](/guide/installation) — download, install, and check it started cleanly
- [First Run](/guide/first-run) — start your services and serve a first project

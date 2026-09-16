---
title: What is Rezure?
titleTemplate: false
description: An introduction to Rezure, the one-click local development environment manager for Windows that bundles Nginx, PHP, and MariaDB.
---

# What is Rezure?

Rezure is a local development environment manager for Windows. It bundles the pieces a PHP
project needs (a web server, PHP, and a database) and puts them behind start/stop buttons
instead of config files and service consoles.

Rezure is built on Tauri and Rust, and leans on a few ideas of its own: runtime versions are
discovered rather than hard-coded, port conflicts are reported before a service fails to
start, and the pieces you don't ask for are never downloaded.

## What you get

- **Services**: Nginx, PHP-FPM, and MariaDB, each with a status indicator and a live log
  view. Nginx and PHP 8.3 come inside the installer; MariaDB downloads on first use.
- **Projects**: a folder in `C:\rezure\www` becomes `folder-name.test`, virtual host and
  Windows `hosts` entry included. Folders that live elsewhere can be linked in place.
- **PHP versions**: install extra versions from php.net inside the app, or drop a build you
  already have into `C:\rezure\custom\php`, then pick which one is active globally. Each
  project can also be **pinned** to its own version so several projects run on different PHP
  releases at once. See [PHP Per Project](/guide/project-php-version).
- **Databases**: list, create, drop, export, and import schemas on the bundled MariaDB, and
  open one in the SQL client you already have installed. Saved **remote connections** — with
  optional **SSH tunnel** — use the same page for staging servers and VPS databases. See
  [Remote Databases](/guide/remote-databases).
- **Sharing**: expose a running project temporarily on the internet with one click, via a
  Cloudflare Quick Tunnel — no account or router setup. See
  [Sharing a Project](/guide/sharing).

## What it isn't

Rezure runs native binaries on your machine, not containers: there's no Docker mode yet. It
targets Windows only, and it's built for local development — not as a production web host.
The Share feature is for short-lived demos and previews, not permanent public deployment.

## Next steps

- [Installation](/guide/installation): download, install, and check it started cleanly
- [First Run](/guide/first-run): start your services and serve a first project
- [Sharing a Project](/guide/sharing): send a temporary public link via Cloudflare Quick Tunnel
- [Remote Databases](/guide/remote-databases): connect to staging or a VPS, including over SSH
- [PHP Per Project](/guide/project-php-version): run different projects on different PHP versions at once
- [FAQ](/guide/faq): what Rezure installs, what it doesn't do, and how it handles ports

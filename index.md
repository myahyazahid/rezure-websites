---
# Rendered by .vitepress/theme/Landing.vue — VitePress resolves an unknown
# `layout` name to a globally registered component. All copy lives here; the
# component only owns the arrangement.
layout: Landing

# `titleTemplate: false` keeps the home <title> from picking up the " | Rezure"
# suffix that every other page gets.
title: Rezure — Local Development Environment for Windows
titleTemplate: false
description: Free, open-source local development environment manager for Windows. Run Nginx, PHP, MariaDB, PostgreSQL, SQL Server, Node.js, and Mailpit with one click, no manual setup.

hero:
  eyebrow: Open source · For Windows
  headline: Local dev environment for chill devs
  tagline: Nginx, PHP, and your database running on Windows with one click. Portable, lightweight, no manual setup.
  actions:
    - text: Download
      link: /download
      theme: brand
    - text: Get started
      link: /guide/
      theme: alt
    - text: View on GitHub
      link: https://github.com/myahyazahid/rezure
      theme: ghost

# Illustration in the hero, not a screenshot — it stands in for the service
# manager screen. Replace with a real capture of the app when one exists.
# Versions and ports mirror what Rezure 3.1 actually ships and listens on.
services:
  - name: Nginx
    version: 1.25.3
    port: '80'
    running: true
    icon: nginx
  - name: PHP
    version: 8.3.33
    port: '9100'
    running: true
    icon: php
  - name: MariaDB
    version: 11.2.2
    port: '3306'
    running: true
    icon: mariadb
  - name: PostgreSQL
    version: '18.6'
    port: '5432'
    running: false
    icon: postgresql

featuresTitle: Everything the stack needs, in one window

features:
  - title: One-click service manager
    icon: power
    details: Start, stop, and restart Nginx, PHP, your databases, and Mailpit from one screen — one at a time or all at once — with a log for every service and automatic PHP restarts after a crash.
  - title: Port conflicts caught early
    icon: docker
    details: Rezure checks every port before a service starts, names whatever is holding it — Laragon, XAMPP, Docker, IIS — and can stop it for you with one click.
  - title: Automatic virtual hosts
    icon: nginx
    details: Every folder in your www directory becomes its own .test site, and folders elsewhere can be linked in place. Rezure writes the Nginx config and keeps the Windows hosts file in sync.
  - title: PHP per project
    icon: php
    details: Install any PHP version straight from php.net, toggle its extensions without editing an .ini, and pin each project to its own version — several versions serve at the same time.
  - title: MariaDB and MySQL
    icon: mariadb
    details: Create, export, and import databases, open them in the SQL client you already use, and point Rezure at an existing Laragon or XAMPP data directory without copying a byte.
  - title: PostgreSQL and SQL Server
    icon: postgresql
    details: PostgreSQL 16, 17, and 18 and SQL Server LocalDB run beside MariaDB, with the PHP drivers for both installed from inside the app.
  - title: Node.js, Composer, and a project terminal
    icon: nodedotjs
    details: Install Node.js and Composer versions, pin Node per project, and open a terminal in any project with the right PHP and Node already first on PATH.
  - title: Share and test without deploying
    icon: share
    details: Send a project to anyone with a temporary Cloudflare link, and catch every email your app sends in a local Mailpit inbox instead of someone's real mailbox.
  - title: Portable and lightweight
    icon: tauri
    details: Every download is checked against a published checksum, everything lives in one folder, and Tauri's native webview keeps the app small and easy on memory.

whyTitle: Why Rezure
whyLede: A one-click local stack on Windows should feel effortless. Rezure builds that on a modern foundation — Tauri and Rust — with a few things we wanted for our own day-to-day work.

reasons:
  - title: Nothing to download before you start
    details: Nginx and PHP 8.3 ship inside the installer, so serving a site works the moment setup finishes. Extra PHP versions, databases, Node.js, and Mailpit are pulled on demand, only if you ask for them.
  - title: Runtime versions you can actually see
    details: The installable lists come live from php.net, MariaDB, and nodejs.org, checksums included, and builds you drop into a folder yourself are picked up too.
  - title: A small footprint
    details: A native webview instead of a bundled browser engine keeps both the binary and the memory use modest.

cta:
  title: Ready to try it?
  text: Rezure is in active development and open source. Bug reports and pull requests are welcome on GitHub.
  action:
    text: Download for Windows
    link: /download
  note: Windows 10 (1809+) or Windows 11, 64-bit · Free and open source
---

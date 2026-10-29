---
# Rendered by .vitepress/theme/Landing.vue: VitePress resolves an unknown
# `layout` name to a globally registered component. All copy lives here; the
# component only owns the arrangement.
layout: Landing

# `titleTemplate: false` keeps the home <title> from picking up the " | Rezure"
# suffix that every other page gets.
title: Rezure | Best Local Development Server
titleTemplate: false
description: 'Rezure is the best local development server for Windows: Nginx, PHP, MySQL, PostgreSQL, SQL Server, Node.js, and Mailpit in one click. Free, open source.'

hero:
  eyebrow: Free · Open source · For Windows
  headline: The best local development server
  tagline: Nginx, PHP, MySQL, PostgreSQL, SQL Server, Node.js, and Mailpit, installed, running, and wired to a .test domain for every project. No config files, no Docker.
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

# Illustration in the hero, not a screenshot; it stands in for the service
# manager screen. Replace with a real capture of the app when one exists.
# Versions and ports mirror what Rezure 3.x actually ships and listens on.
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

featuresTitle: Everything a developer needs, in one window

features:
  - title: One-click service manager
    link: /guide/services
    icon: power
    details: Start, stop, and restart Nginx, PHP, your databases, and Mailpit from one screen, one at a time or all at once, with a log for every service and automatic PHP restarts after a crash.
  - title: Port conflicts caught early
    link: /guide/port-conflicts
    icon: docker
    details: Rezure checks every port before a service starts, names whatever is holding it (Laragon, XAMPP, Docker, IIS), and can stop it for you with one click.
  - title: Virtual hosts that know your framework
    link: /guide/frameworks
    icon: nginx
    details: Every folder in your www directory becomes its own .test site, and folders elsewhere can be linked in place. Laravel, CodeIgniter, Symfony, WordPress, and Drupal are detected and served from the right folder, with the Windows hosts file kept in sync.
  - title: PHP per project
    link: /guide/project-php-version
    icon: php
    details: Install any PHP version straight from php.net, toggle its extensions without editing an .ini, and pin each project to its own version. Several versions serve at the same time.
  - title: MariaDB and MySQL
    link: /guide/mariadb-mysql
    icon: mariadb
    details: Create, export, and import databases, open them in the SQL client you already use, and point Rezure at an existing Laragon or XAMPP data directory without copying a byte.
  - title: PostgreSQL and SQL Server
    link: /guide/postgresql
    icon: postgresql
    details: PostgreSQL 16, 17, and 18 and SQL Server LocalDB run beside MariaDB, with the PHP drivers for both installed from inside the app.
  - title: Vite, Next.js, and Node on .test
    link: /guide/dev-servers
    icon: nodedotjs
    details: Open Vite, Next.js, Nuxt, and Astro apps at their own .test domain. Rezure starts the dev server, keeps hot reload working, and runs it on the project's pinned Node.js. Composer and a project terminal come too.
  - title: Share and test without deploying
    link: /guide/sharing
    icon: share
    details: Send a project to anyone with a temporary Cloudflare link, and catch every email your app sends in a local Mailpit inbox instead of someone's real mailbox.
  - title: Portable and lightweight
    link: /guide/installation
    icon: tauri
    details: Every download is checked against a published checksum, everything lives in one folder, and Tauri's native webview keeps the app small and easy on memory.

whyTitle: Why Rezure
whyLede: One app should be enough to build anything locally on Windows, from a Laravel API to a WordPress site or a Next.js front end, without juggling XAMPP, a Node install, and three database servers. Rezure builds that on Tauri and Rust, and reads your existing Laragon or XAMPP databases if you're coming from one of them.

reasons:
  - title: Nothing to download before you start
    details: Nginx and PHP 8.3 ship inside the installer, so serving a site works the moment setup finishes. Extra PHP versions, databases, Node.js, and Mailpit are pulled on demand, only if you ask for them.
  - title: Runtime versions you can actually see
    details: The installable lists come live from php.net, MariaDB, and nodejs.org, checksums included, and builds you drop into a folder yourself are picked up too.
  - title: A small footprint
    details: A native webview instead of a bundled browser engine keeps both the binary and the memory use modest.

cta:
  title: Your whole dev stack, one download
  text: Rezure is free, open source, and in active development. Bug reports and pull requests are welcome on GitHub.
  action:
    text: Download for Windows
    link: /download
  note: Windows 10 (1809+) or Windows 11, 64-bit · Free and open source
---

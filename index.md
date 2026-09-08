---
# Rendered by .vitepress/theme/Landing.vue — VitePress resolves an unknown
# `layout` name to a globally registered component. All copy lives here; the
# component only owns the arrangement.
layout: Landing

# `titleTemplate: false` keeps the home <title> from picking up the " | Rezure"
# suffix that every other page gets.
title: Rezure — Local Development Environment for Windows
titleTemplate: false
description: Free, open-source local development environment manager for Windows. Run Nginx, PHP, and MariaDB with one click, no manual setup.

hero:
  eyebrow: Open source · For Windows
  headline: Local dev environment for chill devs
  tagline: Nginx, PHP, and MariaDB running on Windows with one click. Portable, lightweight, no manual setup.
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
services:
  - name: Nginx
    version: 1.27.3
    port: '80'
    running: true
    icon: nginx
  - name: PHP-FPM
    version: 8.3.14
    port: '9000'
    running: true
    icon: php
  - name: MariaDB
    version: 11.6.2
    port: '3306'
    running: true
    icon: mariadb

featuresTitle: Everything the stack needs, in one window

features:
  - title: One-click service manager
    icon: power
    details: Start and stop Nginx, PHP-FPM, and MariaDB from a single screen, with live status indicators and a per-service log viewer.
  - title: Port conflicts caught early
    icon: docker
    details: Rezure checks the port before starting a service, so a stray XAMPP or Docker container gets reported instead of a silent failure.
  - title: Automatic virtual hosts
    icon: nginx
    details: Drop a project into your working folder and Rezure generates the vhost config and updates the Windows hosts file for you.
  - title: PHP version switcher
    icon: php
    details: Install any version straight from php.net inside the app, or drop in one you already downloaded, and switch per project.
  - title: Database management
    icon: mariadb
    details: List, create, export, and import databases on the bundled MariaDB, then open one in TablePlus, DBeaver, HeidiSQL, or whichever client you already use.
  - title: Portable and lightweight
    icon: tauri
    details: Bundled binaries mean nothing to install by hand, and Tauri's native webview keeps the app small and easy on memory.

whyTitle: Why Rezure
whyLede: A one-click local stack on Windows should feel effortless. Rezure builds that on a modern foundation — Tauri and Rust — with a few things we wanted for our own day-to-day work.

reasons:
  - title: Nothing to download before you start
    details: Nginx and PHP 8.3 ship inside the installer, so serving a site works the moment setup finishes. Extra PHP versions and MariaDB are pulled on demand, only if you ask for them.
  - title: Runtime versions you can actually see
    details: Installed PHP versions are discovered by scanning your download cache and a drop-in folder, and the installable list comes live from php.net's own release feed, checksums included.
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

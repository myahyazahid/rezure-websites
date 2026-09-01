---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Rezure"
  text: "Local dev environment for chill devs"
  tagline: Nginx, PHP, and MariaDB running on Windows with one click — portable, lightweight, no manual setup.
  actions:
    - theme: brand
      text: Download
      link: /download
    - theme: alt
      text: View on GitHub
      link: https://github.com/myahyazahid/rezure
    - theme: alt
      text: Get Started
      link: /guide/

features:
  - title: One-click service manager
    details: Start and stop Nginx, PHP-FPM, and MariaDB from a single screen, with live status indicators and a per-service log viewer.
  - title: Port conflicts caught early
    details: Rezure checks the port before starting a service, so a stray XAMPP or Docker container gets reported instead of a silent failure.
  - title: Automatic virtual hosts
    details: Drop a project into your working folder and Rezure generates the vhost config and updates the Windows hosts file for you.
  - title: PHP version switcher
    details: Install any version straight from php.net inside the app, or drop in one you already downloaded — Laragon style — and switch per project.
  - title: Database management
    details: List, create, export, and import databases on the bundled MariaDB, then open one in TablePlus, DBeaver, HeidiSQL, or whichever client you already use.
  - title: Portable and lightweight
    details: Bundled binaries mean nothing to install by hand, and Tauri's native webview keeps the app small and easy on memory.
---

## Why Rezure

Laragon proved how good a one-click local stack on Windows can feel. Rezure takes that idea
and rebuilds it on a modern foundation — Tauri and Rust instead of Delphi — with a few
things we wanted for our own day-to-day work:

- **Nothing to download before you start.** Nginx and PHP 8.3 ship inside the installer, so
  serving a site works the moment setup finishes. Extra PHP versions and MariaDB are pulled
  on demand, only if you ask for them.
- **Runtime versions you can actually see.** Installed PHP versions are discovered by
  scanning your download cache and a drop-in folder, and the installable list comes live
  from php.net's own release feed — checksums included.
- **A small footprint.** A native webview instead of a bundled browser engine keeps both the
  binary and the memory use modest.

Rezure is in active development and open source. Bug reports and pull requests are welcome
on [GitHub](https://github.com/myahyazahid/rezure).

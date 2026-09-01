---
title: First Run
description: Start your services, serve a first project, and connect to the database.
---

# First Run

This walks through the first five minutes with Rezure: start the services, put a project
online, and connect to the database.

## 1. Start the services

Open the **Services** page. Nginx and PHP are already installed: hit **Start** on each and
their indicators turn green.

If a service refuses to start, Rezure tells you which port is taken and stops there rather
than failing quietly. Port 80 is almost always Laragon, XAMPP, or IIS; stop whichever one is
running and try again.

MariaDB isn't bundled: the first time you start it, Rezure downloads it. That's a one-time
wait of a minute or two, and only if you need a database.

## 2. Add a project

There are two ways to get a project listed:

**Drop it in `www`.** Create `C:\rezure\www\myapp` and it shows up on the **Projects** page
as `myapp.test`. Nothing to configure.

**Link a folder you already have.** Use **Add folder** on the Projects page and pick the
folder wherever it lives. Rezure shows you the name, the detected stack, the document root
it will serve, and the domain, all editable, before saving anything. Nothing is copied or
moved; only the path is recorded.

Either way Rezure works out the document root for you. For a Laravel project that's
`public/`, not the folder itself.

## 3. Open it

Click the project's domain, say `myapp.test`, and it opens in your browser. Behind that,
Rezure generated an Nginx virtual host for the project and added a line to the Windows
`hosts` file. If Windows asks for administrator rights at this point, that's the `hosts`
edit; approve it or the domain won't resolve.

If the domain doesn't load, the usual causes are: Nginx isn't running, the `hosts` edit was
declined, or the browser is caching an old failure: try a private window.

## 4. Connect to the database

Start MariaDB, then open the **Databases** page. The bundled server runs with default local
credentials:

```
Host: 127.0.0.1
Port: 3306
User: root
Password: (empty)
```

In a Laravel `.env` that's:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

**New database** creates a schema, and each one lists its table count, size, and the project
that appears to use it. **Open** hands the database to whichever SQL client you have
installed (TablePlus, DBeaver, HeidiSQL, MySQL Workbench, or Navicat) with the bundled
`mariadb` console always available as a fallback.

An empty password and a root login are fine on a machine only you can reach. Don't reuse
this setup anywhere that isn't your own laptop.

## 5. Switch PHP versions (optional)

The **PHP** page lists every version Rezure can see and every version it can install. The
installable list comes live from php.net's own release feed, so it carries a real SHA-256
per build and never goes stale.

Two ways to add one:

- **Install from the app**: pick a version and Rezure downloads and verifies it.
- **Drop one in**: put a PHP build you downloaded yourself into `C:\rezure\custom\php`,
  Laragon style, and Rezure picks it up on the next scan.

Switching the active version restarts PHP-FPM only. Nginx reconnects on the next request, so
your virtual hosts stay up.

## Where to go next

That's the core loop. From here, browse the project list, add more PHP versions, or open an
issue on [GitHub](https://github.com/myahyazahid/rezure/issues) if something didn't behave
the way this page describes.

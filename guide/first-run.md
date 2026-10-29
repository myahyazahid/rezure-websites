---
title: "First Run: Serve Your First PHP Site Locally"
description: Start Nginx, PHP, and MariaDB, serve your first .test project, connect to the database, switch PHP versions, and catch outgoing mail.
---

# First Run

This walks through the first five minutes with Rezure: start the services, put a project
online, and connect to the database.

## 1. Start the services

Open the **Services** page. Nginx and PHP are already installed: hit **Start** on each, or
**Start all** in the toolbar, and their status turns to **Running**.

If a service refuses to start, Rezure tells you which port is taken and which program holds
it, rather than failing quietly. Port 80 is almost always another local server stack or IIS.
For most programs Rezure offers a **Stop it and start Nginx** button that frees the port for
you; see [Port Conflicts](/guide/port-conflicts) for the details.

MariaDB isn't bundled: the first time you start it, Rezure downloads it. That's a one-time
wait of a minute or two, and only if you need a database.

## 2. Add a project

There are three ways to get a project listed:

**Drop it in `www`.** Create `C:\rezure\www\myapp` and it shows up on the **Projects** page
as `myapp.test`. Nothing to configure.

**Link a folder you already have.** Use **Add folder** on the Projects page and pick the
folder wherever it lives. Rezure shows you the name, the detected framework, the folder it
will serve, and the domain, all editable, before saving anything. Nothing is copied or
moved; only the path is recorded.

**Start a new one.** **New project** creates a Laravel, WordPress, blank PHP, or static HTML
project in `www` for you. See [New Project](/guide/new-project).

Either way Rezure works out the document root for you from the project's
[framework](/guide/frameworks). For Laravel, CodeIgniter 4, and Symfony that's `public/`, not
the folder itself, and a Vite or Next.js project is served by its
[dev server](/guide/dev-servers). Folder names should stick to letters, digits, and hyphens:
an underscore or a space makes an invalid domain, and the project is listed as **Not served**.

## 3. Make the domain resolve

Rezure writes an Nginx virtual host for every project automatically, but the `.test` domain
also needs a line in the Windows `hosts` file before your browser can find it.

On the **Projects** page, a domain shown in a muted colour isn't in the `hosts` file yet.
Click **Sync hosts file** at the top of the page. Windows asks for administrator approval;
click **Yes**, or the domain won't resolve. Once it's done the domain switches to the accent
colour, and the button greys out with "Every domain already resolves".

You only need to do this when you add a project. If you'd rather not click it each time, turn
on **Auto-write hosts entries** in [Settings](/guide/settings): Rezure then syncs once each
time it starts.

## 4. Open it

Click **Open** on the project's row and it opens `http://myapp.test` in your default browser.

If the domain doesn't load, the usual causes are: Nginx or PHP isn't running, the `hosts`
sync was declined, or the browser is caching an old failure: try a private window. A
**502 Bad Gateway** means Nginx is up but the PHP service the project uses isn't.

## 5. Connect to the database

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
**MariaDB console** always available as a fallback. **Export** writes a `.sql` dump to
`C:\rezure\dumps`, and **Import .sql** loads one back.

An empty password and a root login are fine on a machine only you can reach. Don't reuse
this setup anywhere that isn't your own laptop.

Using PostgreSQL or SQL Server instead? See [PostgreSQL](/guide/postgresql),
[SQL Server](/guide/sql-server), and the [Laravel .env Cheatsheet](/guide/laravel-env). Need a
database on a staging server or VPS? See [Remote Databases](/guide/remote-databases).

## 6. Switch PHP versions (optional)

The **Switch** page shows the active version of each runtime. Click **Install version**, pick
**PHP**, and Rezure lists what php.net currently publishes: the newest release of each
branch, with a real SHA-256 per build, so the list never goes stale.

Two ways to add one:

1. **Install from the app**: pick a version and Rezure downloads and verifies it.
2. **Drop one in**: use **Add from folder…** in the same dialog, or put a PHP build you
   downloaded yourself into `C:\rezure\custom\php`. Rezure picks it up on the next scan.

Then pick the version in the PHP row's dropdown. Switching the **global default** restarts the
main **PHP** service only. Projects set to **Default** follow that version. To keep a specific
project on a different version while you change the default for everything else, pin it on
the **Projects** page. See [PHP Versions](/guide/php-versions) and
[PHP Per Project](/guide/project-php-version).

## 7. Catch outgoing mail (optional)

Click **Install** on the **Mailpit** row of the Services page, then **Start**. Point your
project's `.env` at it:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

Every email the project sends now lands in the inbox at `http://127.0.0.1:8025`; the
**Open** button on the Mailpit row takes you there. See [Mailpit](/guide/mailpit).

## Where to go next

That's the core loop. From here, run a [Requirements Check](/guide/requirements-check) on a
project, open a [project terminal](/guide/project-terminal), or
[share a project publicly](/guide/sharing) when you need a temporary link for someone outside
your network. Read the [FAQ](/guide/faq), or open an issue on
[GitHub](https://github.com/myahyazahid/rezure/issues) if something didn't behave the way
this page describes.

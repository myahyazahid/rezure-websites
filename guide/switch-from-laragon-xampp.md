---
title: Switching from Laragon or XAMPP to Rezure
titleTemplate: false
description: Moving from Laragon or XAMPP to Rezure on Windows — keep your existing MySQL databases and project folders, avoid port conflicts, and know what's different, like Nginx instead of Apache.
---

# Switching from Laragon or XAMPP

Rezure is a local development environment for Windows, like Laragon and XAMPP: a web server,
PHP, and a database behind start/stop buttons. If you already use one of them, you don't have
to start over. Rezure can serve your existing projects in place and open your existing MySQL
data directory without copying it, and you can keep the old stack installed while you try it.

## What carries over

| You have | In Rezure |
| --- | --- |
| Projects in `C:\laragon\www` or `C:\xampp\htdocs` | Link each folder in place from the **Projects** page — nothing is copied or moved. See [Add an existing folder](/guide/projects#add-an-existing-folder). |
| Laragon's or XAMPP's MySQL / MariaDB databases | **Add data directory** finds them at their default locations and serves them with that tool's own server binary and `my.ini`. See [Use a Laragon or XAMPP data directory](/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory). |
| `root` with an empty password | An adopted data directory keeps its own users and passwords, so your `.env` files keep working. |
| HeidiSQL, DBeaver, or another SQL client | Rezure finds installed clients, including Laragon's bundled HeidiSQL, and opens a database in them. |
| `.test` domains | Rezure uses `.test` too — a folder named `myapp` becomes `myapp.test`. |

## Step by step

1. **Install Rezure.** Follow [Installation](/guide/installation). Nginx and PHP 8.3 ship
   inside the installer.
2. **Stop Laragon or XAMPP.** Both stacks want port 80 and port 3306, and only one program can
   hold a port. You don't need to uninstall anything. If you forget, Rezure names the program
   holding the port — "port 80 is held by Laragon (nginx.exe, pid 10244)" — and offers to stop
   it. See [Port Conflicts](/guide/port-conflicts).
3. **Adopt your databases.** On the **Databases** page, open the target switcher, click
   **+ Add data directory**, and add the Laragon or XAMPP install Rezure finds. Switch to it.
4. **Link your projects.** On the **Projects** page, add each existing project folder. Rezure
   writes the Nginx virtual host; click **Sync hosts file** so the domain resolves.
5. **Pick a PHP version.** Install the PHP versions your projects need from the **Switch**
   page, and [pin a version per project](/guide/project-php-version) if they differ.
6. **Run the [Requirements Check](/guide/requirements-check)** on each project to catch a
   missing PHP extension or a database setting that won't connect.

## What's different

- **Nginx, not Apache.** Rezure's web server is Nginx. Laravel, WordPress, and most PHP apps
  run on it without changes, but `.htaccess` files are ignored. Custom Apache rewrite rules
  need an Nginx equivalent.
- **PHP listens on port 9100 and up**, not 9000, so it never collides with the PHP that
  Laragon or XAMPP runs there.
- **Several PHP versions at once.** Each project can be [pinned](/guide/project-php-version)
  to its own PHP version, and they serve side by side.
- **PostgreSQL and SQL Server** run beside MariaDB, installed from inside the app. See
  [PostgreSQL](/guide/postgresql) and [SQL Server](/guide/sql-server).
- **No local HTTPS yet.** Sites are served over plain `http://`.
- **Windows only**, like Laragon. There are no macOS or Linux builds.

## Running both

You can keep Laragon or XAMPP installed and switch back whenever you like — just don't run
both stacks at once. One thing to watch: both Laragon and XAMPP can rewrite the Windows
`hosts` file and remove Rezure's entries. If Rezure's domains keep dropping out of the `hosts` file,
stop the other tool or turn off its own hosts management. See
[Projects](/guide/projects#the-hosts-prompt-keeps-coming-back).

An adopted data directory can only be served by one server at a time. Rezure checks this
before switching and refuses while Laragon's or XAMPP's database server is still running
against the same folder.

## Related

- [What is Rezure?](/guide/)
- [MariaDB & MySQL](/guide/mariadb-mysql)
- [Port Conflicts](/guide/port-conflicts)
- [FAQ](/guide/faq)

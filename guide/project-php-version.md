---
title: PHP Version Per Project
description: Pin each Rezure project to its own PHP version so several projects run on different PHP releases at the same time on Windows — for the browser and for the project's terminal.
---

# PHP Version Per Project

Rezure can serve different projects on different PHP versions at the same time. One legacy app
can stay on PHP 7.4 while a new Laravel app runs on PHP 8.4, without switching a single global
version back and forth.

Each project either follows the **global default** (the active version on the **Switch** page)
or is **pinned** to a specific installed version. The pin applies to the project's site and to
the [terminal](/guide/project-terminal) you open from its card.

## Global default vs per project pin

**Global default** lives on the **Switch** page. It controls which PHP build the main
**PHP** service runs. Every project set to **Default** is served by that service.

**Per project pin** lives on the **Projects** page. When you pin a project to a version that
is not the current global default, Rezure gives that version its own service — **PHP 8.1.34**,
say — and Nginx routes the project's virtual host to it.

Projects pinned to the same version share one service. Pinning a project to the same
version as the global default doesn't add anything; it uses the main **PHP** service like any
unpinned project.

## Before you pin a version

1. Install every PHP version you need. Open the **Switch** page and use **Install version**,
   or drop a build into `C:\rezure\custom\php`. See [PHP Versions](/guide/php-versions).
2. Start **Nginx** and the **PHP** service on the **Services** page. Unpinned projects need
   the main **PHP** service running.

## Pin a project to a PHP version

1. Open the **Projects** page.
2. Find the project and click its **PHP version** icon ("Pin this project to its own PHP
   version"). When a version is pinned, the icon is filled in so you can see it at a glance,
   and its tooltip reads "Pinned to PHP X — click to change".
3. In the **PHP version** dialog, choose **Default · follows the global active version**, or
   one of the installed versions. The current global default is marked "· currently the
   global default", and the option in use is tagged **Current**.
4. Clicking an option applies it straight away and closes the dialog. Rezure saves the
   choice, rewrites the project's Nginx config, and adds or removes PHP services as needed.
5. **Start the new service.** A row such as **PHP 8.1.34** appears on the **Services** page.
   It is **not started automatically** — click its **Start**, or use **Start all**. Until it
   runs, the project answers with **502 Bad Gateway**.

To clear a pin, open the dialog again and choose **Default**. The extra service stops and
disappears once no project uses it.

## Run several versions at once

Example setup:

| Project | Pinned version | Served by |
| --- | --- | --- |
| legacy-shop | PHP 7.4.33 | **PHP 7.4.33** (ports 9110–9113) |
| new-api | Default (PHP 8.4.x) | **PHP** (ports 9100–9103) |
| experiment | PHP 8.5.x | **PHP 8.5.x** (ports 9120–9123) |

With Nginx and each required PHP service running, all three projects answer at the same time,
each on its own version.

Changing the global default on the **Switch** page only affects projects set to **Default**.
Pinned projects keep their version until you change the pin.

## What Rezure does in the background

Windows has no PHP-FPM, so Rezure runs `php-cgi` as a FastCGI listener. Every PHP service is
a small pool of **4 workers**, each on its own port, and Nginx spreads requests across them
(`least_conn`). The Services row shows the range and the worker count, for example
`:9100–9103 · 4/4 workers`.

- The main **PHP** service always uses ports **9100–9103**.
- Each pinned version gets the next free block of ten — 9110–9113, 9120–9123, and so on. A
  running version keeps its block when you pin or unpin other projects.
- Port 9000 is avoided on purpose, so Rezure doesn't collide with Laragon or XAMPP, and 9003
  stays free for Xdebug.

If a worker crashes, Rezure restarts it on its own; the worker count turns amber while that
happens, and the other workers keep serving. See [Services](/guide/services#when-a-service-crashes).

Each PHP install also gets its **own generated `php.ini`**, so versions never load each
other's extensions. Extensions are switched per version on the
[PHP Extensions](/guide/php-extensions) page.

The pin is stored in Rezure's local database, keyed by the project, not in the project folder.

## Limitations and notes

**Install the version first.** The dialog only lists PHP builds Rezure already has on disk. If
nothing is installed yet, it says "No PHP versions installed yet — install one from the Switch
page first."

**Start every PHP service you need.** A pinned project returns a 502 if its PHP service is
stopped while Nginx is still running.

**Terminals.** The terminal you open from a project's card puts the pinned version first on
`PATH`, so `php artisan` there runs on the same version as the site. Any other terminal uses
whatever `php` your system `PATH` provides — with
[Use Rezure's PHP everywhere](/guide/php-configuration#use-rezure-s-php-everywhere) on, that's
the **global** version, never a project's pin.

**Things that use the global version.** Creating a Laravel project with **New project** and
the project's [Requirements Check](/guide/requirements-check) both run on the global active
PHP, even for a pinned project. To check a pinned project's extensions, run `php -m` in its
project terminal.

**Removing a PHP version.** If you delete a build that a project was pinned to, the project
falls back to the global version until you pin it again.

**Renaming a project folder in `www`** gives it a new identity, so its pin doesn't follow.
Pin it again after renaming.

## Troubleshooting

### The project shows a 502 Bad Gateway after pinning

Check the **Services** page. Start the PHP service for that version (for example
**PHP 8.1.34**), not only the main **PHP** row. Confirm Nginx is running.

### The dialog says no PHP versions are installed

Install at least one extra version from the **Switch** page, or use **Default** until you do.

### Pinning seems to have no effect

Make sure you picked a version **different** from the current global default. Pinning the same
version as the default is equivalent to **Default** and does not create a separate service.

### I changed the global default and one project did not change

That project is pinned. Open its PHP version dialog and switch it to **Default** if you want
it to follow the global version again.

### An extension works in the browser but not in the terminal (or the other way round)

Extension toggles on the PHP Extensions page apply to the sites and to PHP processes Rezure
starts itself. The `php.ini` a terminal reads isn't changed by those toggles. See
[PHP Extensions](/guide/php-extensions#browser-vs-terminal).

## Related

- [PHP Versions](/guide/php-versions): install PHP versions and set the global default
- [Project Terminal](/guide/project-terminal): a shell with the project's PHP and Node first
- [Ports](/guide/ports): every port Rezure uses

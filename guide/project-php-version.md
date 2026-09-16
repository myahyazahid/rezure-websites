---
title: PHP Version Per Project
description: Pin each Rezure project to its own PHP version so several projects can run on different PHP releases at the same time on Windows.
---

# PHP Version Per Project

Rezure can serve different projects on different PHP versions at the same time. One legacy app
can stay on PHP 7.4 while a new Laravel app runs on PHP 8.3, without switching a single global
version back and forth.

Each project either follows the **global default** (the active version on the **Switch** page)
or is **pinned** to a specific installed version. Pinning is stored per project and survives
rescans of your project folders.

## Global default vs per project pin

**Global default** lives on the **Switch** page. It controls which PHP build the main
**php** service uses on port 9000. Every project that is set to **Default** is served through
that process.

**Per project pin** lives on the **Projects** page. When you pin a project to a version that
is not the current global default, Rezure gives that version its own `php-cgi` process on its
own port (starting at 9001). Nginx routes each project's virtual host to the correct port.

Projects on the same pinned version share one pooled process. Pinning a project to the same
version as the global default does not start an extra process; it uses the main **php**
service like any unpinned project.

## Before you pin a version

1. Install every PHP version you need. Open the **Switch** page, use **Install version**, or
   drop a build into `C:\rezure\custom\php`.
2. Start **Nginx** and the **php** service on the **Services** page (Dashboard). Unpinned
   projects need the default **php** service running.
3. After you pin a project to a version other than the global default, a new service row
   appears on the **Services** page (for example **php 8.0.30**). Start that service too
   before you open the project in a browser.

Rezure registers pooled PHP services when the app starts and whenever the project list
changes. **Start all** on the Services page starts every listed service, including pooled
ones, once they appear.

## Pin a project to a PHP version

1. Open the **Projects** page.
2. Find the project and click the **PHP version** button in the Actions column (the `</>`
   icon). When a version is pinned, the button is filled red so you can see it at a glance.
3. In the modal, choose **Default** to follow the global active version, or pick one of the
   installed versions (for example **PHP 8.0.30**).
4. Rezure saves the choice, refreshes the project's nginx config, and updates the PHP pool
   if a new version was pinned.

To clear a pin, open the modal again and choose **Default**.

## Run several versions at once

Example setup:

| Project | Pinned version | PHP process |
| --- | --- | --- |
| legacy-shop | PHP 7.4.33 | pooled **php 7.4.33** |
| new-api | Default (PHP 8.3.14) | main **php** service |
| experiment | PHP 8.5.0 | pooled **php 8.5.0** |

With Nginx and each required PHP service running, all three projects can answer HTTP requests
at the same time, each on its own version.

Changing the global default on the **Switch** page only affects projects set to **Default**.
Pinned projects keep their version until you change the pin.

## What Rezure does in the background

Windows has no PHP-FPM bundle like Linux. Rezure runs `php-cgi` as a FastCGI listener, one
process per PHP version that is actually in use.

The main **php** service always serves the global default on port 9000. Each additional pinned
version gets a pooled service (`php-<version>`) on the next free port from 9001 upward. When
you pin or unpin projects, Rezure updates nginx `fastcgi_pass` for each virtual host and
reconciles which pooled services should exist. Stopping a pooled service is manual, the same
as Nginx or MariaDB.

Your pin is stored in Rezure's local database (`projects.php_version`), not in the project
folder. Moving or relinking the folder does not clear the pin.

## Limitations and notes

**Install the version first.** The picker only lists PHP builds Rezure already has on disk. If
nothing is installed yet, install from the **Switch** page and open the modal again.

**Start every PHP service you need.** A pinned project returns a gateway error if its pooled
`php-cgi` is stopped while Nginx is still running.

**Private keys and CLI.** Per project pinning affects HTTP requests through nginx. Commands
you run in a terminal outside Rezure still use whatever PHP is on your system PATH unless you
call the full path to a specific `php.exe` under `C:\rezure\bin\php`.

**Removing a PHP version.** If you remove a build that a project was pinned to, Rezure treats
the pin as invalid and the project falls back to the default **php** service until you pin it
again to an installed version.

**Each version has its own configuration.** Extension paths and `php.ini` are resolved per
install so mixed versions do not share the wrong extension directory.

## Troubleshooting

### The project shows a 502 Bad Gateway after pinning

Check the **Services** page. Start the pooled PHP service for that version (for example
**php 8.0.30**), not only the default **php** row. Confirm Nginx is running.

### The modal says no PHP versions are installed

Install at least one extra version from the **Switch** page, or use **Default** until you do.

### Pinning seems to have no effect

Make sure you picked a version **different** from the current global default. Pinning the same
version as the default is equivalent to **Default** and does not create a separate process.

### I changed the global default and one project did not change

That project is pinned. Open the PHP version modal and switch it to **Default** if you want it
to follow the global version again.

## Related

- [First Run](/guide/first-run): install PHP versions and set the global default
- [FAQ](/guide/faq): which PHP versions Rezure supports

---
title: Project Terminal
description: Open a terminal in any Rezure project with that project's PHP and Node.js versions first on PATH — and how to run artisan, Composer, and npm there.
---

# Project Terminal

The **Terminal** icon on a project's row ("Open a terminal in this folder") opens a shell in the
project's folder, set up so that `php`, `node`, `npm`, and `npx` are the versions **that
project** uses — not whatever happens to be first on your system `PATH`.

That's what keeps `php artisan migrate` from running on PHP 8.1 when the site itself is served
by PHP 8.4.

## What's set up

For the terminal it opens, and only for that terminal, Rezure:

- **Puts the project's PHP first on `PATH`** — the version the project is
  [pinned](/guide/project-php-version) to, or the global active version if it isn't pinned (or
  if its pinned version has since been removed).
- **Puts the project's Node.js next** — its [pinned Node](/guide/nodejs#pin-node-per-project),
  or the global active Node.
- **Adds `C:\rezure\etc\php\conf.d` to `PHP_INI_SCAN_DIR`**, so your own PHP settings load in
  the terminal just as they do for the site. See [PHP Configuration](/guide/php-configuration).

Nothing is changed system-wide. Other terminals, your editor's built-in terminal, and Windows
itself are unaffected.

The terminal is a plain **Command Prompt** (`cmd`) window, not Windows Terminal. Windows
Terminal reuses its existing window and ignores per-launch environment variables, which would
silently drop the versions above. Rezure only uses Windows Terminal when there's nothing to set
— no PHP and no Node installed.

The environment is fixed when the terminal opens. If you change a project's pin, close the
terminal and open a new one from the project's row.

## Check what you got

```bat
where php
php -v
node -v
```

`where php` lists the PHP Rezure put first at the top.

## Running Composer

Rezure doesn't put a `composer` command on `PATH`. Two ways to run it:

- **A global Composer you installed yourself** (the Composer-Setup installer, Scoop, and so
  on). It runs on whichever `php` is first on `PATH` — in a project terminal, the project's
  version.
- **Rezure's own Composer**, through PHP:

  ```bat
  php C:\rezure\bin\composer\2.8.12\composer.phar install
  ```

  Replace `2.8.12` with the version in your `C:\rezure\bin\composer` folder. A one-line
  `composer.bat` somewhere on your `PATH` makes this shorter:

  ```bat
  @php C:\rezure\bin\composer\2.8.12\composer.phar %*
  ```

Composer versions are installed from the [Switch](/guide/php-versions#composer) page.

## Typical commands

```bat
php artisan migrate
php artisan queue:work
npm install
npm run dev
```

A dev server started with `npm run dev` runs in this terminal, not under Rezure. Close the
window (or press **Ctrl + C**) to stop it.

## In other terminals

Outside a project terminal, `php` is whatever your system `PATH` provides. To make Rezure's
active PHP the default everywhere, turn on
[Use Rezure's PHP everywhere](/guide/php-configuration#use-rezure-s-php-everywhere). That always
points at the **global** version; project pins only apply in the project terminal and to the
site itself. Node.js has no system-wide option — it's only on `PATH` in project terminals.

## Related

- [PHP Per Project](/guide/project-php-version) — pinning PHP
- [Node.js](/guide/nodejs) — installing and pinning Node
- [AI Coding Agents](/guide/ai-agents) — how Rezure tells coding tools about this setup

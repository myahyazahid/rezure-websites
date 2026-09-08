---
title: Rezure FAQ
titleTemplate: false
description: Common questions about Rezure — what it installs, which PHP versions it supports, how it handles ports and admin rights, and why it is Windows only.
---

# Frequently asked questions

## What is Rezure?

Rezure is a local development environment manager for Windows. It bundles a web server
(Nginx), PHP, and a database (MariaDB) and puts them behind start/stop buttons instead of
config files and service consoles. The longer answer is on
[What is Rezure?](/guide/).

## Is Rezure free?

Yes. Rezure is free and open source, and the source lives on
[GitHub](https://github.com/myahyazahid/rezure).

## What makes Rezure different?

A few things Rezure does deliberately:

- **Runtime versions are discovered, not hard-coded.** Installed PHP builds are found by
  scanning your download cache and a drop-in folder, and the installable list comes live
  from php.net's own release feed, checksums included.
- **Port conflicts are reported before a service fails.** Rezure checks the port first, so a
  stray process on the same port gets named instead of producing a silent failure.
- **Only what you ask for gets downloaded.** Nginx and PHP 8.3 ship inside the installer;
  MariaDB and extra PHP versions are pulled on demand.
- **A small footprint.** A native webview instead of a bundled browser engine keeps both the
  binary and the memory use modest.

## Can I run Rezure alongside another local server stack?

Not at the same time, if the two want the same ports. Nginx and MariaDB listen on port 80
and port 3306, and nothing else can share those while Rezure's services are running. You
don't need to uninstall anything — just stop the other stack before starting Rezure's. See
[Installation](/guide/installation) for the details.

## Does Rezure work on macOS or Linux?

No. Rezure targets Windows 10 (build 1809 or newer) and Windows 11, 64-bit only. There are
no macOS or Linux builds.

## Does Rezure use Docker?

No. Rezure runs native binaries directly on your machine — there is no Docker mode.

## Which PHP versions can I use?

PHP 8.3 ships inside the installer. From the **PHP** page you can install any other version
straight from php.net, or drop a build you already downloaded into `C:\rezure\custom\php`
and Rezure picks it up on the next scan. Switching the active version restarts PHP-FPM only,
so your virtual hosts stay up.

## Is MariaDB included in the installer?

No, and that's on purpose. MariaDB downloads the first time you start it — a one-time wait
of a minute or two, and only if you actually need a database.

## Where do my projects live?

Anything in `C:\rezure\www` is served automatically: a folder named `myapp` becomes
`myapp.test`. Projects stored elsewhere can be linked in place from the **Projects** page,
with nothing copied or moved. Settings live in `%APPDATA%\Rezure`, outside the install
folder, so reinstalling or rolling back leaves your work alone.

## Why does Rezure need administrator rights?

Only for one thing: editing the Windows `hosts` file when it sets up a virtual host.
Windows prompts the first time it happens. Declining leaves the rest of the app working —
the project's `.test` domain just won't resolve until the entry is added.

## Windows SmartScreen warns about an unrecognized publisher. Is that a problem?

That warning is about code signing, not a virus report. Verify the installer's SHA-256 hash
against the one on the [release page](https://github.com/myahyazahid/rezure/releases) — the
[verification steps](/download#verify-your-download) take about ten seconds — and if it
matches, choose **More info → Run anyway**.

## Can I serve a site to the internet with Rezure?

No. Rezure is meant for local development only, never for serving anything to the public
internet.

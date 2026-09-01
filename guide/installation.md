---
title: Installation
description: Install Rezure on Windows and verify the setup.
---

# Installation

## Before you start

Rezure needs 64-bit Windows 10 (build 1809 or newer) or Windows 11, roughly 400 MB of free
disk space, and the WebView2 runtime — which is already present on virtually every current
Windows install. The full list is on the [download page](/download).

One thing worth checking first: **if Laragon or XAMPP is running, stop it.** Both take port
80 and port 3306, and neither can share them with Rezure. You don't need to uninstall
anything, just don't run two stacks at once.

## Install

1. Download the installer from the [download page](/download).
2. Verify its SHA-256 hash against the one on the release page — the
   [verification steps](/download#verify-your-download) take about ten seconds.
3. Run the installer and accept the default location unless you have a reason not to.
4. Launch Rezure from the Start menu.

Windows SmartScreen may warn you about an unrecognized publisher on the first run. That's
code-signing, not a virus report — choose **More info → Run anyway** if the hash you checked
in step 2 matched.

## What the installer sets up

| Path | What lives there |
|---|---|
| The install folder | The app itself, plus the bundled Nginx and PHP 8.3 |
| `C:\rezure\www` | Your projects. Anything you drop here is served automatically. |
| `C:\rezure\custom\php` | Drop-in folder for PHP builds you downloaded yourself |
| `%APPDATA%\Rezure` | Settings, the project database, and links to projects stored elsewhere |

Your projects and settings live outside the install folder, so reinstalling or rolling back
to an older version leaves them untouched.

## Administrator rights

Rezure edits the Windows `hosts` file when it sets up a virtual host, and that needs
administrator rights. Windows will prompt you the first time it happens. If you decline, the
rest of the app keeps working — the project's `.test` domain just won't resolve until the
entry is added.

## Verify the install

Open Rezure and look at the Services page. Nginx and PHP should both be listed as stopped,
with a version next to each. That's a healthy first launch — head to
[First Run](/guide/first-run) to start them.

If a service is listed as missing instead, the bundled binaries didn't unpack. Reinstalling
over the top is the fastest fix.

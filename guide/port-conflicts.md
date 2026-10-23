---
title: Port Conflicts
description: What Rezure does when port 80, 3306, or another service port is already taken — how it names the program holding the port, and how "Stop it and start" frees it for you.
---

# Port Conflicts

Two programs can't listen on the same port. If Laragon's Nginx already has port 80, Rezure's
can't start — and on most stacks that shows up as a service that silently refuses to run.

Rezure checks every port a service needs **before** starting it. When one is taken, it stops
there and tells you exactly what's holding it.

## What you see

The service's row shows a message such as:

```
can't start Nginx — port 80 is held by Laragon (nginx.exe, pid 10244)
```

Rezure looks the port up in Windows' connection table and sorts the holder into one of three
kinds:

| Holder | Example message | What you can do |
| --- | --- | --- |
| **A leftover Rezure process** — something running from `C:\rezure\bin` or `C:\rezure\custom` | "port 80 is held by a leftover Rezure process (nginx.exe, pid X) from an earlier run" | **Stop it and start Nginx** |
| **Another program** — Laragon, XAMPP, WAMP, MAMP, and Docker are recognised by name; anything else is named by its executable | "port 3306 is held by XAMPP (mysqld.exe, pid X)" | **Stop it and start MariaDB**, after a warning |
| **Windows itself** | "port 80 is reserved by Windows itself — usually IIS or the World Wide Web Publishing service. Stop that service to free it." | Stop the Windows service yourself |

The row also shows the holder's path when Rezure can read it, so you can see which install it
belongs to.

## Stop it and start

For the first two kinds, the row offers a **Stop it and start {service}** button and
**Cancel**. For a program that isn't Rezure's there's an extra line: "This isn't Rezure's —
make sure you don't need it running."

When you click it, Rezure:

1. Looks the holder up again, so it never kills a process that has since exited and had its
   ID reused.
2. Ends the holder's **whole process tree**. Nginx and MySQL both run a parent process that
   would otherwise just respawn the worker you killed, so Rezure starts from the topmost
   ancestor running the same program.
3. Waits up to 2.5 seconds for the port to come free, then starts your service.

This never asks for administrator rights. If the holder runs elevated or as another Windows
user, Windows won't let Rezure end it, and you'll see "{name} did not release port N". Stop
it from the program that owns it, or from Task Manager as administrator.

## Ports reserved by Windows

When the holder is Windows itself (process ID 4, the "System" process) or a protected process
whose path Rezure can't read, there's no button: "This one has to be stopped as a Windows
service; Rezure can't end it."

On port 80 that's almost always **IIS** or the **World Wide Web Publishing Service**. To stop
it:

1. Press **Win + R**, type `services.msc`, and press Enter.
2. Find **World Wide Web Publishing Service** (and **Windows Process Activation Service** if
   it's running).
3. Right-click → **Stop**. To stop it coming back after a restart, open **Properties** and
   set **Startup type** to **Manual** or **Disabled**.

If you don't use IIS at all, removing it from **Turn Windows features on or off** →
**Internet Information Services** is the permanent fix.

## Common conflicts

| Port | Usual suspect |
| --- | --- |
| 80 | Laragon, XAMPP, WAMP, IIS, Skype (older versions), a Docker container publishing port 80 |
| 3306 | Laragon's or XAMPP's MySQL, a standalone MySQL Windows service |
| 5432 | A PostgreSQL installed with EDB's Windows installer, which runs as a Windows service |
| 1025 / 8025 | Another Mailpit or MailHog |

Rezure's PHP uses ports 9100 and up rather than the usual 9000, so it doesn't collide with the
PHP that Laragon and XAMPP run there.

You don't need to uninstall another stack to use Rezure — just don't run both at the same
time. And if you'd rather keep using Laragon's or XAMPP's MySQL data, Rezure can serve it
directly: see [MariaDB & MySQL](/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory).

## Related

- [Services](/guide/services) — starting and stopping everything
- [Ports](/guide/ports) — every port Rezure uses

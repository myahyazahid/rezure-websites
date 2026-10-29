---
title: Default Ports for Nginx, PHP, MariaDB, PostgreSQL, Mailpit
description: Every port Rezure's services listen on — Nginx, PHP, MariaDB, PostgreSQL, SQL Server LocalDB, Mailpit, and Vite or Next.js dev servers — and which ones are reachable from your network.
---

# Ports

| Port | Service | Listens on | Notes |
| --- | --- | --- | --- |
| **80** | Nginx | All interfaces | Every project's site, `http://<name>.test` |
| **9100–9103** | PHP (global version) | `127.0.0.1` | 4 FastCGI workers |
| **9110–9113**, **9120–9123**, … | PHP x.y.z (pinned versions) | `127.0.0.1` | One block of ten per extra version; 4 workers each |
| **3306** | MariaDB / MySQL | `127.0.0.1` | A manually added data directory profile can use another port |
| **5432** | PostgreSQL | `127.0.0.1` | |
| — | SQL Server LocalDB | named pipe | Reached as `(localdb)\Rezure`, no TCP port |
| **14330** | LocalDB bridge | `127.0.0.1` | TCP relay to LocalDB for GUI clients, login `rezure` |
| **1025** | Mailpit SMTP | `127.0.0.1` | Where projects send mail |
| **8025** | Mailpit inbox | `127.0.0.1` | `http://127.0.0.1:8025` |
| **4400–4499** | Dev servers | Up to the dev server | One port per JavaScript or Node project, kept once assigned. See [Dev Servers](/guide/dev-servers) |
| random | SSH tunnels | `127.0.0.1` | One free port per tunnelled [remote connection](/guide/remote-databases) |
| random | Share proxy | `127.0.0.1` | Between Cloudflare's tunnel and Nginx while a project is [shared](/guide/sharing) |

## Why these numbers

- **PHP starts at 9100**, not the usual 9000, so it doesn't collide with the PHP that Laragon and
  XAMPP run on 9000 — and port 9003 stays free for Xdebug.
- Each PHP version keeps its block of ports while it runs, so pinning or unpinning one project
  never moves another version's workers.
- **Dev servers get a port from 4400–4499**, a range none of the usual framework defaults fall
  in (3000 for Next.js, 4200 for Angular, 4321 for Astro, 5173 for Vite). A project keeps its
  port, so its `.test` domain always reaches the same place. A port you set by hand can be
  anything from 1024 to 65535 that no other project or Rezure service uses.

## What's reachable from your network

Everything except Nginx listens only on `127.0.0.1`, so databases, PHP, and Mailpit can't be
reached from another device, whatever your firewall says. A dev server listens wherever its
framework decides; Vite, Next.js, and most others default to `localhost` only.

**Nginx listens on all interfaces on port 80.** If Windows Firewall allows it — Windows may ask
the first time Nginx starts — other devices on the same network can connect to Nginx on your
PC, and through it to your projects. On a network you don't trust, answer that prompt with **Cancel**, or allow
only **Private networks**. To show a site to someone elsewhere, use
[Share](/guide/sharing) instead.

## When a port is taken

Rezure checks every port before it starts a service and names whatever holds it. See
[Port Conflicts](/guide/port-conflicts).

## Related

- [Services](/guide/services) — each service in detail
- [Files & Folders](/guide/files-and-folders) — where everything lives on disk

---
title: Sharing a Project Publicly
description: Share a local Rezure project on the internet temporarily with one click, using a Cloudflare Quick Tunnel — no account, no manual setup.
---

# Sharing a Project Publicly

Rezure can expose a running local project to the internet for a short time — a demo for a
client, a quick check on your phone, or a link for a teammate who isn't on your network. One
click on the **Projects** page starts a **Cloudflare Quick Tunnel** and gives you an
`https://…trycloudflare.com` link you can copy and send.

No Cloudflare account, no tunnel config file, and no port forwarding on your router.

## Before you share

Make sure the basics are already working locally:

1. **Nginx is running** on the **Services** page. The tunnel forwards traffic into your
   local stack; if Nginx isn't up, the public link has nothing to reach.
2. **The project opens locally** — click **Open** on the project row and confirm
   `myapp.test` (or whatever domain Rezure assigned) loads in your browser.
3. **You have internet access.** Rezure talks to Cloudflare's edge to open the tunnel.

That's it. MariaDB only matters if the page you're sharing needs a database, and PHP-FPM
must be running for PHP projects — same as for local browsing.

## How to share

1. Open the **Projects** page.
2. Find the project and click the **Share** button (upload icon) in the Actions column.
3. A modal opens while Rezure sets things up. The first time you share on a machine, Rezure
   also downloads the `cloudflared` binary — that can take a few seconds.
4. When the tunnel is ready, the modal shows a public URL like
   `https://random-words-here.trycloudflare.com`. Click **Copy** and send it to whoever
   needs access.
5. Click **Stop sharing** when you're done, or close the modal and stop later from the same
   button.

While a share is active, the Share button turns green. Click it again anytime to reopen the
modal and copy the link.

## What recipients see

Anyone with the link can open your project in a normal browser while sharing stays on. They
do **not** need Rezure, your Wi‑Fi, or a `.test` domain on their machine — the tunnel URL
is the whole address.

**New links can take up to a minute** before they respond from another device or network. If
the first load fails, wait a bit and try again.

## First-time setup

The first share on a fresh install triggers a one-time download of Cloudflare's
`cloudflared` tool. Rezure verifies the file with a SHA-256 checksum before using it.

The binary is stored at:

```
C:\rezure\bin\cloudflared\<version>\cloudflared.exe
```

After that, starting a share is usually just a few seconds — mostly waiting for Cloudflare
to hand back the public URL.

## How it works (briefly)

Behind the button, Rezure:

1. Starts a small local proxy that forwards requests to Nginx with the correct `Host`
   header for your project's `.test` domain.
2. Runs `cloudflared tunnel --url …` against that proxy.
3. Cloudflare returns a random public `https://*.trycloudflare.com` URL and routes
   incoming HTTPS traffic back to your machine.

Rezure also rewrites certain redirect responses — for example, when a framework sends
someone to `http://myapp.test/login`, the browser is sent to the tunnel URL instead, so
visitors don't hit a domain that only exists on your PC.

When you stop sharing or quit Rezure, the tunnel process is torn down. Nothing keeps
proxying after that.

## Limitations

Sharing is meant for **temporary, local development use** — not for hosting a production
site.

- **The URL changes** each time you start a new share. Quick Tunnels don't give you a fixed
  hostname.
- **Sharing stops** when you click **Stop sharing** or when Rezure exits.
- **Traffic goes through Cloudflare's free Quick Tunnel service**, subject to Cloudflare's
  own limits and availability.
- **This is not hardened production hosting.** Don't expose sensitive data, admin panels
  without authentication, or anything you wouldn't trust on a dev machine reachable from the
  internet.
- Rezure does **not** open your MariaDB port publicly — only the web project you shared.

For a permanent public deployment, use a proper host and deploy pipeline instead.

## Troubleshooting

### The modal stays on "Starting the tunnel…" for a long time

On the very first share, Rezure is probably still downloading `cloudflared`. Give it up to
half a minute on a slow connection.

If it never finishes, check that nothing is blocking outbound HTTPS (firewall, corporate
proxy, offline Wi‑Fi).

### An error mentions `cloudflared exited immediately`

Usually no route to the internet, or Cloudflare's edge was unreachable from your network.
Fix connectivity and try again.

### A share started but the link doesn't load from my phone

Wait up to a minute — Quick Tunnel URLs sometimes need a short moment to propagate. Confirm
Nginx is still running and the project still loads locally via **Open**.

### I closed the modal but sharing is still on

That's expected. Closing the modal only hides it. The tunnel keeps running until you click
**Stop sharing** or quit Rezure. The green Share button means a tunnel is still active;
click it to reopen the link or stop.

### I reloaded the Projects page and the button is still green

Rezure restores active share state after a reload, so you won't lose a running tunnel just
because the UI refreshed.

## Related

- [First Run](/guide/first-run) — start services and serve a project locally first
- [FAQ](/guide/faq) — ports, permissions, and what Rezure installs

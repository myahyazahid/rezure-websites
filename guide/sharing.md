---
title: Share a Local Site Publicly with Cloudflare Tunnel
description: Share a local Rezure project on the internet temporarily with one click, using a Cloudflare Quick Tunnel. No account, no manual setup.
---

# Sharing a Project Publicly

Rezure can expose a running local project to the internet for a short time: a demo for a
client, a quick check on your phone, or a link for a teammate who isn't on your network. One
click on the **Projects** page starts a **Cloudflare Quick Tunnel** and gives you an
`https://…trycloudflare.com` link you can copy and send.

No Cloudflare account, no tunnel config file, and no port forwarding on your router.

## Before you share

Make sure the basics are already working locally:

1. **Nginx is running** on the **Services** page. The tunnel forwards traffic into your
   local stack; if Nginx isn't up, the public link has nothing to reach.
2. **The project opens locally**: click **Open** on the project row and confirm
   `myapp.test` (or whatever domain Rezure assigned) loads in your browser.
3. **You have internet access.** Rezure talks to Cloudflare's edge to open the tunnel.

That's it. PHP projects need their PHP service running, and the database only matters if the
page you're sharing needs one, same as for local browsing.

JavaScript and Node projects share the same way: the tunnel goes through Nginx to the project's
[dev server](/guide/dev-servers), so start it first (click **Open**) and keep it running while
the link is out.

## How to share

1. Open the **Projects** page.
2. Find the project and click its **Share** icon ("Share this project publicly (Cloudflare
   Quick Tunnel)").
3. Sharing starts straight away and a modal shows the progress: "Setting up your project…",
   "Starting the tunnel…", "Almost done…". The first time you share on a machine, Rezure also
   downloads the `cloudflared` binary; that can take a few seconds.
4. When the tunnel is ready, the modal shows a public URL like
   `https://random-words-here.trycloudflare.com`. Click **Copy** and send it to whoever
   needs access.
5. Click **Stop sharing** when you're done, or **Close** the modal and stop later from the
   same icon.

While a share is active, the Share icon is filled in the accent colour. Click it again anytime
to reopen the modal and copy the link. You can share several projects at once; each gets its
own link.

## What recipients see

Anyone with the link can open your project in a normal browser while sharing stays on. They
do **not** need Rezure, your Wi‑Fi, or a `.test` domain on their machine; the tunnel URL
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

After that, starting a share is usually just a few seconds, mostly waiting for Cloudflare
to hand back the public URL.

## How it works (briefly)

Behind the button, Rezure:

1. Starts a small local proxy that forwards requests to Nginx with the correct `Host`
   header for your project's `.test` domain.
2. Runs `cloudflared tunnel --url …` against that proxy.
3. Cloudflare returns a random public `https://*.trycloudflare.com` URL and routes
   incoming HTTPS traffic back to your machine.

Frameworks often build absolute URLs from the local domain, and `myapp.test` means nothing
on someone else's computer. So on the way back, the proxy rewrites them to the tunnel URL:

- **Redirects**: a `Location: http://myapp.test/login` header sends the browser to
  `https://<tunnel>/login` instead.
- **Page content**: in HTML, CSS, JavaScript, JSON, plain-text, and SVG responses, every
  `http://myapp.test`, `https://myapp.test`, and bare `myapp.test` becomes the tunnel's
  `https://` address. That's what keeps Laravel's Vite asset links and similar absolute URLs
  working for visitors.

Images, fonts, and other binary files pass through untouched.

When you stop sharing or quit Rezure, the tunnel process is torn down. Nothing keeps
proxying after that.

## Limitations

Sharing is meant for **temporary, local development use**, not for hosting a production
site.

- **The URL changes** each time you start a new share. Quick Tunnels don't give you a fixed
  hostname.
- **Sharing stops** when you click **Stop sharing** or when Rezure exits.
- **Responses are delivered whole.** The proxy reads each response completely before sending
  it on, so streamed responses (server-sent events, long downloads that report progress)
  arrive all at once, and WebSocket connections don't get through.
- **Cookies scoped to the `.test` domain** aren't rewritten. A login that sets a cookie for
  `myapp.test` explicitly may not stick for visitors; a cookie with no domain set works.
- **Traffic goes through Cloudflare's free Quick Tunnel service**, subject to Cloudflare's
  own limits and availability.
- **This is not hardened production hosting.** Don't expose sensitive data, admin panels
  without authentication, or anything you wouldn't trust on a dev machine reachable from the
  internet.
- Rezure does **not** open any database port publicly; only the web project you shared.

For a permanent public deployment, use a proper host and deploy pipeline instead.

## Troubleshooting

### The modal stays on "Starting the tunnel…" for a long time

On the very first share, Rezure is probably still downloading `cloudflared`. Give it up to
half a minute on a slow connection.

If it never finishes, check that nothing is blocking outbound HTTPS (firewall, corporate
proxy, offline Wi‑Fi). Rezure gives up after 20 seconds without a URL and shows the end of
`cloudflared`'s log.

### An error mentions `cloudflared exited immediately`

Usually no route to the internet, or Cloudflare's edge was unreachable from your network.
Fix connectivity and try again.

### Visitors see "share proxy error … couldn't reach nginx"

Nginx stopped after the share started. Start it again on the **Services** page; the link
keeps working once it's back.

### A share started but the link doesn't load from my phone

Wait up to a minute: Quick Tunnel URLs sometimes need a short moment to propagate. Confirm
Nginx is still running and the project still loads locally via **Open**.

### I closed the modal but sharing is still on

That's expected. Closing the modal only hides it. The tunnel keeps running until you click
**Stop sharing** or quit Rezure. The filled Share icon means a tunnel is still active;
click it to reopen the link or stop.

### I reloaded the Projects page and the icon is still filled

Rezure restores active share state after a reload, so you won't lose a running tunnel just
because the UI refreshed.

## Related

- [First Run](/guide/first-run): start services and serve a project locally first
- [Projects](/guide/projects): everything else the project actions do
- [FAQ](/guide/faq): ports, permissions, and what Rezure installs

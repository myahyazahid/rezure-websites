---
title: Updates and Changelog
description: How Rezure checks for and installs updates, how updates are signed and verified, what the Changelog page shows, and how new major versions are announced.
---

# Updates and Changelog

Rezure updates itself from inside the app. You don't need to download a new installer for each
release.

## How you find out

Rezure checks for an update **once when it starts**, and again each time you open the
**Changelog** page. It doesn't keep checking in the background while it's open.

When an update is out, a red dot appears on **Changelog** in the sidebar. There's no pop-up.

## Install an update

1. Open **Changelog**. While it checks, the page shows "Checking for updates…".
2. A card reads **Rezure X.Y.Z is available**. Click **Update**.
3. The button changes to **Downloading…** with a progress bar.
4. The installer runs, then Rezure relaunches on the new version.

Before installing, quit anything you're in the middle of: the update restarts the app, and
restarting stops your services. Your projects, databases, and settings in `C:\rezure` aren't
touched.

If the download fails, the error is shown on the card; click **Update** to try again. If the
**check** fails — you're offline, say — nothing is shown at all, so it looks the same as "no
update". Open Changelog again once you're back online.

## How updates are verified

- Every update is **signed**. The public key is built into the app, and an update whose
  signature doesn't match — signed with another key, or altered after signing — is downloaded
  but **refused**.
- An update must be a **newer version** than the one you have. Rezure never installs an older
  build through the updater.
- The update check is a plain request with your current version, platform, and architecture.
  It carries no device ID and no usage data.

To go back to an earlier version on purpose, download its installer from the
[GitHub releases page](https://github.com/myahyazahid/rezure/releases) and run it over your
install. See [Download](/download#previous-versions).

## New major versions

The updater stays within your **major version**: Rezure 3.x only updates to newer 3.x releases.

When a new major version is out, the Changelog page shows a banner — **Rezure v4 is out**, with
a short message and **Learn more**. **Learn more** opens the website in your browser; it never
downloads or installs anything. Moving to a new major version is always your choice.

## The Changelog page

"What's new in Rezure, release by release." Each entry has a title, the version, and its
release date, newest first, ten to a page (**Newer** / **Older**).

The entries are fetched from Rezure's server and saved locally, so the page still shows the last
copy when you're offline. Opening the page marks the newest entry as seen, which clears the
sidebar dot.

## Related

- [Download](/download) — installers and checksums
- [Privacy & Usage Data](/guide/privacy) — what Rezure sends, and what it doesn't

---
title: PHP Configuration
description: Put your own php.ini settings where Rezure won't overwrite them, install the CA bundle that fixes cURL error 60, and make Rezure's PHP the php command in every terminal.
---

# PHP Configuration

The **PHP configuration** section at the bottom of the **Switch** page has the PHP settings
that aren't about which version runs: your own `php.ini` values, the certificate bundle HTTPS
needs, and whether `php` works in every terminal.

## Your PHP settings

Rezure generates each PHP version's `php.ini` itself and **rewrites it on every start**, so
editing that file doesn't stick. Put your own settings in this folder instead:

```
C:\rezure\etc\php\conf.d
```

Any `.ini` file there is loaded **after** Rezure's `php.ini`, so its values win. The
**Your PHP settings** card's **Open folder** button takes you there, and a `README.txt` inside
shows an example.

For example, `C:\rezure\etc\php\conf.d\90-local.ini`:

```ini
memory_limit = 1G
upload_max_filesize = 256M
post_max_size = 256M
max_execution_time = 600
date.timezone = Asia/Jakarta
```

- **Restart PHP** on the Services page for a change to reach running sites.
- Files load in alphabetical order, so `90-local.ini` wins over `10-something.ini`.
- The folder applies to **every** PHP version, to your sites, and to
  [project terminals](/guide/project-terminal). With
  [Use Rezure's PHP everywhere](#use-rezure-s-php-everywhere) on, it applies in every terminal.
- For extensions, use the [PHP Extensions](/guide/php-extensions) page rather than
  `extension=` lines here.

What Rezure's own `php.ini` sets, for reference:

| Setting | Value |
| --- | --- |
| `memory_limit` | 256M |
| `upload_max_filesize`, `post_max_size` | 64M |
| `max_execution_time` | 300 |
| `output_buffering` | 4096 |
| `date.timezone` | UTC |
| Session and upload temp folder | `C:\rezure\data\php\tmp` |
| `curl.cainfo`, `openssl.cafile` | The CA bundle, when installed |

Nginx accepts request bodies up to **64 MB**. Raising `upload_max_filesize` and
`post_max_size` past that doesn't help: Nginx rejects larger uploads before PHP sees them.

## CA certificates

PHP checks HTTPS certificates against a list of trusted root certificates — and the PHP zip
for Windows ships **none**. Without one, every outgoing HTTPS call from PHP fails with
`cURL error 60: SSL certificate problem`: Composer, Guzzle, Laravel's `Http` client, payment
gateways, OAuth logins.

The **CA certificates** card fixes that:

1. Click **Download** (or **Update** once one is installed).
2. Rezure fetches Mozilla's root certificates from `https://curl.se/ca/cacert.pem`, checks
   them against curl.se's published SHA-256, and saves them to `C:\rezure\etc\cacert.pem`.
3. Both `curl.cainfo` and `openssl.cafile` point at it for every PHP version.

The card shows "Mozilla's root certificates as of YYYY-MM-DD, from curl.se." when it's in
place, or an amber "Not installed — HTTPS calls from PHP can't be verified." when it isn't.
After the first install, restart PHP; after an update, running sites use it from the next
request.

New installs of Rezure include a bundle already. If you replaced `cacert.pem` with your own —
to add a company proxy's certificate, say — the card shows "A bundle Rezure didn't put there —
kept as it is." App updates leave it alone, but clicking **Update** replaces it with
Mozilla's.

The [Requirements Check](/guide/requirements-check) tests this for you on any project.

## Use Rezure's PHP everywhere

Out of the box, Rezure's PHP is only on `PATH` in the
[terminals it opens for a project](/guide/project-terminal). Turn on **Use Rezure's PHP
everywhere** ("Puts the active version on your PATH, so `php` works in every terminal — not
only the ones Rezure opens.") to make it the `php` in VS Code's terminal, PowerShell, Git Bash,
and everything else.

### What it changes

- Creates a link folder, `C:\rezure\current\php`, that points at the global active version.
  (It's a directory junction, which doesn't need administrator rights.)
- Adds that folder to the **start of your user `PATH`**. The system `PATH` is never touched.
- Appends `C:\rezure\etc\php\conf.d` to your user `PHP_INI_SCAN_DIR` variable, so
  [your PHP settings](#your-php-settings) load in every terminal too.

**Open a new terminal** to pick it up — ones already open keep the `PATH` they started with.
After that, switching versions on the Switch page only re-points the link, so even open
terminals follow along. The card shows "php → {version}" and where it points.

If another PHP was on your `PATH` first — Laragon's, XAMPP's, WAMP's — the card tells you
before you turn it on ("Laragon already provides `php`. Turning this on puts Rezure ahead of
it; turning it off hands it straight back.").

### Turning it off

Removes only Rezure's `PATH` entry and Rezure's folder from `PHP_INI_SCAN_DIR` (deleting the
variable if nothing else is in it), and deletes the link folder. No PHP version is removed.

### Things to know

- It always follows the **global** version. A project's
  [pin](/guide/project-php-version) only applies to its site and its project terminal.
- A PHP on the **system** `PATH` still wins, because Windows reads the system `PATH` before
  the user `PATH`. If `where php` shows another PHP first after turning this on, remove that
  entry from the system `PATH` (System Properties → Environment Variables).
- "The link is out of sync — switch a version to re-point it." means the link points somewhere
  unexpected; picking a version on the Switch page fixes it. Rezure also re-points it every
  time it starts.

## Drop-in folder

"A PHP build copied in here shows up in the list above, alongside the ones Rezure installed."
The **Drop-in folder** card's **Open folder** opens `C:\rezure\custom\php`. See
[PHP Versions](/guide/php-versions#an-older-patch-release-or-a-build-you-already-have).

## Related

- [PHP Versions](/guide/php-versions) — install and switch versions
- [PHP Extensions](/guide/php-extensions) — extensions per version
- [Files & Folders](/guide/files-and-folders) — where everything lives

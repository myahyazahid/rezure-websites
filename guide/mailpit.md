---
title: Mailpit (Local Mail Catcher)
description: Catch every email your local PHP or Laravel project sends with Mailpit in Rezure — install, the .env settings, and the inbox at 127.0.0.1:8025.
---

# Mailpit

[Mailpit](https://mailpit.axllent.org/) is a local mail catcher. Point a project at it and
every email the project sends — password resets, order confirmations, notifications — lands in
a web inbox on your machine instead of anyone's real mailbox. Nothing leaves your PC.

## Install and start

On the [Services](/guide/services) page, click **Install** on the **Mailpit** row, then
**Start**. (It's also under **Switch → Install version → Mailpit**.) Rezure ships one pinned
version, checksum-verified.

| | |
| --- | --- |
| SMTP server | `127.0.0.1:1025` |
| Web inbox | `http://127.0.0.1:8025` |
| Login | Any username and password are accepted, or none |
| Stored mail | `C:\rezure\data\mailpit\mailpit.db` — kept across restarts |

While it runs, the **Open** button on its row opens the inbox.

## Point a Laravel project at it

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@myapp.test"
MAIL_FROM_NAME="${APP_NAME}"
```

Then clear Laravel's config cache if you've cached it (`php artisan config:clear`), and send an
email. It appears in the inbox within a second.

Two values that commonly trip people up, both caught by the project's
[Requirements Check](/guide/requirements-check):

- **`MAIL_HOST=mailpit`** is Laravel Sail's Docker hostname. It doesn't exist outside Docker —
  use `127.0.0.1`.
- **`MAIL_PORT=2525`** is the value in Laravel's default `.env`. Mailpit listens on **1025**.

If Mailpit isn't running, the Requirements Check offers **Start Mailpit** (or **Install and
start Mailpit**).

## Other PHP projects

Anything that sends mail over SMTP works the same way: host `127.0.0.1`, port `1025`, no
encryption, any or no credentials.

- **WordPress** — an SMTP plugin (WP Mail SMTP, for example) with those settings.
- **Plain PHP with PHPMailer or Symfony Mailer** — the same host and port.

PHP's built-in `mail()` function on Windows sends through the `SMTP` and `smtp_port` settings.
To catch it too, add an `.ini` file to `C:\rezure\etc\php\conf.d` (see
[PHP Configuration](/guide/php-configuration#your-php-settings)) and restart PHP:

```ini
SMTP = 127.0.0.1
smtp_port = 1025
sendmail_from = hello@myapp.test
```

## Related

- [Laravel .env Cheatsheet](/guide/laravel-env) — mail and database values together
- [Services](/guide/services) — starting and stopping Mailpit
- [Ports](/guide/ports) — 1025 and 8025 alongside everything else

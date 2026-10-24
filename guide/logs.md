---
title: Service Logs for Nginx, PHP, and Databases
description: Rezure's Logs page — a combined, filterable live tail of every service's output, plus where to find the logs that don't appear there.
---

# Logs

The **Logs** page is a combined live tail across every service: Nginx, PHP and each pinned
PHP version, MariaDB or MySQL, PostgreSQL, and Mailpit. When something won't start, this is
the first place to look.

For a single service, the logs toggle on its row of the [Services](/guide/services) page shows
the last 20 lines without leaving the page.

## Reading the log

Each line shows the time it arrived, the service it came from, a level, and the message,
newest first. The footer shows how many lines are listed and whether the view is **Live tail**
or **Paused**.

### Filtering

- **Filter log text** — matches anywhere in the message.
- **Service** — **All services**, or one of `nginx`, `php`, `mariadb`, `postgres`, `mailpit`,
  plus one per pinned PHP version such as `php-8.1.34`. The `mariadb` filter also covers a
  MySQL profile.
- **Level** — **All**, **Info**, **Warn**, or **Error**.

The level is worked out from the text itself: a line containing "error" or "fatal" counts as
**Error**, one containing "warn" as **Warn**. That means a harmless line that merely mentions
the word "error" is tagged as one, too. The red badge on **Logs** in the sidebar counts those
lines.

### Pause and Clear

**Pause** freezes the view so you can read. Lines that arrive while paused are **discarded**,
not queued — click **Resume** to pick the tail back up. **Clear** empties the list.

## What the page keeps

- Only what services print to their console (standard output and standard error), and only
  while Rezure is open.
- At most the newest **1,000 lines**. Older lines drop off.
- Nothing is saved to disk. Quitting Rezure empties the page.

When you send a report from the **Feedback** page, **Attach latest log** adds the last 200
lines of this buffer as `latest-log.txt`. Those lines can include folder paths, so read them
before sending.

## Logs that don't appear here

Some programs write to their own files instead of the console:

| What | Where |
| --- | --- |
| Nginx errors | `C:\rezure\data\nginx\logs\error.log` |
| Your Laravel app's errors | `storage\logs\laravel.log` inside the project |
| Microsoft installer logs (ODBC Driver, LocalDB) | `C:\rezure\data\installers\` |

SQL Server LocalDB produces no lines on this page, and there's no filter for it.

A blank page or a **500** from a Laravel project usually has its reason only in
`laravel.log`. A missing PHP extension is a common cause — the
[Requirements Check](/guide/requirements-check) finds those.

## Related

- [Services](/guide/services) — the per-row log panel
- [Troubleshooting](/guide/troubleshooting) — common errors and what they mean

---
title: Create a Laravel or WordPress Project Locally
description: Create a new Laravel, WordPress, blank PHP, or static HTML project in Rezure with one dialog — what each template does, how long it takes, and what to do next.
---

# New Project

**New project** on the Projects page creates a project folder in `C:\rezure\www`, fills it from
a template, and writes its virtual host — two steps, no terminal.

## Create a project

1. On the **Projects** page, click **New project**.
2. **Step 1 of 2 — pick a starting point.** Choose a template (below) and click **Continue**.
3. **Step 2 of 2 — name it and go.** Type a **Project name**. The dialog previews the local
   domain (`<name>.test`) and the folder it will create.
4. Click **Create project**. The dialog can't be closed while it works.
5. When it's done, click **Sync hosts file** so the new domain resolves, then **Open**.

The name must be 1–64 characters of lowercase letters, digits, and hyphens, and can't start or
end with a hyphen. A name that's already a project is refused.

## Templates

| Template | What you get | Takes |
| --- | --- | --- |
| **Laravel** | A fresh Laravel app via Composer, `artisan` ready | Typically 3–6 minutes |
| **WordPress** | The latest WordPress core from wordpress.org | Usually around a minute |
| **Blank PHP** | A single `index.php` that prints "Hello from Rezure!" | Instant |
| **Static HTML** | A single `index.html` that says "Hello from Rezure!" | Instant |

### Laravel

Rezure runs Composer's `create-project laravel/laravel` for you, on the **global active PHP**
and with Rezure's own PHP settings and extensions.

- You get the **newest Laravel release that your active PHP version supports** — the template
  card's version label isn't a pin. Switch the active PHP on the [Switch](/guide/php-versions)
  page first if you need a newer Laravel.
- If no Composer is installed yet, Rezure downloads the newest stable Composer first.
- The dialog shows "Composer is downloading dependencies — this can take a few minutes." with
  no progress output. A slow connection makes it slower.
- If Composer fails, Rezure deletes the half-made folder and shows Composer's own error.

Afterwards, the project is served from its `public\` folder. Set up its database in `.env` —
the [Laravel .env Cheatsheet](/guide/laravel-env) has the values for every engine Rezure runs —
then run `php artisan migrate` in the [project terminal](/guide/project-terminal).

### WordPress

Rezure downloads `https://wordpress.org/latest.zip` and unpacks it straight into the project
folder (no extra `wordpress\` subfolder).

It **doesn't** create a database or a `wp-config.php`. After creating the project:

1. Start MariaDB and create a database on the **Databases** page (`myblog`, say).
2. Open the site. WordPress's own installer asks for the database details: database name
   `myblog`, user `root`, an empty password, host `127.0.0.1`.

If the download or unpack fails halfway, the partial folder stays behind and a retry says the
name already exists. Delete the folder from `www` and try again.

### Blank PHP and Static HTML

One file each, so you can start writing straight away. They're served from the project folder
itself.

## JavaScript projects

There are no Node templates (Vue, React, and so on) in this dialog. Create the project with
your framework's own tool in a [project terminal](/guide/project-terminal) or any terminal —
`npm create vite@latest` inside `C:\rezure\www`, for example — after installing Node.js from
the [Switch](/guide/nodejs) page. Rezure lists the new folder as a project, but serves it as
static files; run its dev server yourself for live reload.

## Troubleshooting

### "PHP isn't installed yet"

Laravel needs a PHP version. Install one from the **Switch** page first.

### Laravel fails with a Composer error about a PHP extension

The active PHP is missing an extension that Laravel or one of its packages requires. Turn it on
on the [PHP Extensions](/guide/php-extensions) page for that version, then try again.

### Laravel fails with "cURL error 60" or an SSL error

PHP can't verify HTTPS certificates, so Composer can't download anything. Install the CA bundle
from the **CA certificates** card on the Switch page. See
[PHP Configuration](/guide/php-configuration#ca-certificates).

### The new domain doesn't open

New projects get their virtual host straight away, but not their `hosts` entry. Click
**Sync hosts file** on the Projects page.

## Related

- [Projects](/guide/projects) — stack detection, domains, and project actions
- [Requirements Check](/guide/requirements-check) — check a project's extensions and settings
- [Laravel .env Cheatsheet](/guide/laravel-env) — database and mail values

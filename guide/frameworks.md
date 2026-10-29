---
title: Serve Laravel, CodeIgniter 4, and Symfony from public/
description: 'Rezure detects Laravel, CodeIgniter 4, Symfony, WordPress, Drupal, Next.js, and more, and serves each from the right folder. Change it or add your own.'
---

# Frameworks

Rezure works out which framework each project uses by reading its files, and the framework
decides how Nginx serves it:

- A **PHP framework** decides **which folder** is served. Laravel, CodeIgniter 4, and Symfony
  keep their front controller in `public/index.php`, so they're served from `public/`. Serve
  them from the project folder instead and every URL answers 404, even though the code is fine.
- A **JavaScript or Node framework** (Vue, React, Svelte, Angular, Astro, Next.js, Nuxt, Node) is
  served by its own **dev server**, which Rezure can start for you. See
  [Dev Servers](/guide/dev-servers).

Detection is automatic, and you can always override it. Nothing is executed to find out; Rezure
only reads files.

## Supported frameworks

| Framework | Detected by | Served from |
| --- | --- | --- |
| **Laravel** | `artisan`, or `laravel/framework` in `composer.json` | `public/` |
| **CodeIgniter 4** | `spark`, or `codeigniter4/framework` | `public/` |
| **CodeIgniter 3** | `system/core/CodeIgniter.php`, or `codeigniter/framework` | project folder |
| **WordPress** | `wp-config.php` or `wp-load.php` | project folder |
| **Bedrock** (Roots) | `roots/wordpress` and a `web/app/` folder | `web/` |
| **Drupal** | `drupal/core`, `drupal/core-recommended`, or `core/lib/Drupal.php` | `web/` |
| **Joomla** | an `administrator/` folder and `includes/defines.php` | project folder |
| **Symfony** | `symfony/framework-bundle` | `public/` |
| **Yii 2** | `yiisoft/yii2` | `web/` |
| **CakePHP** | `cakephp/cakephp` | `webroot/` |
| **Slim** | `slim/slim` | `public/` |
| **Laminas / Mezzio** | `laminas/laminas-mvc` or `mezzio/mezzio` | `public/` |
| **Next.js**, **Nuxt**, **Astro** | `next`, `nuxt`, `astro` in `package.json` | [dev server](/guide/dev-servers) |
| **Vue**, **React**, **Svelte**, **Angular** | `vue`, `react`, `svelte` or `@sveltejs/kit`, `@angular/core` | [dev server](/guide/dev-servers) |
| **PHP (public/)** | `public/index.php` and no `index.php` of its own | `public/` |
| **PHP** | `composer.json` or `index.php` | project folder |
| **Node** | any other `package.json` | [dev server](/guide/dev-servers) |
| **Static** | `index.html` | project folder |

A package counts when it's in `require` or `require-dev` (Composer) or in `dependencies` or
`devDependencies` (npm). A project nothing matches is **Unknown** and is served from its own
folder.

If a framework's folder doesn't exist in a particular project, say a Symfony app without
`public/`, the project is served from its own folder instead.

## How the right framework wins

Real projects match more than one framework. A CodeIgniter 4 app that keeps a `package.json` to
compile its Sass matches both CodeIgniter 4 and Node, and a Laravel app on Inertia matches both
Laravel and Vue. Rezure doesn't take whichever it checks first. It weighs every match, and the
**most specific one wins**:

| Priority | Kind | Examples |
| --- | --- | --- |
| 90 | PHP frameworks with a marker file of their own | Laravel, CodeIgniter 3 and 4, WordPress, Bedrock, Drupal, Joomla |
| 80 | PHP frameworks recognised through Composer | Symfony, Yii 2, CakePHP, Slim, Laminas |
| 55 | JavaScript meta-frameworks | Next.js, Nuxt, Astro |
| 50 | JavaScript frameworks | Vue, React, Svelte, Angular |
| 30 | Any PHP app with `public/index.php` and no `index.php` | PHP (public/) |
| 20 / 15 / 10 | Fallbacks | PHP, Node, Static |

So "PHP plus npm for assets" (Sass, Vite, Laravel Mix) is detected as the PHP framework it is,
and a Next.js app is Next.js, not React.

## See what a project is served as

Every project shows its framework as a badge on the [Projects](/guide/projects) page, in both
list and grid view. Hover it to see the folder it's served from, such as `public/`, and
click it to change the framework. For a dev-server project the badge also shows
its port, such as `Astro · :4400`.

When you link a folder with **Add folder**, the dialog shows the framework and the folder it'll
be served from before anything is saved, with **Change** next to the framework.

### Linked the `public/` folder by mistake?

Older Rezure versions served CodeIgniter 4 and Symfony from the project folder, and the usual
workaround was to link the project's `public/` folder directly. If you pick a `public/`,
`web/`, or `webroot/` folder now, the dialog says "This looks like the public folder of a
CodeIgniter 4 project" and offers **Add {project} instead**.

To clean up an old link of that kind: remove it from Rezure (the folder is left alone), then
add the project's root folder. The plain domain (`myapp.test` rather than `myapp-2.test`) comes
back, and **Folder** and **Terminal** open the project root instead of `public/`.

## Change a project's framework

1. On the **Projects** page, click the project's framework badge.
2. Pick another framework from the list. **Search frameworks** filters it.
3. The change is live at once: Rezure rewrites the project's virtual host and reloads Nginx.

The list also has two special entries:

- **Auto** goes back to detection.
- **Custom folder…** ("Serve a subfolder you name") serves any subfolder you type, such as
  `public` or `src/web`. This is also how you serve a JavaScript project's **built** `dist/`
  folder as plain files instead of through its dev server.

A badge with a dot was set by you. Its tooltip still names what detection found (for
example "detected: Node"), so you can always see what Rezure thought.

Changing the framework works for projects in `www` and linked projects alike. Choices are kept
in `C:\rezure\etc\project-frameworks.json`:

- A project in `www` is identified by its folder name, so **renaming the folder drops its
  choice**.
- Removing a linked project drops its choice with it.

## Add a framework Rezure doesn't know

An in-house framework, or one Rezure doesn't ship yet, can be added without waiting for a
release. Describe it in `C:\rezure\etc\frameworks.json`:

```json
{
  "frameworks": [
    {
      "id": "acme-cms",
      "label": "Acme CMS",
      "priority": 85,
      "detect": { "any": [{ "composer": "acme/cms-core" }, { "file": "acme.php" }] },
      "docroot": "htdocs"
    }
  ]
}
```

Then open any project's framework dialog and click **Reload frameworks.json**, or restart
Rezure. Your frameworks are listed first in the picker, under "Your frameworks".

- A **new id** adds a framework. A **built-in id** (`laravel`, `codeigniter4`, and so on)
  replaces that definition entirely.
- An entry that can't be used is skipped on its own and the rest of the file still applies. The
  Projects page shows "Some framework settings aren't being used" with the reason. A file that
  isn't valid JSON is ignored as a whole, and that's reported too.

### Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Lowercase letters, digits, and hyphens, up to 64 characters. `unknown` and `custom` are reserved. |
| `label` | yes | What the Projects page shows, up to 40 characters. |
| `priority` | yes | 0–100. The highest match wins; on a tie, the one listed first. Use the bands in [How the right framework wins](#how-the-right-framework-wins). |
| `detect` | yes | When a project is this framework. See [Detect rules](#detect-rules). |
| `docroot` | no | The subfolder to serve, relative to the project. Left out: the project folder. |
| `category` | no | The heading it's listed under in the picker, up to 24 characters. |
| `serve` | no | `php` (the default) or `proxy` for a dev server. See [Dev Servers](/guide/dev-servers). |
| `dev` | no | With `"serve": "proxy"` only: `{ "script": "dev", "port": "vite" }`. See [how the port is passed](/guide/dev-servers#how-the-port-is-passed). |

Unknown fields are refused rather than ignored, so a typo like `docRoot` is reported instead of
silently doing nothing.

### Detect rules

A rule is an object with exactly one key:

| Rule | Matches when |
| --- | --- |
| `{ "file": "artisan" }` | that file exists (nested paths work: `system/core/CodeIgniter.php`) |
| `{ "dir": "web/app" }` | that folder exists |
| `{ "composer": "laravel/framework" }` | `composer.json` lists the package in `require` or `require-dev` |
| `{ "npm": "next" }` | `package.json` lists the package in `dependencies` or `devDependencies` |
| `{ "any": [ … ] }` | at least one rule inside matches |
| `{ "all": [ … ] }` | every rule inside matches |
| `{ "not": { … } }` | the rule inside doesn't match |

Package names are compared case-insensitively, and rules nest at most 8 deep. Paths in
`docroot`, `file`, and `dir` must be relative to the project: no drive letter, no leading slash,
no `..`. Both `/` and `\` work.

To share a definition with everyone, open a pull request adding it to
[`src-tauri/resources/frameworks.json`](https://github.com/myahyazahid/rezure/blob/main/src-tauri/resources/frameworks.json)
along with a small test fixture. The repository's `docs/v1/frameworks.md` explains how.

## How Nginx serves each kind

| Profile | What Nginx does | Used by |
| --- | --- | --- |
| `php` | Serves the folder's files as they are and sends everything else to `index.php` over FastCGI. Dotfiles such as `.env` and `.git` answer **404**, apart from `.well-known`. | Every PHP framework, Static, and Custom folder |
| `proxy` | Passes every request, hot-reload websockets included, to the project's dev server on its own port. | Next.js, Nuxt, Astro, Vue, React, Svelte, Angular, Node |

Blocking dotfiles matters for projects served from their own folder, such as WordPress,
CodeIgniter 3, and plain PHP: before Rezure 3.3, `http://myapp.test/.env` could download that
project's `.env`.

A framework definition only picks a profile. It can't add Nginx directives of its own, because
every site shares one Nginx config and one broken directive would stop them all.

## Troubleshooting

### The site answers 404, or lists a folder

The project is probably served from the wrong folder. Hover its framework badge to check where
it's served from. Then click the badge and pick the right framework, or **Custom folder…** if
the project uses its own layout.

### "Some framework settings aren't being used"

An entry in `etc\frameworks.json` was skipped (the message says why), or a project is set to a
framework that's no longer defined. In the meantime that project is served as detected. Fix the
file, then click **Reload** next to the message.

### The domain got a `-2` suffix

Another project, often an old link to the same project's `public/` folder, already has the
plain name. See [Linked the public/ folder by mistake?](#linked-the-public-folder-by-mistake).

## What's sent about frameworks

When you add a folder or change a project's framework, Rezure's anonymous usage data records the
framework **id** that was detected and the one you chose, such as `node` and `codeigniter4`.
This shows where detection gets projects wrong. Never the project's name, path, domain, or
files. A framework from your own `frameworks.json` is reported only as `user-defined`, and a
custom folder only as `custom`. See [Privacy & Usage Data](/guide/privacy).

## Related

- [Projects](/guide/projects): domains, the hosts file, and every action on a project
- [Dev Servers](/guide/dev-servers): Vite, Next.js, Astro, and Nuxt on `.test` domains
- [Coming from Laragon or XAMPP](/guide/switch-from-laragon-xampp): moving existing projects over

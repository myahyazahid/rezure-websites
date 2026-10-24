---
title: Laravel .env for MySQL, PostgreSQL, SQL Server, and Mailpit
description: The .env values for a Laravel project on Rezure — MariaDB or MySQL, PostgreSQL, SQL Server LocalDB, another SQL Server, Mailpit, and APP_URL — in one place.
---

# Laravel .env Cheatsheet

Every value a Laravel project needs to talk to Rezure's services, in one place. After editing
`.env`, run `php artisan config:clear` if you've cached your config.

## App

```dotenv
APP_URL=http://myapp.test
```

Use your project's domain from the Projects page, over plain `http://` — there's no local HTTPS.

## MariaDB or MySQL

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

- Create `myapp` on the **Databases** page first (**New database**).
- `DB_CONNECTION=mariadb` works too on Laravel 11 and newer.
- An adopted Laragon or XAMPP data directory keeps its own users. See
  [MariaDB & MySQL](/guide/mariadb-mysql).

## PostgreSQL

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

- Turn on **`pdo_pgsql`** on [PHP Extensions](/guide/php-extensions) — it's off by default.
- `postgres` works as the username too. Any password is accepted.
- Create the database on the **Databases** page with the **PostgreSQL** connection selected.

See [PostgreSQL](/guide/postgresql).

## SQL Server LocalDB

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=(localdb)\Rezure
DB_PORT=
DB_DATABASE=myapp
DB_USERNAME=
DB_PASSWORD=
```

- Install **`pdo_sqlsrv`** on PHP Extensions and the **ODBC Driver**.
- **Keep `DB_PORT=` present and empty**, or Laravel appends `,1433` and the connection fails.
- An empty username means Windows authentication.
- Certificate error with ODBC Driver 18? Uncomment `'trust_server_certificate'` in
  `config/database.php` and add:

  ```dotenv
  DB_TRUST_SERVER_CERTIFICATE=true
  ```

See [SQL Server](/guide/sql-server).

## Another SQL Server

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=db.office.local
DB_PORT=1433
DB_DATABASE=myapp
DB_USERNAME=app_user
DB_PASSWORD=secret
```

For a named instance, use `DB_HOST=db.office.local\SQLEXPRESS` and leave `DB_PORT=` empty.

## Mail (Mailpit)

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

Not `MAIL_HOST=mailpit` (that's Laravel Sail's Docker hostname) and not port 2525 (Laravel's
default). Open the inbox at `http://127.0.0.1:8025`. See [Mailpit](/guide/mailpit).

## Cache, queue, and session

Rezure has no Redis server yet, so keep Laravel's database- or file-backed drivers:

```dotenv
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
```

Run `php artisan queue:work` in a [project terminal](/guide/project-terminal) to process queued
jobs. The `redis` PHP extension can be installed from PHP Extensions if you point Laravel at a
Redis server running elsewhere.

## Check it

The project's [Requirements Check](/guide/requirements-check) reads `.env` and flags the common
mistakes above for the default database connection and for mail — with a fix button where
there is one.

## Related

- [First Run](/guide/first-run) — the first database connection
- [Project Terminal](/guide/project-terminal) — `php artisan migrate` on the right PHP

---
title: .env Laravel untuk MySQL, PostgreSQL, SQL Server, dan Mailpit
description: 'Semua nilai .env yang dibutuhkan proyek Laravel di Rezure, di satu tempat: MariaDB atau MySQL, PostgreSQL, SQL Server LocalDB, Mailpit, dan APP_URL.'
---

# Contekan .env Laravel

Semua nilai yang dibutuhkan proyek Laravel untuk berkomunikasi dengan layanan Rezure, di satu
tempat. Setelah mengedit `.env`, jalankan `php artisan config:clear` kalau kamu meng-cache
konfigurasi.

## Aplikasi {#app}

```dotenv
APP_URL=http://myapp.test
```

Pakai domain proyekmu dari halaman Projects, lewat `http://` biasa; tidak ada HTTPS lokal.

## MariaDB atau MySQL {#mariadb-or-mysql}

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

- Buat `myapp` di halaman **Databases** dulu (**New database**).
- `DB_CONNECTION=mariadb` juga bisa di Laravel 11 ke atas.
- Direktori data Laragon atau XAMPP yang diadopsi tetap memakai user-nya sendiri. Lihat
  [MariaDB & MySQL](/id/guide/mariadb-mysql).

## PostgreSQL {#postgresql}

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

- Nyalakan **`pdo_pgsql`** di [Ekstensi PHP](/id/guide/php-extensions): mati secara default.
- `postgres` juga bisa dipakai sebagai username. Password apa pun diterima.
- Buat database di halaman **Databases** dengan koneksi **PostgreSQL** terpilih.

Lihat [PostgreSQL](/id/guide/postgresql).

## SQL Server LocalDB {#sql-server-localdb}

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=(localdb)\Rezure
DB_PORT=
DB_DATABASE=myapp
DB_USERNAME=
DB_PASSWORD=
```

- Pasang **`pdo_sqlsrv`** di PHP Extensions dan **ODBC Driver**.
- **Biarkan `DB_PORT=` ada dan kosong**, kalau tidak Laravel menambahkan `,1433` dan koneksinya
  gagal.
- Username kosong berarti autentikasi Windows.
- Error sertifikat dengan ODBC Driver 18? Hapus komentar `'trust_server_certificate'` di
  `config/database.php` dan tambahkan:

  ```dotenv
  DB_TRUST_SERVER_CERTIFICATE=true
  ```

Lihat [SQL Server](/id/guide/sql-server).

## SQL Server lain {#another-sql-server}

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=db.office.local
DB_PORT=1433
DB_DATABASE=myapp
DB_USERNAME=app_user
DB_PASSWORD=secret
```

Untuk named instance, pakai `DB_HOST=db.office.local\SQLEXPRESS` dan kosongkan `DB_PORT=`.

## Email (Mailpit) {#mail-mailpit}

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

Bukan `MAIL_HOST=mailpit` (itu hostname Docker milik Laravel Sail) dan bukan port 2525 (default
Laravel). Buka inbox di `http://127.0.0.1:8025`. Lihat [Mailpit](/id/guide/mailpit).

## Cache, queue, dan session {#cache-queue-and-session}

Rezure belum punya server Redis, jadi tetap pakai driver Laravel berbasis database atau file:

```dotenv
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
```

Jalankan `php artisan queue:work` di [terminal proyek](/id/guide/project-terminal) untuk memproses
job di antrean. Ekstensi PHP `redis` bisa dipasang dari PHP Extensions kalau kamu mengarahkan
Laravel ke server Redis yang berjalan di tempat lain.

## Mengeceknya {#check-it}

[Cek Kebutuhan](/id/guide/requirements-check) proyek membaca `.env` dan menandai kesalahan umum di
atas untuk koneksi database default dan email, dengan tombol perbaikan kalau ada.

## Terkait {#related}

- [Pertama Kali Dijalankan](/id/guide/first-run): koneksi database pertama
- [Terminal Proyek](/id/guide/project-terminal): `php artisan migrate` dengan PHP yang tepat

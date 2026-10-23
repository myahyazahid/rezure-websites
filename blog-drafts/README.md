# Blog drafts — mengejar ketertinggalan docs dari Rezure app

Draf artikel untuk dipublish lewat dashboard `api.redscale.my.id/dashboard/blogs` (Laravel API).
Website terakhir membahas: sharing (Cloudflare tunnel), PHP per project, remote database.
App sekarang di **v3.1.1**, dan semua fitur di bawah ini belum ada di website sama sekali.

Konten artikel ditulis dalam bahasa Inggris (sama dengan website dan 3 post yang sudah ada).

## Cara publish

1. Buka file draf (`01-….html`) di browser (double-click). Isinya tampil sebagai artikel jadi.
2. Dashboard → **New article** (atau Edit). Isi Title, Slug, Excerpt, Tags pakai tombol **Copy**
   di panel atas draf. Author dikosongkan (default ke nama user).
3. Di editor konten, mode **Visual**, kosongkan isinya (Ctrl+A, Delete).
4. Klik **Copy article** di draf, klik di editor, Ctrl+V. Heading, bold, list, link, kutipan, dan
   `code` ikut terbawa.
5. Status `draft` dulu untuk review, lalu toggle publish → GitHub Actions rebuild website.

Draf hanya memakai format yang di-style `BlogPost.vue`: heading 2/3, paragraf, list, bold, `code`,
link, kutipan. Tidak ada tabel atau code block (tidak di-style di website).

Quill menyimpan bullet list sebagai `<ol><li data-list="bullet">`. `BlogPost.vue` sudah ditambah
style untuk itu; perubahan itu harus sudah ter-deploy supaya bullet tidak tampil bernomor.

## Daftar artikel

| # | Judul | Slug | Tags | Status |
|---|---|---|---|---|
| 1 | What's New in Rezure 3.1 | `whats-new-in-rezure-3-1` | `release, changelog` | **draf siap** → [01-whats-new-in-rezure-3-1.html](01-whats-new-in-rezure-3-1.html) |
| 2 | Running PostgreSQL Next to MariaDB in Rezure | `postgresql-next-to-mariadb` | `tutorial, postgresql, database` | belum |
| 3 | SQL Server for PHP Developers, Without the Driver Hunt | `sql-server-for-php-developers` | `tutorial, sql-server, php` | belum |
| 4 | Catch Every Email Locally with Mailpit | `catch-every-email-with-mailpit` | `tutorial, mailpit, laravel` | belum |
| 5 | Node.js Versions Per Project | `nodejs-versions-per-project` | `tutorial, nodejs` | belum |
| 6 | One Install Button for Every Runtime | `one-install-button-for-every-runtime` | `feature, runtimes` | belum |
| 7 | PHP Extensions Without Editing php.ini | `php-extensions-without-editing-php-ini` | `tutorial, php` | belum |
| 8 | Why PHP Threw 502s on Windows, and How We Fixed It | `why-php-threw-502s-on-windows` | `behind-the-scenes, php, nginx` | belum |
| 9 | Teach Your AI Coding Agent About Your Local Stack | `teach-your-ai-agent-about-rezure` | `feature, ai` | belum |
| 10 | Make Rezure Yours: Themes, Stickers, and Manage Services | `themes-stickers-and-manage-services` | `feature, appearance` | belum |
| 11 | Updates You Can Trust: How Rezure Verifies Itself | `signed-in-app-updates` | `behind-the-scenes, security` | belum |

### Isi per artikel

**1. What's New in Rezure 3.1** — artikel induk. Ringkasan semua yang berubah sejak docs terakhir:
PostgreSQL, SQL Server, Mailpit, Node.js, tombol Install version untuk semua runtime, halaman PHP
Extensions, stabilitas PHP, Manage services, Appearance, AGENTS.md, update dalam app, dan perbaikan
port di 3.1.1. Setiap bagian nanti ditautkan ke artikel 2–11 begitu terbit.

> Title dan excerpt final ada di panel atas file draf.

**2. PostgreSQL** — install 16/17/18 dari Install version (zip EDB, tanpa admin/UAC), service
sendiri di port 5432 yang jalan berdampingan dengan MariaDB, datadir per major
(`data\postgres\<major>\`), role `postgres` + `root` dengan auth `trust` di 127.0.0.1, `.env`
Laravel `pgsql` tanpa password, PostgreSQL di halaman Databases. Batasan: jangan jalankan Rezure
"as administrator", tidak ada `pg_upgrade` antar major, adopsi datadir Laragon belum ada.

**3. SQL Server** — target: developer PHP (bukan .NET). Tiga lapis: `sqlsrv`/`pdo_sqlsrv` per
versi PHP (tanpa admin), ODBC Driver 18 (1x UAC + centang EULA), LocalDB opsional (proses user,
start/stop tanpa admin). Koneksi SQL Server di halaman Databases, contoh `.env` Laravel `sqlsrv`.
Batasan: butuh admin sekali, terpasang di level sistem, driver telat untuk PHP terbaru, batas 10 GB
LocalDB, export remote belum ada.

**4. Mailpit** — install dari Services/Switch, SMTP `127.0.0.1:1025`, inbox
`http://127.0.0.1:8025`, email tetap tersimpan setelah restart, kredensial apa pun diterima.
Langkah `.env` Laravel. Requirements check menangkap `MAIL_PORT=2525` dan `MAIL_HOST=mailpit`
(hostname Sail).

**5. Node.js** — install versi terbaru tiap LTS + Current terbaru, versi global di halaman Switch,
pin per project dari project card, berlaku di terminal yang dibuka dari project card
(`node`/`npm`/`npx`), versi npm ikut ditampilkan. Catatan bug Windows Terminal yang sudah diperbaiki.

**6. Install version** — satu modal untuk PHP, Nginx, MariaDB, PostgreSQL, Mailpit, SQL Server
LocalDB, Composer, Node.js. Dropdown di halaman Switch sekarang hanya untuk berpindah versi. Dari
mana tiap katalog diambil dan bagaimana checksum SHA-256 diverifikasi. Kenapa MariaDB tidak bisa
"turun versi" semudah PHP.

**7. PHP Extensions** — menu PHP Extensions: toggle ±40 ekstensi per versi PHP, pilihan disimpan
per versi (bukan di php.ini), badge "not in this build", opcache off by default dan alasannya,
notice restart, install `redis` lewat PECL dari requirements check.

**8. 502 di Windows (behind the scenes)** — `php-cgi` keluar setelah 500 request, satu `php-cgi`
hanya melayani satu request, worker pool per versi, watchdog dengan backoff, upload 64 MB / timeout
300 detik, CA bundle + cek HTTPS di requirements check.

**9. AGENTS.md** — kenapa agent AI mengira mesinmu pakai Laragon, tiga file yang ditulis Rezure
(`AGENTS.md`, `CLAUDE.md`, `docs\how-rezure-works.md`), diperbarui otomatis, project di `www\`
langsung kebaca, tips satu baris `@C:\rezure\AGENTS.md` untuk project di luar folder Rezure.

**10. Appearance & Manage services** — 14 tema (Default/Girls/Mens, termasuk 3 tema glass),
tombol Light/Dark di title bar, kecerahan/intensitas/opacity glass/ukuran UI/kurangi animasi,
stiker bawaan + Browse katalog. Manage services: sembunyikan kartu service yang tidak dipakai
(bukan uninstall).

**11. Signed updates (behind the scenes)** — tombol Update di Changelog, manifest bertanda tangan
ed25519, kenapa checksum dari server yang sama tidak cukup, uji dengan installer yang diutak-atik,
bug `shallowRef` yang ditemukan lewat uji ini.

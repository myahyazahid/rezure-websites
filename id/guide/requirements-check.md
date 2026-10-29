---
title: "Cek Kebutuhan: Temukan Ekstensi PHP yang Hilang"
description: 'Requirements Check di Rezure menemukan ekstensi PHP yang hilang, HTTPS dari PHP yang rusak, serta pengaturan email atau database yang tidak bisa tersambung, dengan tombol perbaikan.'
---

# Cek Kebutuhan

Aplikasi Laravel yang kehilangan satu ekstensi PHP biasanya gagal sebagai **500** kosong dengan
alasan sebenarnya terkubur di `laravel.log`. **Requirements check** di baris setiap proyek mencari
celah seperti itu sebelum kamu mengalaminya, dan menawarkan perbaikan sekali klik kalau Rezure
bisa melakukannya.

Klik ikon **Requirements check** proyek ("Check this project's PHP extension requirements").
Dialog menampilkan "Asking PHP…" selama berjalan, lalu satu bagian per pengecekan. Pengecekan
yang tidak relevan untuk proyek tidak ditampilkan.

## Ekstensi PHP {#php-extensions}

Rezure membaca entri `ext-*` di `composer.json` proyek (baik `require` maupun `require-dev`), dan
membandingkannya dengan yang benar-benar dimuat PHP, memakai pengaturan yang sama dengan web
server.

| Hasil | Arti |
| --- | --- |
| "PHP X has everything this project asks for." | Tidak ada yang hilang. |
| "PHP X is missing **a, b**." | Ekstensi itu dibutuhkan tetapi tidak dimuat. |
| "This project doesn't require any PHP extension explicitly." | `composer.json` tidak punya entri `ext-*`. |
| "No composer.json here, so there's nothing to check." | Bukan proyek Composer. |

Setiap ekstensi mendapat ✓ atau **!**; kebutuhan dari `require-dev` ditandai **dev only** dan
tidak dihitung sebagai hilang.

**Memperbaikinya:**

- Untuk kebanyakan ekstensi, perbaikannya cukup toggle: buka
  [Ekstensi PHP](/id/guide/php-extensions), pilih versi PHP yang sama, aktifkan ekstensinya, lalu
  restart PHP.
- Untuk tiga ekstensi yang tidak dibawa PHP (**redis**, **pdo_sqlsrv**, dan **sqlsrv**), dialog
  punya tombol **Install** yang mengunduh build yang sudah diverifikasi checksum-nya. Restart
  layanan PHP setelahnya supaya situs yang sedang berjalan ikut memakainya.

## HTTPS dari PHP {#https-from-php}

Pengecekan ini selalu berjalan. PHP membuat request uji ke `https://repo.packagist.org` dan
melaporkan apakah verifikasi sertifikat berfungsi.

- "HTTPS calls from PHP verify certificates.": semuanya baik.
- Pesan tentang **cURL error 60**: PHP tidak punya bundel CA untuk memverifikasi sertifikat, jadi
  setiap panggilan HTTPS keluar (Composer, API pembayaran, OAuth) gagal. Klik
  **Download CA bundle** (atau **Update CA bundle**), lalu restart PHP. Lihat
  [Konfigurasi PHP](/id/guide/php-configuration#ca-certificates).
- "Couldn't reach the internet to test HTTPS…": pengujian sama sekali tidak bisa tersambung; cek
  koneksimu lalu jalankan lagi.

## Email {#mail}

Ditampilkan saat `.env` proyek mengirim email lewat SMTP ke host lokal atau ke `mailpit`.

- `MAIL_HOST=mailpit` adalah hostname Docker milik Laravel Sail dan tidak ada di luar Docker. Atur
  `MAIL_HOST=127.0.0.1`.
- Port selain 1025 (`.env` default Laravel memakai 2525) mendapat saran untuk mengatur
  `MAIL_PORT=1025`.
- Mailpit yang belum terpasang atau belum berjalan mendapat **Install and start Mailpit** atau
  **Start Mailpit**.
- Saat semuanya cocok: "Mail this project sends is caught by Mailpit." dengan **Open inbox**.

Lihat [Mailpit](/id/guide/mailpit).

## PostgreSQL {#postgresql}

Ditampilkan saat `.env` berisi `DB_CONNECTION=pgsql`.

- `pdo_pgsql` mati → **Turn on pdo_pgsql**. Ekstensi ini dibawa PHP tetapi mati secara default,
  dan tanpanya Laravel gagal dengan "could not find driver".
- PostgreSQL belum terpasang atau belum berjalan → **Install PostgreSQL** atau
  **Start PostgreSQL**.
- `DB_PORT` bukan 5432 → atur `DB_PORT=5432`.
- Username bukan role di server → atur `DB_USERNAME=root` (atau `postgres`); password apa pun
  bisa.
- Saat siap: "PostgreSQL is ready: this project uses Rezure's server as root."

Lihat [PostgreSQL](/id/guide/postgresql).

## SQL Server {#sql-server}

Ditampilkan saat `.env` berisi `DB_CONNECTION=sqlsrv`.

- `pdo_sqlsrv` tidak dimuat → **Install pdo_sqlsrv**.
- Tidak ada driver ODBC → **Install ODBC Driver** (dialog lisensi Microsoft muncul dulu, lalu satu
  prompt administrator).
- `DB_HOST` berisi `(localdb)\Rezure` tetapi LocalDB belum terpasang → **Install LocalDB**.
- LocalDB dengan nilai di `DB_PORT` → kosongkan `DB_PORT=`. Kalau tidak, Laravel menambahkan
  `,1433`, padahal LocalDB tidak mendengarkan di sana.
- ODBC Driver 18 tanpa konfigurasi trust sertifikat → catatan untuk menghapus komentar
  `'trust_server_certificate'` di `config/database.php` dan mengatur
  `DB_TRUST_SERVER_CERTIFICATE=true`.
- Saat siap: "SQL Server is ready: this project uses Rezure's LocalDB." atau "PHP can reach SQL
  Server at {host}."

Lihat [SQL Server](/id/guide/sql-server).

## Batasan {#limitations}

- **Berjalan dengan PHP aktif global**, bahkan untuk proyek yang
  [dikunci](/id/guide/project-php-version) ke versi lain. Untuk proyek yang dikunci, cek
  ekstensinya dengan `php -m` di [terminal proyek](/id/guide/project-terminal).
- **Hanya koneksi default yang dicek**: apa pun isi `DB_CONNECTION`. Koneksi tambahan di
  `config/database.php` tidak dicek.
- `composer.json` yang rusak dianggap "tidak ada yang perlu dicek".
- Petunjuk di dialog tentang menambahkan baris `extension=` ke file `.ini` berasal dari sebelum
  ada halaman [Ekstensi PHP](/id/guide/php-extensions); pakai toggle di sana saja.

## Terkait {#related}

- [Ekstensi PHP](/id/guide/php-extensions): nyalakan dan matikan ekstensi per versi
- [Contekan .env Laravel](/id/guide/laravel-env): nilai yang benar untuk setiap engine
- [Log](/id/guide/logs): saat pengecekan lolos tetapi situs tetap gagal

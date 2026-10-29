---
title: Membuat Proyek Laravel atau WordPress Secara Lokal
description: 'Buat proyek Laravel, WordPress, PHP kosong, atau HTML statis di Rezure dengan satu dialog: apa yang dilakukan setiap template, berapa lama, dan langkah selanjutnya.'
---

# Proyek Baru

**New project** di halaman Projects membuat folder proyek di `C:\rezure\www`, mengisinya dari
template, dan menulis virtual host-nya: dua langkah, tanpa terminal.

## Membuat proyek {#create-a-project}

1. Di halaman **Projects**, klik **New project**.
2. **Step 1 of 2: pick a starting point.** Pilih template (di bawah) lalu klik **Continue**.
3. **Step 2 of 2: name it and go.** Ketik **Project name**. Dialog menampilkan pratinjau domain
   lokal (`<nama>.test`) dan folder yang akan dibuat.
4. Klik **Create project**. Dialog tidak bisa ditutup selama bekerja.
5. Setelah selesai, klik **Sync hosts file** supaya domain baru bisa di-resolve, lalu **Open**.

Nama harus 1–64 karakter berupa huruf kecil, angka, dan tanda hubung, dan tidak boleh diawali
atau diakhiri tanda hubung. Nama yang sudah dipakai proyek lain ditolak.

## Template {#templates}

| Template | Yang kamu dapat | Durasi |
| --- | --- | --- |
| **Laravel** | Aplikasi Laravel baru lewat Composer, `artisan` siap pakai | Biasanya 3–6 menit |
| **WordPress** | Core WordPress terbaru dari wordpress.org | Biasanya sekitar satu menit |
| **Blank PHP** | Satu `index.php` yang mencetak "Hello from Rezure!" | Instan |
| **Static HTML** | Satu `index.html` bertuliskan "Hello from Rezure!" | Instan |

### Laravel {#laravel}

Rezure menjalankan `create-project laravel/laravel` milik Composer untukmu, dengan **PHP aktif
global** serta pengaturan dan ekstensi PHP milik Rezure.

- Kamu mendapat **rilis Laravel terbaru yang didukung versi PHP aktifmu**: label versi di kartu
  template bukan versi yang dikunci. Ganti PHP aktif di halaman [Switch](/id/guide/php-versions)
  dulu kalau butuh Laravel yang lebih baru.
- Kalau Composer belum terpasang, Rezure mengunduh Composer stabil terbaru lebih dulu.
- Dialog menampilkan "Composer is downloading dependencies; this can take a few minutes." tanpa
  output progres. Koneksi lambat membuatnya lebih lama.
- Kalau Composer gagal, Rezure menghapus folder yang setengah jadi dan menampilkan error dari
  Composer.

Setelah itu, proyek dilayani dari folder `public\`. Atur database-nya di `.env`
([Contekan .env Laravel](/id/guide/laravel-env) berisi nilai untuk setiap engine yang dijalankan
Rezure), lalu jalankan `php artisan migrate` di [terminal proyek](/id/guide/project-terminal).

### WordPress {#wordpress}

Rezure mengunduh `https://wordpress.org/latest.zip` dan mengekstraknya langsung ke folder proyek
(tanpa subfolder `wordpress\` tambahan).

Rezure **tidak** membuat database atau `wp-config.php`. Setelah membuat proyek:

1. Jalankan MariaDB dan buat database di halaman **Databases** (misalnya `myblog`).
2. Buka situsnya. Installer WordPress akan menanyakan detail database: nama database `myblog`,
   user `root`, password kosong, host `127.0.0.1`.

Kalau unduhan atau ekstraksi gagal di tengah jalan, folder setengah jadi tertinggal dan percobaan
ulang akan bilang namanya sudah ada. Hapus folder itu dari `www` lalu coba lagi.

### Blank PHP dan Static HTML {#blank-php-and-static-html}

Masing-masing satu file, supaya kamu bisa langsung mulai menulis. Keduanya dilayani dari folder
proyek itu sendiri.

## Proyek JavaScript {#javascript-projects}

Tidak ada template Node (Vue, React, dan sebagainya) di dialog ini. Buat proyeknya dengan tool
framework-mu sendiri di [terminal proyek](/id/guide/project-terminal) atau terminal apa pun
(misalnya `npm create vite@latest` di dalam `C:\rezure\www`) setelah memasang Node.js dari
halaman [Switch](/id/guide/nodejs). Rezure menampilkan folder baru itu sebagai proyek dan
mendeteksi framework-nya. Klik **Open** dan Rezure menjalankan dev server-nya lalu membukanya di
`http://<nama>.test`, lengkap dengan hot reload. Lihat [Dev Server](/id/guide/dev-servers).

## Pemecahan masalah {#troubleshooting}

### "PHP isn't installed yet" {#php-isn-t-installed-yet}

Laravel butuh versi PHP. Pasang satu dari halaman **Switch** dulu.

### Laravel gagal dengan error Composer soal ekstensi PHP {#laravel-fails-with-a-composer-error-about-a-php-extension}

PHP aktif tidak punya ekstensi yang dibutuhkan Laravel atau salah satu package-nya. Aktifkan di
halaman [Ekstensi PHP](/id/guide/php-extensions) untuk versi itu, lalu coba lagi.

### Laravel gagal dengan "cURL error 60" atau error SSL {#laravel-fails-with-curl-error-60-or-an-ssl-error}

PHP tidak bisa memverifikasi sertifikat HTTPS, jadi Composer tidak bisa mengunduh apa pun. Pasang
bundel CA dari kartu **CA certificates** di halaman Switch. Lihat
[Konfigurasi PHP](/id/guide/php-configuration#ca-certificates).

### Domain baru tidak terbuka {#the-new-domain-doesn-t-open}

Proyek baru langsung mendapat virtual host, tetapi belum entri `hosts`-nya. Klik
**Sync hosts file** di halaman Projects.

## Terkait {#related}

- [Proyek](/id/guide/projects): deteksi stack, domain, dan aksi proyek
- [Cek Kebutuhan](/id/guide/requirements-check): cek ekstensi dan pengaturan proyek
- [Contekan .env Laravel](/id/guide/laravel-env): nilai database dan email

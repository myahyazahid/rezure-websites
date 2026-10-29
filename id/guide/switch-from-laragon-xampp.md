---
title: Pindah dari Laragon atau XAMPP ke Rezure
titleTemplate: false
description: 'Pindah dari Laragon atau XAMPP ke Rezure di Windows: tetap pakai database MySQL dan folder proyekmu, hindari konflik port, dan lihat apa saja yang berbeda.'
---

# Pindah dari Laragon atau XAMPP

Rezure adalah local development environment untuk Windows, seperti Laragon dan XAMPP: web
server, PHP, dan database di balik tombol start/stop. Kalau kamu sudah memakai salah satunya,
kamu tidak perlu mulai dari nol. Rezure bisa melayani proyek yang sudah ada langsung di
tempatnya dan membuka direktori data MySQL yang sudah ada tanpa menyalinnya, dan kamu boleh
tetap memasang stack lama selama mencobanya.

## Apa yang ikut terbawa {#what-carries-over}

| Yang kamu punya | Di Rezure |
| --- | --- |
| Proyek di `C:\laragon\www` atau `C:\xampp\htdocs` | Tautkan setiap folder di tempatnya dari halaman **Projects**; tidak ada yang disalin atau dipindah. Lihat [Menambahkan folder yang sudah ada](/id/guide/projects#add-an-existing-folder). |
| Database MySQL / MariaDB milik Laragon atau XAMPP | **Add data directory** menemukannya di lokasi default dan melayaninya dengan binary server dan `my.ini` milik tool itu sendiri. Lihat [Memakai direktori data Laragon atau XAMPP](/id/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory). |
| `root` dengan password kosong | Direktori data yang diadopsi tetap memakai user dan password-nya sendiri, jadi file `.env`-mu tetap berfungsi. |
| HeidiSQL, DBeaver, atau SQL client lain | Rezure menemukan client yang terpasang, termasuk HeidiSQL bawaan Laragon, dan membuka database di sana. |
| Domain `.test` | Rezure juga memakai `.test`: folder bernama `myapp` menjadi `myapp.test`. |
| Proyek Laravel, CodeIgniter, Symfony, WordPress | [Framework](/id/guide/frameworks) masing-masing dikenali dan dilayani dari folder yang benar (`public/` untuk Laravel, CodeIgniter 4, dan Symfony), tanpa konfigurasi per situs. |
| Aplikasi Vite, Next.js, atau Nuxt di `localhost:5173` | Mereka juga mendapat domain `.test`: Rezure menjalankan [dev server](/id/guide/dev-servers) dan Nginx meneruskan domain ke sana. |

## Langkah demi langkah {#step-by-step}

1. **Pasang Rezure.** Ikuti [Instalasi](/id/guide/installation). Nginx dan PHP 8.3 sudah ada
   di dalam installer.
2. **Hentikan Laragon atau XAMPP.** Kedua stack sama-sama butuh port 80 dan port 3306, dan satu
   port hanya bisa dipakai satu program. Kamu tidak perlu meng-uninstall apa pun. Kalau lupa,
   Rezure menyebut program yang memakai port itu: "port 80 is held by Laragon (nginx.exe, pid
   10244)", dan menawarkan untuk menghentikannya. Lihat [Konflik Port](/id/guide/port-conflicts).
3. **Adopsi database-mu.** Di halaman **Databases**, buka pengalih target, klik
   **+ Add data directory**, dan tambahkan instalasi Laragon atau XAMPP yang ditemukan Rezure.
   Lalu pindah ke sana.
4. **Tautkan proyekmu.** Di halaman **Projects**, tambahkan setiap folder proyek yang sudah ada:
   root proyeknya, bukan folder `public`-nya. Rezure menampilkan framework yang terdeteksi dan
   folder yang akan dilayani, menulis virtual host Nginx, lalu kamu klik **Sync hosts file**
   supaya domainnya bisa di-resolve.
5. **Pilih versi PHP.** Pasang versi PHP yang dibutuhkan proyekmu dari halaman **Switch**, dan
   [kunci versi per proyek](/id/guide/project-php-version) kalau berbeda-beda.
6. **Jalankan [Cek Kebutuhan](/id/guide/requirements-check)** di setiap proyek untuk menemukan
   ekstensi PHP yang hilang atau pengaturan database yang tidak bisa tersambung.

## Apa yang berbeda {#what-s-different}

- **Nginx, bukan Apache.** Web server Rezure adalah Nginx. Laravel, WordPress, dan kebanyakan
  aplikasi PHP berjalan di sana tanpa perubahan, tetapi file `.htaccess` diabaikan. Aturan
  rewrite Apache kustom butuh padanan versi Nginx.
- **PHP mendengarkan di port 9100 ke atas**, bukan 9000, jadi tidak pernah bentrok dengan PHP
  yang dijalankan Laragon atau XAMPP di sana.
- **Beberapa versi PHP sekaligus.** Setiap proyek bisa [dikunci](/id/guide/project-php-version)
  ke versi PHP-nya sendiri, dan semuanya melayani berdampingan.
- **PostgreSQL dan SQL Server** berjalan di samping MariaDB, dipasang dari dalam aplikasi. Lihat
  [PostgreSQL](/id/guide/postgresql) dan [SQL Server](/id/guide/sql-server).
- **Belum ada HTTPS lokal.** Situs dilayani lewat `http://` biasa.
- **Hanya Windows**, seperti Laragon. Tidak ada build macOS atau Linux.

## Menjalankan keduanya {#running-both}

Kamu boleh tetap memasang Laragon atau XAMPP dan kembali kapan saja; asal jangan jalankan kedua
stack bersamaan. Satu hal yang perlu diperhatikan: Laragon dan XAMPP sama-sama bisa menulis
ulang file `hosts` Windows dan menghapus entri milik Rezure. Kalau domain Rezure terus hilang
dari file `hosts`, hentikan tool lain itu atau matikan fitur pengelolaan hosts-nya. Lihat
[Proyek](/id/guide/projects#the-hosts-prompt-keeps-coming-back).

Direktori data yang diadopsi hanya bisa dilayani oleh satu server pada satu waktu. Rezure
mengecek ini sebelum berpindah dan menolak selama server database Laragon atau XAMPP masih
berjalan di folder yang sama.

## Terkait {#related}

- [Apa itu Rezure?](/id/guide/)
- [MariaDB & MySQL](/id/guide/mariadb-mysql)
- [Framework](/id/guide/frameworks)
- [Konflik Port](/id/guide/port-conflicts)
- [FAQ](/id/guide/faq)

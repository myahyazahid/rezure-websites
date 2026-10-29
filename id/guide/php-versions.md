---
title: Memasang dan Mengganti Versi PHP di Windows
description: Pasang versi PHP dari php.net di dalam Rezure, tambahkan build milikmu sendiri, ganti default global, dan kelola Composer serta runtime lain di halaman Switch.
---

# Versi PHP dan Halaman Switch

Halaman **Switch** ("Pick the runtime version each new shell and vhost should use.") menampilkan
setiap runtime yang dikelola Rezure, versi yang aktif, dan berapa banyak yang terpasang. Tombol
**Install version**-nya menambahkan lebih banyak. Halaman ini membahas PHP dan Composer secara
detail; runtime lain punya halaman sendiri.

## Baris runtime {#the-runtime-rows}

| Baris | Bisa diganti? | Efek memilih sebuah versi |
| --- | --- | --- |
| **PHP** | Ya | Mengatur PHP global dan me-restart layanan **PHP** yang sedang berjalan ke versi itu |
| **Node.js** | Ya | Mengatur Node yang dipakai terminal proyek. Lihat [Node.js](/id/guide/nodejs) |
| **Composer** | Ya | Mengatur Composer yang dijalankan Rezure sendiri, untuk [Proyek Baru](/id/guide/new-project) |
| **PostgreSQL** | Ya | Me-restart server dengan data milik versi itu sendiri. Lihat [PostgreSQL](/id/guide/postgresql#switch-versions) |
| **MariaDB** | Tidak | Menampilkan build terbaru yang terpasang. Build mana yang benar-benar berjalan ditentukan oleh [profil direktori data](/id/guide/mariadb-mysql) yang aktif |
| **Nginx**, **Mailpit**, **SQL Server LocalDB** | Tidak | Masing-masing satu versi yang dikunci; barisnya menunjukkan apakah sudah terpasang |
| **Python** | tidak ada | Abu-abu, "not available yet" |

Setiap baris menampilkan "active X" (atau "not installed"), jumlah "N installed", dan dropdown
versi yang terpasang dengan yang terbaru ditandai **latest**. Dropdown hanya menampilkan versi
yang sudah terpasang; versi baru didapat dari **Install version**.

## Memasang versi PHP {#install-a-php-version}

1. Di halaman **Switch**, klik **Install version** lalu pilih **PHP**.
2. Rezure membaca daftar rilis Windows dari php.net dan menampilkan **rilis terbaru dari setiap
   branch** (8.5, 8.4, 8.3, dan seterusnya) beserta tanggal rilis dan ukurannya. Yang terbaru
   ditandai **LATEST**.
3. Klik **Install** di sebelah versi yang kamu mau. Rezure mengunduhnya, mencocokkannya dengan
   SHA-256 yang dipublikasikan php.net, dan mengekstraknya ke `C:\rezure\bin\php\<version>`.

Versi baru langsung muncul di dropdown PHP. Dialog tidak bisa ditutup selama unduhan berjalan.

Rezure memasang build **non-thread-safe x64**, jenis yang berjalan di bawah web server FastCGI
seperti Nginx. Build thread-safe dimaksudkan untuk mode modul Apache dan tidak ditawarkan.

### Rilis patch yang lebih lama, atau build yang sudah kamu punya {#an-older-patch-release-or-a-build-you-already-have}

Daftar php.net hanya memuat patch terbaru dari setiap branch. Untuk yang lain (persis PHP 8.2.20,
7.4 lama, build yang dikirimkan orang), unduh zip dari
[windows.php.net](https://windows.php.net/downloads/releases/archives/) (pilih yang **NTS x64**),
ekstrak, lalu:

- pakai **Add from folder…** di dialog yang sama ("Already downloaded one?"). Rezure membaca versi
  aslinya dari `php.exe` dan menyalinnya ke folder drop-in; atau
- salin sendiri foldernya ke `C:\rezure\custom\php`. **Open folder** di dialog, atau kartu
  **Drop-in folder** di halaman Switch, membuka folder itu.

Rezure menemukannya di pemindaian berikutnya. Build yang ditambahkan dengan cara ini tidak
diverifikasi checksum-nya, dan halaman Switch menyebutkannya: "N PHP versions were added by hand:
Rezure didn't checksum those."

Folder itu butuh `php.exe` di tingkat teratas atau satu folder di bawahnya. Error yang mungkin
muncul: "no php.exe in X (or one folder below it)", atau "PHP X is already installed".

## Mengganti versi PHP global {#switch-the-global-php-version}

Pilih versi di dropdown baris **PHP**. Rezure:

1. menyimpannya sebagai default global,
2. mengarahkan ulang link `PATH` kalau
   [Use Rezure's PHP everywhere](/id/guide/php-configuration#use-rezure-s-php-everywhere) aktif,
3. me-restart layanan **PHP** utama ke versi baru kalau sedang berjalan.

Kamu akan melihat "Switching PHP…", lalu salah satu dari:

- "PHP X is active: the service was reloaded."
- "PHP X is active: it'll be used the next time PHP starts." (PHP tidak sedang berjalan.)
- "Switched to PHP X, but the service didn't restart: …". Alasannya menyusul; cek
  [Log](/id/guide/logs).

Nginx tetap berjalan selama proses ini. Proyek yang [dikunci](/id/guide/project-php-version) ke
versinya sendiri tidak terpengaruh.

## Menghapus versi PHP {#remove-a-php-version}

Tidak ada tombol uninstall. Keluar dari Rezure dan hapus folder versinya:
`C:\rezure\bin\php\<version>` untuk yang dipasang Rezure, atau foldernya di bawah
`C:\rezure\custom\php` untuk yang kamu tambahkan sendiri. Itu sudah penghapusan lengkap; proyek
yang dikunci ke versi itu kembali ke versi global.

Jangan hapus versi yang sedang aktif. Ganti ke versi lain dulu.

## Apa yang diatur Rezure untuk setiap versi PHP {#what-rezure-sets-up-for-every-php-version}

- `php.ini` buatan sendiri, ditulis ulang setiap kali start, sehingga versi-versi tidak pernah
  berbagi pengaturan ekstensi. Pengaturanmu sendiri masuk ke `C:\rezure\etc\php\conf.d`, yang
  dimuat setelahnya; lihat [Konfigurasi PHP](/id/guide/php-configuration).
- Default lokal yang masuk akal: `memory_limit` 256M, upload dan body POST sampai 64M (sesuai batas
  Nginx), `max_execution_time` 300, `date.timezone` UTC.
- Bundel CA, kalau sudah terpasang, supaya panggilan HTTPS dari PHP berfungsi.
- Set [toggle ekstensi](/id/guide/php-extensions) miliknya sendiri.

## Composer {#composer}

Rezure mengelola Composer dengan cara yang sama: **Install version → Composer** menampilkan rilis
stabil 2.x dari getcomposer.org, masing-masing dicocokkan dengan checksum yang dipublikasikan, dan
memasangnya ke `C:\rezure\bin\composer\<version>\composer.phar`.

Baris **Composer** di halaman Switch memilih versi yang dijalankan Rezure sendiri, untuk template
Laravel di [Proyek Baru](/id/guide/new-project). Dua hal yang perlu diketahui:

- **Pilihannya tidak diingat.** Setelah restart, Rezure kembali ke Composer terbaru yang terpasang.
- **Tidak ada perintah `composer` di `PATH`.** Lihat
  [Terminal Proyek](/id/guide/project-terminal#running-composer) untuk cara menjalankan Composer
  sendiri.

Kalau kamu tidak pernah memasangnya, Rezure mengunduh Composer stabil terbaru saat pertama kali
membutuhkannya.

## Runtime lainnya {#the-other-runtimes}

**Install version** juga mencakup Nginx, MariaDB, PostgreSQL, Mailpit, SQL Server LocalDB,
Composer, dan Node.js. Masing-masing menyebut dari mana daftarnya berasal (misalnya "Reading
MariaDB's release index…"), dan kalau sumbernya tidak bisa dijangkau kamu mendapat "Couldn't reach
… Retry". Nginx dan Mailpit masing-masing menawarkan satu build yang dikunci ("Only one build is
offered for now; there's nothing to pick between yet.").

- [Node.js](/id/guide/nodejs)
- [MariaDB & MySQL](/id/guide/mariadb-mysql#install-more-mariadb-versions)
- [PostgreSQL](/id/guide/postgresql)
- [SQL Server LocalDB](/id/guide/sql-server#install-localdb)
- [Mailpit](/id/guide/mailpit)

Python belum tersedia: Python tidak mempublikasikan checksum yang bisa dipakai Rezure untuk
memverifikasi unduhan.

## Terkait {#related}

- [PHP per Proyek](/id/guide/project-php-version): versi berbeda untuk proyek berbeda
- [Ekstensi PHP](/id/guide/php-extensions): nyalakan ekstensi per versi
- [Konfigurasi PHP](/id/guide/php-configuration): pengaturan `php.ini` milikmu, bundel CA, dan
  `PATH`

---
title: Log Layanan untuk Nginx, PHP, dan Database
description: Halaman Logs di Rezure, live tail gabungan yang bisa difilter dari output setiap layanan, plus di mana menemukan log yang tidak muncul di sana.
---

# Log

Halaman **Logs** adalah live tail gabungan dari setiap layanan: Nginx, PHP dan setiap versi PHP
yang dikunci, MariaDB atau MySQL, PostgreSQL, dan Mailpit. Saat ada yang tidak mau berjalan, ini
tempat pertama untuk dicek.

Untuk satu layanan, toggle logs di barisnya pada halaman [Layanan](/id/guide/services)
menampilkan 20 baris terakhir tanpa meninggalkan halaman.

## Membaca log {#reading-the-log}

Setiap baris menampilkan waktu masuknya, layanan asalnya, level, dan pesannya, yang terbaru di
atas. Footer menampilkan berapa baris yang tercantum dan apakah tampilan sedang **Live tail**
atau **Paused**.

### Filter {#filtering}

- **Filter log text**: mencocokkan di bagian mana pun dari pesan.
- **Service**: **All services**, atau salah satu dari `nginx`, `php`, `mariadb`, `postgres`,
  `mailpit`, plus satu per versi PHP yang dikunci seperti `php-8.1.34`. Filter `mariadb` juga
  mencakup profil MySQL.
- **Level**: **All**, **Info**, **Warn**, atau **Error**.

Level ditentukan dari teksnya sendiri: baris yang mengandung "error" atau "fatal" dihitung
sebagai **Error**, yang mengandung "warn" sebagai **Warn**. Artinya baris tak berbahaya yang
sekadar menyebut kata "error" juga ditandai begitu. Badge merah di **Logs** pada sidebar
menghitung baris-baris tersebut.

### Pause dan Clear {#pause-and-clear}

**Pause** membekukan tampilan supaya kamu bisa membaca. Baris yang masuk selama dijeda
**dibuang**, bukan diantrekan; klik **Resume** untuk melanjutkan tail. **Clear** mengosongkan
daftar.

## Apa yang disimpan halaman ini {#what-the-page-keeps}

- Hanya apa yang dicetak layanan ke konsolnya (standard output dan standard error), dan hanya
  selama Rezure terbuka.
- Paling banyak **1.000 baris** terbaru. Baris yang lebih lama terbuang.
- Tidak ada yang disimpan ke disk. Keluar dari Rezure mengosongkan halaman.

Saat kamu mengirim laporan dari halaman **Feedback**, **Attach latest log** menambahkan 200
baris terakhir dari buffer ini sebagai `latest-log.txt`. Baris-baris itu bisa berisi path folder,
jadi baca dulu sebelum mengirim.

## Log yang tidak muncul di sini {#logs-that-don-t-appear-here}

Beberapa program menulis ke file sendiri, bukan ke konsol:

| Apa | Di mana |
| --- | --- |
| Error Nginx | `C:\rezure\data\nginx\logs\error.log` |
| Error aplikasi Laravel-mu | `storage\logs\laravel.log` di dalam proyek |
| Log installer Microsoft (ODBC Driver, LocalDB) | `C:\rezure\data\installers\` |

SQL Server LocalDB tidak menghasilkan baris di halaman ini, dan tidak ada filter untuknya.

Halaman kosong atau **500** dari proyek Laravel biasanya hanya punya alasannya di
`laravel.log`. Ekstensi PHP yang hilang adalah penyebab umum;
[Cek Kebutuhan](/id/guide/requirements-check) bisa menemukannya.

## Terkait {#related}

- [Layanan](/id/guide/services): panel log per baris
- [Pemecahan Masalah](/id/guide/troubleshooting): error umum dan artinya

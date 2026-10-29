---
title: Mengatasi Port 80 atau 3306 yang Sudah Terpakai di Windows
description: 'Apa yang dilakukan Rezure saat port 80, 3306, atau port lain sudah terpakai: menyebut program yang memakainya, dan Stop it and start membebaskan port untukmu.'
---

# Konflik Port

Dua program tidak bisa mendengarkan di port yang sama. Kalau Nginx milik Laragon sudah memakai
port 80, Nginx milik Rezure tidak bisa berjalan, dan di kebanyakan stack hal ini muncul sebagai
layanan yang diam-diam menolak berjalan.

Rezure mengecek setiap port yang dibutuhkan sebuah layanan **sebelum** menjalankannya. Saat ada
yang terpakai, Rezure berhenti di situ dan memberi tahu persis apa yang memakainya.

## Yang akan kamu lihat {#what-you-see}

Baris layanan menampilkan pesan seperti:

```
can't start Nginx: port 80 is held by Laragon (nginx.exe, pid 10244)
```

Rezure mencari port itu di tabel koneksi Windows dan mengelompokkan pemakainya ke salah satu
dari tiga jenis:

| Pemakai | Contoh pesan | Yang bisa kamu lakukan |
| --- | --- | --- |
| **Proses Rezure yang tertinggal**: sesuatu yang berjalan dari `C:\rezure\bin` atau `C:\rezure\custom` | "port 80 is held by a leftover Rezure process (nginx.exe, pid X) from an earlier run" | **Stop it and start Nginx** |
| **Program lain**: Laragon, XAMPP, WAMP, MAMP, dan Docker dikenali dari namanya; selain itu disebut berdasarkan executable-nya | "port 3306 is held by XAMPP (mysqld.exe, pid X)" | **Stop it and start MariaDB**, setelah peringatan |
| **Windows sendiri** | "port 80 is reserved by Windows itself: usually IIS or the World Wide Web Publishing service. Stop that service to free it." | Hentikan sendiri layanan Windows tersebut |

Baris itu juga menampilkan path pemakainya kalau Rezure bisa membacanya, jadi kamu bisa melihat
instalasi mana pemiliknya.

## Stop it and start {#stop-it-and-start}

Untuk dua jenis pertama, baris menawarkan tombol **Stop it and start {service}** dan **Cancel**.
Untuk program yang bukan milik Rezure ada baris tambahan: "This isn't Rezure's: make sure you
don't need it running."

Saat kamu mengkliknya, Rezure:

1. Mencari pemakainya sekali lagi, supaya tidak pernah mematikan proses yang ternyata sudah
   keluar dan ID-nya dipakai ulang.
2. Mengakhiri **seluruh pohon proses** pemakainya. Nginx dan MySQL sama-sama menjalankan proses
   induk yang kalau tidak dimatikan akan memunculkan lagi worker yang kamu matikan, jadi Rezure
   mulai dari leluhur teratas yang menjalankan program yang sama.
3. Menunggu sampai 2,5 detik hingga port bebas, lalu menjalankan layananmu.

Ini tidak pernah meminta hak administrator. Kalau pemakainya berjalan elevated atau sebagai user
Windows lain, Windows tidak mengizinkan Rezure mengakhirinya, dan kamu akan melihat "{name} did
not release port N". Hentikan dari program pemiliknya, atau dari Task Manager sebagai
administrator.

## Port yang dicadangkan Windows {#ports-reserved-by-windows}

Saat pemakainya adalah Windows sendiri (process ID 4, proses "System") atau proses terlindungi
yang path-nya tidak bisa dibaca Rezure, tidak ada tombol: "This one has to be stopped as a
Windows service; Rezure can't end it."

Di port 80 itu hampir selalu **IIS** atau **World Wide Web Publishing Service**. Untuk
menghentikannya:

1. Tekan **Win + R**, ketik `services.msc`, lalu tekan Enter.
2. Cari **World Wide Web Publishing Service** (dan **Windows Process Activation Service** kalau
   sedang berjalan).
3. Klik kanan → **Stop**. Supaya tidak menyala lagi setelah restart, buka **Properties** dan
   atur **Startup type** ke **Manual** atau **Disabled**.

Kalau kamu sama sekali tidak memakai IIS, menghapusnya dari **Turn Windows features on or off**
→ **Internet Information Services** adalah solusi permanen.

## Konflik yang umum {#common-conflicts}

| Port | Tersangka biasa |
| --- | --- |
| 80 | Laragon, XAMPP, WAMP, IIS, Skype (versi lama), container Docker yang mem-publish port 80 |
| 3306 | MySQL milik Laragon atau XAMPP, layanan Windows MySQL yang berdiri sendiri |
| 5432 | PostgreSQL yang dipasang dengan installer Windows dari EDB, yang berjalan sebagai layanan Windows |
| 1025 / 8025 | Mailpit atau MailHog lain |

PHP milik Rezure memakai port 9100 ke atas, bukan 9000 yang biasa, jadi tidak bentrok dengan PHP
yang dijalankan Laragon dan XAMPP di sana.

Kamu tidak perlu meng-uninstall stack lain untuk memakai Rezure; cukup jangan jalankan keduanya
bersamaan. Dan kalau kamu lebih suka tetap memakai data MySQL milik Laragon atau XAMPP, Rezure
bisa melayaninya langsung: lihat
[MariaDB & MySQL](/id/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory).

## Terkait {#related}

- [Layanan](/id/guide/services): menjalankan dan menghentikan semuanya
- [Port](/id/guide/ports): setiap port yang dipakai Rezure

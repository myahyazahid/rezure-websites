---
title: Cara Memasang Rezure di Windows
titleTemplate: false
description: 'Pasang Rezure di Windows 10 atau 11: kebutuhan sistem, verifikasi checksum, apa yang dipasang installer, di mana datamu disimpan, dan cara mengecek semuanya berjalan.'
---

# Instalasi

## Sebelum mulai {#before-you-start}

Rezure membutuhkan Windows 10 64-bit (build 1809 atau lebih baru) atau Windows 11, ruang disk
kosong sekitar 400 MB, dan runtime WebView2, yang sudah ada di hampir semua instalasi Windows
saat ini. Daftar lengkapnya ada di [halaman unduhan](/id/download).

Satu hal yang perlu dicek dulu: **kalau ada stack server lokal lain yang sedang berjalan,
hentikan.** Port 80 dan port 3306 tidak bisa dipakai bersama dengan Rezure. Kamu tidak perlu
meng-uninstall apa pun, cukup jangan jalankan dua stack sekaligus. Kalau lupa, Rezure akan
memberi tahu program mana yang memakai port tersebut dan bisa menghentikannya untukmu. Lihat
[Konflik Port](/id/guide/port-conflicts).

## Pasang {#install}

1. Unduh installer dari [halaman unduhan](/id/download).
2. Cocokkan hash SHA-256-nya dengan yang ada di halaman rilis:
   [langkah verifikasinya](/id/download#verify-your-download) hanya butuh sekitar sepuluh detik.
3. Jalankan installer dan terima lokasi default kecuali ada alasan untuk menggantinya.
4. Buka Rezure dari Start menu.

Windows SmartScreen mungkin memperingatkan tentang publisher yang tidak dikenal saat pertama
kali dijalankan. Itu soal code-signing, bukan laporan virus: pilih **More info → Run anyway**
kalau hash yang kamu cek di langkah 2 cocok.

Jalankan Rezure sebagai user biasa, bukan dengan **Run as administrator**. Tidak ada bagian
yang membutuhkannya, dan PostgreSQL menolak berjalan di bawah Rezure yang di-elevate.

## Apa yang dipasang installer {#what-the-installer-sets-up}

Installer menaruh aplikasinya, beserta Nginx 1.25.3, PHP 8.3, dan bundel sertifikat CA bawaan,
ke folder instalasi. Saat pertama kali dibuka, Rezure menyalin semua itu ke folder rumahnya
sendiri, `C:\rezure`, dan semua yang dikelolanya sejak saat itu ada di sana:

| Path | Isinya |
|---|---|
| `C:\rezure\www` | Proyek-proyekmu. Setiap folder di sini dilayani sebagai situs `.test` sendiri. |
| `C:\rezure\bin` | Runtime yang diunduh Rezure dan sudah diverifikasi checksum-nya: PHP, MariaDB, PostgreSQL, Node.js, Composer, Mailpit |
| `C:\rezure\custom` | Folder untuk runtime yang kamu unduh sendiri, misalnya `custom\php` |
| `C:\rezure\data` | State layanan: data database, konfigurasi Nginx dan PHP yang dibuat otomatis, mailbox Mailpit |
| `C:\rezure\etc` | Pengaturan, profil dan koneksi database, proyek tertaut, pengaturan PHP milikmu |
| `C:\rezure\dumps` | Hasil ekspor database |

Peta lengkapnya ada di [File & Folder](/id/guide/files-and-folders). Kalau `C:\` tidak bisa
ditulisi di mesinmu, Rezure memakai `%LOCALAPPDATA%\Rezure` sebagai gantinya.

Proyek dan pengaturanmu ada di luar folder instalasi, jadi instal ulang atau kembali ke versi
lama tidak akan menyentuhnya.

### Upgrade dari Rezure versi lama {#upgrading-from-an-older-rezure}

Versi sebelumnya menyebar file-filenya di `%LOCALAPPDATA%\Rezure`, `%APPDATA%\Rezure`, dan
`%USERPROFILE%\rezure`. Saat versi terbaru pertama kali dijalankan, semua itu dipindahkan ke
`C:\rezure` untukmu. Rezure tidak pernah menimpa apa pun yang sudah ada di sana, dan kalau ada
langkah yang gagal, file lama dibiarkan di tempatnya, bukan dihapus.

## Hak administrator {#administrator-rights}

Rezure meminta persetujuan administrator hanya dalam dua situasi:

- **Mengedit file `hosts` Windows**, supaya domain `.test` sebuah proyek bisa di-resolve. Ini
  terjadi saat kamu mengklik **Sync hosts file** di halaman Projects dan memang ada yang perlu
  diubah. Kalau kamu menolak, bagian lain aplikasi tetap berjalan: domainnya saja yang belum
  bisa di-resolve sampai entri ditambahkan.
- **Memasang ODBC Driver Microsoft atau SQL Server LocalDB**, yang merupakan instalasi Windows
  sungguhan. Windows bertanya sekali per instalasi. Lihat [SQL Server](/id/guide/sql-server).

Selebihnya (menjalankan layanan, mengunduh runtime, menaruh PHP di `PATH`) berjalan sebagai
user biasa.

## Verifikasi instalasi {#verify-the-install}

Buka Rezure dan lihat halaman **Services**. Nginx dan PHP seharusnya tercantum sebagai
**Stopped**, dengan versi di sebelah masing-masing. Itu tanda peluncuran pertama yang sehat.
Baris lainnya menampilkan **Not installed** sampai kamu menambahkannya. Lanjut ke
[Pertama Kali Dijalankan](/id/guide/first-run) untuk menjalankan layanan.

Kalau Nginx atau PHP malah tercantum **Not installed**, berarti binary bawaannya tidak
terekstrak. Instal ulang di atasnya adalah cara tercepat untuk memperbaikinya.

## Terkait {#related}

- [Pertama Kali Dijalankan](/id/guide/first-run): jalankan layanan dan sajikan proyek pertama
- [Pembaruan & Changelog](/id/guide/updates): cara Rezure memperbarui dirinya sendiri
- [Uninstall](/id/guide/uninstall): hapus Rezure dan semua yang dipasangnya

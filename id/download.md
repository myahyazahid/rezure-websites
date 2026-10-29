---
title: Unduh Rezure untuk Windows
titleTemplate: false
description: Unduh rilis Rezure terbaru untuk Windows. Gratis dan open source, lengkap dengan kebutuhan sistem, versi sebelumnya, dan verifikasi checksum SHA-256.
---

# Unduh Rezure

Rezure tersedia sebagai installer Windows. Ambil build terbaru di bawah, lalu ikuti
[panduan instalasi](/id/guide/installation) untuk langkah pertama kali dijalankan.

<LatestRelease />

## Kebutuhan sistem {#system-requirements}

| | |
|---|---|
| **Sistem operasi** | Windows 10 (build 1809 atau lebih baru) atau Windows 11, 64-bit |
| **Runtime WebView2** | Biasanya sudah terpasang di Windows 10/11. Kalau setup melaporkan tidak ada, pasang dari [halaman WebView2 Microsoft](https://developer.microsoft.com/microsoft-edge/webview2/). |
| **Ruang disk** | Sekitar 400 MB untuk aplikasi beserta Nginx + PHP bawaan, ditambah ruang untuk apa pun yang kamu tambahkan: setiap versi PHP tambahan, MariaDB, Node.js, kira-kira 150 MB per versi PostgreSQL, dan proyek-proyekmu sendiri |
| **Memori** | RAM minimal 4 GB, disarankan 8 GB begitu database berjalan |
| **Izin** | Persetujuan Administrator dibutuhkan untuk mengedit file `hosts` Windows, dan masing-masing sekali untuk ODBC Driver Microsoft dan SQL Server LocalDB kalau kamu memasangnya. Selebihnya berjalan sebagai user biasa. |

Untuk saat ini Rezure hanya untuk Windows. Build macOS dan Linux belum tersedia.

## Memperbarui {#updating}

Setelah Rezure terpasang, kamu tidak perlu kembali ke sini untuk versi baru. Saat ada
pembaruan, sebuah titik muncul di **Changelog** pada sidebar aplikasi; buka lalu klik **Update**.
Setiap pembaruan ditandatangani, dan Rezure menolak pembaruan yang tanda tangannya tidak cocok.
Lihat [Pembaruan & Changelog](/id/guide/updates).

## Versi sebelumnya {#previous-versions}

Setiap build yang pernah dirilis Rezure tetap ada di
[halaman rilis GitHub](https://github.com/myahyazahid/rezure/releases), yang terbaru di atas.
Kalau versi baru bermasalah, unduh installer sebelumnya dari sana dan jalankan di atas instalasi
yang sekarang: proyek, database, dan pengaturanmu ada di `C:\rezure`, di luar folder aplikasi,
dan tidak akan disentuh.

## Verifikasi unduhanmu {#verify-your-download}

Setiap halaman rilis mencantumkan hash SHA-256 untuk installer-nya. Untuk mengecek file yang
kamu unduh, buka PowerShell di folder unduhan lalu jalankan:

```powershell
Get-FileHash .\rezureapp_3.3.0_x64-setup.exe -Algorithm SHA256
```

Pakai nama file yang benar-benar kamu unduh. Bandingkan nilai `Hash` dengan yang ada di halaman
rilis; keduanya harus sama persis, huruf besar kecil diabaikan. Kalau tidak sama, hapus file itu
dan unduh ulang; jangan jalankan installer yang hash-nya tidak cocok.

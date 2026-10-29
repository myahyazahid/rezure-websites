---
title: "Pengaturan: Startup, Tray, dan Domain .test"
description: 'Setiap opsi di halaman Settings Rezure: jalan bersama Windows, tetap berjalan di tray, notifikasi crash, entri hosts otomatis, dan akhiran .test.'
---

# Pengaturan

Halaman **Settings** sengaja dibuat singkat. Perubahan langsung tersimpan saat kamu membuatnya.

## Umum {#general}

"How Rezure starts and what it does in the background."

| Opsi | Default | Fungsinya |
| --- | --- | --- |
| **Start Rezure with Windows** | Off | Membuka Rezure saat kamu login ke Windows. Jendela terbuka seperti biasa, dan **layanan tetap berhenti** sampai kamu menjalankannya; pakai **Start all** di halaman Services. |
| **Keep running in tray on close** | Off | Menutup jendela hanya menyembunyikannya; layanan, tunnel, dan proyek yang dibagikan tetap berjalan. Pakai **Show Rezure** atau **Quit** dari ikon tray. Kalau dimatikan, menutup jendela keluar dari Rezure dan menghentikan semuanya. |
| **Notify when a service crashes** | Off | Notifikasi Windows saat sebuah layanan keluar tanpa diduga ("{name} stopped unexpectedly"), dan saat restart otomatis PHP menyerah. Lihat [Layanan](/id/guide/services#when-a-service-crashes). |

## Domain {#domains}

"Applied to every generated virtual host."

- **Domain suffix**: selalu `.test`, dan tidak bisa diubah. Browser memaksa `.dev` ke HTTPS, dan
  `.local` dipakai mDNS di banyak jaringan, jadi `.test` (yang memang dicadangkan untuk ini) adalah
  yang langsung berfungsi.
- **Auto-write hosts entries** (default off): "Syncs once at startup so new projects resolve
  without an extra UAC prompt each time." Dengan opsi ini aktif, Rezure memperbarui file `hosts`
  sekali setiap kali dijalankan, artinya paling banyak satu prompt administrator saat startup.
  Proyek yang kamu tambahkan selama Rezure berjalan tetap butuh **Sync hosts file** di halaman
  Projects.

## Port default {#default-port}

Field port, default **80**, berlabel "Used to pre-fill new virtual hosts". Di versi saat ini setiap
virtual host mendengarkan di port 80 apa pun nilainya, jadi mengubahnya belum berpengaruh.

## Di mana semuanya disimpan {#where-things-live}

"Read-only: Rezure scans these folders directly, so there's nothing to redirect."

| Baris | Folder |
| --- | --- |
| Projects | `C:\rezure\www` |
| Downloaded binaries | `C:\rezure\bin` |
| PHP drop-in folder | `C:\rezure\custom` |
| Database exports | `C:\rezure\dumps` |

Untuk memindahkan semua data Rezure ke drive lain, atur environment variable `REZURE_HOME` sebelum
menjalankan Rezure. Lihat [File & Folder](/id/guide/files-and-folders).

## Pengaturan yang ada di tempat lain {#settings-that-live-elsewhere}

| Mencari | Di mana |
| --- | --- |
| Tema, terang/gelap, kecerahan, ukuran antarmuka | [Tampilan](/id/guide/appearance), dan tombol **Light/Dark** di title bar |
| Versi PHP, Node.js, PostgreSQL yang aktif | Halaman [Switch](/id/guide/php-versions) |
| Layanan mana yang ditampilkan halaman Services | **Manage services** di halaman [Layanan](/id/guide/services#manage-services) |
| Nilai `php.ini` milikmu | `C:\rezure\etc\php\conf.d`. Lihat [Konfigurasi PHP](/id/guide/php-configuration) |
| Data pemakaian | Lihat [Privasi & Data Penggunaan](/id/guide/privacy) |

Tidak ada pengaturan untuk editor, terminal, atau bahasa; antarmuka Rezure berbahasa Inggris.

## Terkait {#related}

- [File & Folder](/id/guide/files-and-folders): `settings.json` dan isi `C:\rezure\etc` lainnya
- [Layanan](/id/guide/services): perilaku tray dan penanganan crash

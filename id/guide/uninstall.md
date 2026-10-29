---
title: 'Cara Meng-uninstall Rezure Sepenuhnya dari Windows'
titleTemplate: false
description: 'Uninstall Rezure dari Windows sepenuhnya: uninstaller, lalu proyek, database, entri hosts, perubahan PATH, dan password tersimpan yang ditinggalkannya.'
---

# Uninstall Rezure

Meng-uninstall aplikasi menghapus programnya, tetapi sengaja **tidak** menghapus proyek, database,
atau pengaturanmu di `C:\rezure`, pemisahan yang sama yang membuat instal ulang aman. Halaman ini
membahas uninstaller lalu semua sisanya, jadi kamu bisa menghapus sebanyak atau sesedikit yang kamu
mau.

## Sebelum uninstall {#before-you-uninstall}

Lakukan ini selagi Rezure masih terpasang; masing-masing membatalkan perubahan yang dibuat Rezure
di luar foldernya sendiri.

1. **Ekspor apa pun yang ingin kamu simpan.** Database ada di dalam `C:\rezure\data`. Ekspor dari
   halaman **Databases**, lalu salin `C:\rezure\dumps` ke tempat yang aman.
2. **Salin proyekmu** keluar dari `C:\rezure\www`, kalau belum ada di tempat lain.
3. **Hentikan semua layanan** di halaman Services.
4. Di halaman **Switch**, matikan **Use Rezure's PHP everywhere**. Itu menghapus entri Rezure dari
   `PATH` user-mu dan dari `PHP_INI_SCAN_DIR`.
5. Di **Settings**, matikan **Start Rezure with Windows**.
6. Di halaman **Databases**, hapus koneksi tersimpan yang tidak kamu butuhkan lagi; itu juga
   menghapus password-nya dari Windows Credential Manager.
7. Keluar dari Rezure lewat ikon tray.

## Jalankan uninstaller {#run-the-uninstaller}

Buka **Settings → Apps → Installed apps**, cari **rezureapp**, lalu pilih **Uninstall**, atau
jalankan `uninstall.exe` di folder tempat Rezure dipasang. Ini menghapus aplikasi dan file
bawaannya.

## Hapus sisanya {#remove-what-s-left}

### `C:\rezure` {#c-rezure}

Hapus folder ini untuk menghapus proyek, database, runtime yang diunduh, pengaturan, dan log
sekaligus. **Ini menghapus `www` dan database-mu**; pastikan langkah 1 dan 2 di atas sudah
dilakukan.

Hapus juga ini kalau ada; folder-folder ini berasal dari Rezure versi lama:

- `%LOCALAPPDATA%\Rezure`
- `%APPDATA%\Rezure`
- `%USERPROFILE%\rezure`

### Entri file hosts {#the-hosts-file-entries}

Buka Notepad **sebagai administrator**, buka `C:\Windows\System32\drivers\etc\hosts`, lalu hapus
blok di antara dua baris ini (termasuk baris-baris itu sendiri):

```
# --- Rezure managed entries (do not edit below) ---
# --- Rezure managed entries end ---
```

### `PATH`, kalau kamu melewatkan langkah 4 {#path-if-you-skipped-step-4}

Buka **Edit environment variables for your account** dari Start menu. Di variabel user-mu, hapus
`C:\rezure\current\php` dari **Path**, dan hapus `C:\rezure\etc\php\conf.d` dari
**PHP_INI_SCAN_DIR** (hapus variabelnya kalau itu satu-satunya nilai).

### Password tersimpan, kalau kamu melewatkan langkah 6 {#saved-passwords-if-you-skipped-step-6}

Buka **Credential Manager → Windows Credentials** dan hapus generic credential yang namanya
mengandung **Rezure Database Connections**.

### Jalan bersama Windows, kalau kamu melewatkan langkah 5 {#start-with-windows-if-you-skipped-step-5}

Buka **Task Manager → Startup apps** lalu nonaktifkan atau hapus entri Rezure.

### SQL Server LocalDB dan ODBC Driver {#sql-server-localdb-and-the-odbc-driver}

Ini instalasi Microsoft yang terpisah, dan meng-uninstall Rezure tidak menghapusnya; program lain
mungkin juga memakainya.

Kalau kamu yakin tidak ada yang lain yang membutuhkannya, hapus dulu instance LocalDB milik Rezure
di terminal:

```bat
SqlLocalDB stop Rezure
SqlLocalDB delete Rezure
```

Lalu uninstall **Microsoft SQL Server 2022 Express LocalDB** dan **Microsoft ODBC Driver 18 for SQL
Server** dari **Settings → Apps**.

## Memasang lagi nanti {#reinstalling-later}

Kalau kamu menyimpan `C:\rezure`, instalasi baru melanjutkan tepat dari tempat kamu berhenti:
proyek yang sama, database yang sama, pengaturan yang sama.

## Terkait {#related}

- [File & Folder](/id/guide/files-and-folders): semua yang dibuat Rezure, dan di mana
- [Instalasi](/id/guide/installation): memasang lagi

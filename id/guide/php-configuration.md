---
title: Mengedit php.ini dan Mengatasi cURL Error 60 di Windows
description: 'Tambahkan pengaturan php.ini yang tidak akan ditimpa Rezure, atasi cURL error 60 dengan bundel CA yang benar, dan jadikan PHP milik Rezure sebagai perintah php di setiap terminal.'
---

# Konfigurasi PHP

Bagian **PHP configuration** di bawah halaman **Switch** berisi pengaturan PHP yang tidak
berkaitan dengan versi mana yang berjalan: nilai `php.ini` milikmu, bundel sertifikat yang
dibutuhkan HTTPS, dan apakah `php` bisa dipakai di setiap terminal.

## Pengaturan PHP milikmu {#your-php-settings}

Rezure membuat sendiri `php.ini` untuk setiap versi PHP dan **menulisnya ulang setiap kali
start**, jadi mengedit file itu tidak akan bertahan. Taruh pengaturanmu di folder ini:

```
C:\rezure\etc\php\conf.d
```

File `.ini` apa pun di sana dimuat **setelah** `php.ini` milik Rezure, jadi nilainya yang menang.
Tombol **Open folder** di kartu **Your PHP settings** membawamu ke sana, dan `README.txt` di
dalamnya berisi contoh.

Misalnya, `C:\rezure\etc\php\conf.d\90-local.ini`:

```ini
memory_limit = 1G
upload_max_filesize = 256M
post_max_size = 256M
max_execution_time = 600
date.timezone = Asia/Jakarta
```

- **Restart PHP** di halaman Services supaya perubahan sampai ke situs yang sedang berjalan.
- File dimuat menurut urutan abjad, jadi `90-local.ini` menang atas `10-something.ini`.
- Folder ini berlaku untuk **setiap** versi PHP, untuk situsmu, dan untuk
  [terminal proyek](/id/guide/project-terminal). Dengan
  [Use Rezure's PHP everywhere](#use-rezure-s-php-everywhere) aktif, berlaku di setiap terminal.
- Untuk ekstensi, pakai halaman [Ekstensi PHP](/id/guide/php-extensions), bukan baris
  `extension=` di sini.

Yang diatur `php.ini` milik Rezure, sebagai referensi:

| Pengaturan | Nilai |
| --- | --- |
| `memory_limit` | 256M |
| `upload_max_filesize`, `post_max_size` | 64M |
| `max_execution_time` | 300 |
| `output_buffering` | 4096 |
| `date.timezone` | UTC |
| Folder temp untuk session dan upload | `C:\rezure\data\php\tmp` |
| `curl.cainfo`, `openssl.cafile` | Bundel CA, kalau sudah terpasang |

Nginx menerima body request sampai **64 MB**. Menaikkan `upload_max_filesize` dan `post_max_size`
melebihi itu tidak membantu: Nginx menolak upload yang lebih besar sebelum PHP melihatnya.

## Sertifikat CA {#ca-certificates}

PHP mengecek sertifikat HTTPS terhadap daftar root certificate tepercaya, dan zip PHP untuk
Windows **tidak membawa satu pun**. Tanpanya, setiap panggilan HTTPS keluar dari PHP gagal dengan
`cURL error 60: SSL certificate problem`: Composer, Guzzle, client `Http` milik Laravel, payment
gateway, login OAuth.

Kartu **CA certificates** memperbaikinya:

1. Klik **Download** (atau **Update** kalau sudah terpasang).
2. Rezure mengambil root certificate Mozilla dari `https://curl.se/ca/cacert.pem`, mencocokkannya
   dengan SHA-256 yang dipublikasikan curl.se, dan menyimpannya ke `C:\rezure\etc\cacert.pem`.
3. `curl.cainfo` dan `openssl.cafile` sama-sama menunjuk ke file itu untuk setiap versi PHP.

Kartunya menampilkan "Mozilla's root certificates as of YYYY-MM-DD, from curl.se." saat sudah ada,
atau "Not installed: HTTPS calls from PHP can't be verified." berwarna kuning saat belum. Setelah
pemasangan pertama, restart PHP; setelah pembaruan, situs yang berjalan memakainya mulai request
berikutnya.

Instalasi Rezure yang baru sudah menyertakan bundel. Kalau kamu mengganti `cacert.pem` dengan
milikmu sendiri, misalnya untuk menambahkan sertifikat proxy kantor, kartunya menampilkan "A bundle
Rezure didn't put there: kept as it is." Pembaruan aplikasi tidak menyentuhnya, tetapi mengklik
**Update** akan menggantinya dengan milik Mozilla.

[Cek Kebutuhan](/id/guide/requirements-check) menguji ini untukmu di proyek mana pun.

## Memakai PHP Rezure di mana saja {#use-rezure-s-php-everywhere}

Secara bawaan, PHP milik Rezure hanya ada di `PATH` pada
[terminal yang dibukanya untuk sebuah proyek](/id/guide/project-terminal). Aktifkan **Use Rezure's
PHP everywhere** ("Puts the active version on your PATH, so `php` works in every terminal, not
only the ones Rezure opens.") untuk menjadikannya `php` di terminal VS Code, PowerShell, Git Bash,
dan semua lainnya.

### Apa yang diubah {#what-it-changes}

- Membuat folder link, `C:\rezure\current\php`, yang menunjuk ke versi aktif global. (Ini directory
  junction, yang tidak butuh hak administrator.)
- Menambahkan folder itu ke **awal `PATH` user-mu**. `PATH` sistem tidak pernah disentuh.
- Menambahkan `C:\rezure\etc\php\conf.d` ke variabel `PHP_INI_SCAN_DIR` milik user-mu, supaya
  [pengaturan PHP milikmu](#your-php-settings) juga dimuat di setiap terminal.

**Buka terminal baru** supaya perubahannya terbaca; terminal yang sudah terbuka tetap memakai
`PATH` saat dibuka. Setelah itu, mengganti versi di halaman Switch hanya mengarahkan ulang link-nya,
jadi terminal yang sudah terbuka pun ikut. Kartunya menampilkan "php → {version}" dan ke mana
link-nya menunjuk.

Kalau ada PHP lain di urutan pertama `PATH`-mu (milik Laragon, XAMPP, WAMP), kartunya memberitahumu
sebelum kamu menyalakannya ("Laragon already provides `php`. Turning this on puts Rezure ahead of
it; turning it off hands it straight back.").

### Mematikannya {#turning-it-off}

Hanya menghapus entri `PATH` milik Rezure dan folder Rezure dari `PHP_INI_SCAN_DIR` (menghapus
variabelnya kalau tidak ada isi lain), dan menghapus folder link. Tidak ada versi PHP yang dihapus.

### Yang perlu diketahui {#things-to-know}

- Selalu mengikuti versi **global**. [Kunci versi](/id/guide/project-php-version) proyek hanya
  berlaku untuk situs dan terminal proyeknya.
- PHP di `PATH` **sistem** tetap menang, karena Windows membaca `PATH` sistem sebelum `PATH` user.
  Kalau `where php` menampilkan PHP lain di urutan pertama setelah menyalakan ini, hapus entri itu
  dari `PATH` sistem (System Properties → Environment Variables).
- "The link is out of sync: switch a version to re-point it." berarti link-nya menunjuk ke tempat
  yang tidak terduga; memilih versi di halaman Switch memperbaikinya. Rezure juga mengarahkannya
  ulang setiap kali dijalankan.

## Folder drop-in {#drop-in-folder}

"A PHP build copied in here shows up in the list above, alongside the ones Rezure installed."
**Open folder** di kartu **Drop-in folder** membuka `C:\rezure\custom\php`. Lihat
[Versi PHP](/id/guide/php-versions#an-older-patch-release-or-a-build-you-already-have).

## Terkait {#related}

- [Versi PHP](/id/guide/php-versions): pasang dan ganti versi
- [Ekstensi PHP](/id/guide/php-extensions): ekstensi per versi
- [File & Folder](/id/guide/files-and-folders): di mana semuanya disimpan

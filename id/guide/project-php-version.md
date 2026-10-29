---
title: Versi PHP Berbeda per Proyek di Windows
description: 'Kunci setiap proyek Rezure ke versi PHP-nya sendiri, sehingga proyek dengan rilis PHP berbeda berjalan berdampingan di Windows, di browser maupun terminal.'
---

# Versi PHP per Proyek

Rezure bisa melayani proyek-proyek berbeda dengan versi PHP berbeda secara bersamaan. Aplikasi
lama bisa tetap di PHP 7.4 sementara aplikasi Laravel baru berjalan di PHP 8.4, tanpa
bolak-balik mengganti satu versi global.

Setiap proyek mengikuti **default global** (versi aktif di halaman **Switch**) atau **dikunci**
ke versi tertentu yang sudah terpasang. Kunci itu berlaku untuk situs proyek dan
[terminal](/id/guide/project-terminal) yang kamu buka dari kartunya.

## Default global vs kunci per proyek {#global-default-vs-per-project-pin}

**Default global** ada di halaman **Switch**. Ini mengatur build PHP mana yang dijalankan layanan
**PHP** utama. Setiap proyek yang diatur ke **Default** dilayani oleh layanan itu.

**Kunci per proyek** ada di halaman **Projects**. Saat kamu mengunci proyek ke versi yang bukan
default global saat ini, Rezure memberi versi itu layanannya sendiri (misalnya **PHP 8.1.34**) dan
Nginx mengarahkan virtual host proyek ke sana.

Proyek yang dikunci ke versi yang sama berbagi satu layanan. Mengunci proyek ke versi yang sama
dengan default global tidak menambahkan apa pun; proyek itu memakai layanan **PHP** utama seperti
proyek yang tidak dikunci.

## Sebelum mengunci versi {#before-you-pin-a-version}

1. Pasang setiap versi PHP yang kamu butuhkan. Buka halaman **Switch** dan pakai
   **Install version**, atau taruh build di `C:\rezure\custom\php`. Lihat
   [Versi PHP](/id/guide/php-versions).
2. Jalankan **Nginx** dan layanan **PHP** di halaman **Services**. Proyek yang tidak dikunci butuh
   layanan **PHP** utama berjalan.

## Mengunci proyek ke sebuah versi PHP {#pin-a-project-to-a-php-version}

1. Buka halaman **Projects**.
2. Cari proyeknya dan klik ikon **PHP version** ("Pin this project to its own PHP version"). Saat
   sebuah versi dikunci, ikonnya terisi sehingga terlihat sekilas, dan tooltip-nya bertuliskan
   "Pinned to PHP X: click to change".
3. Di dialog **PHP version**, pilih **Default · follows the global active version**, atau salah
   satu versi yang terpasang. Default global saat ini ditandai "· currently the global default",
   dan opsi yang sedang dipakai ditandai **Current**.
4. Mengklik sebuah opsi langsung menerapkannya dan menutup dialog. Rezure menyimpan pilihan,
   menulis ulang konfigurasi Nginx proyek, dan menambah atau menghapus layanan PHP sesuai
   kebutuhan.
5. **Jalankan layanan barunya.** Baris seperti **PHP 8.1.34** muncul di halaman **Services**.
   Layanan itu **tidak dijalankan otomatis**; klik **Start**-nya, atau pakai **Start all**. Sampai
   berjalan, proyeknya menjawab dengan **502 Bad Gateway**.

Untuk melepas kunci, buka lagi dialognya dan pilih **Default**. Layanan tambahan berhenti dan
hilang begitu tidak ada proyek yang memakainya.

## Menjalankan beberapa versi sekaligus {#run-several-versions-at-once}

Contoh setup:

| Proyek | Versi yang dikunci | Dilayani oleh |
| --- | --- | --- |
| legacy-shop | PHP 7.4.33 | **PHP 7.4.33** (port 9110–9113) |
| new-api | Default (PHP 8.4.x) | **PHP** (port 9100–9103) |
| experiment | PHP 8.5.x | **PHP 8.5.x** (port 9120–9123) |

Dengan Nginx dan setiap layanan PHP yang dibutuhkan berjalan, ketiga proyek menjawab bersamaan,
masing-masing dengan versinya sendiri.

Mengganti default global di halaman **Switch** hanya memengaruhi proyek yang diatur ke
**Default**. Proyek yang dikunci tetap di versinya sampai kamu mengubah kuncinya.

## Apa yang dilakukan Rezure di latar belakang {#what-rezure-does-in-the-background}

Windows tidak punya PHP-FPM, jadi Rezure menjalankan `php-cgi` sebagai listener FastCGI. Setiap
layanan PHP adalah pool kecil berisi **4 worker**, masing-masing di port sendiri, dan Nginx
membagi request di antara mereka (`least_conn`). Baris Services menampilkan rentang dan jumlah
worker, misalnya `:9100–9103 · 4/4 workers`.

- Layanan **PHP** utama selalu memakai port **9100–9103**.
- Setiap versi yang dikunci mendapat blok sepuluh berikutnya yang kosong: 9110–9113, 9120–9123,
  dan seterusnya. Versi yang sedang berjalan tetap memegang bloknya saat kamu mengunci atau
  melepas kunci proyek lain.
- Port 9000 sengaja dihindari, supaya Rezure tidak bentrok dengan Laragon atau XAMPP, dan 9003
  tetap bebas untuk Xdebug.

Kalau sebuah worker crash, Rezure me-restart-nya sendiri; jumlah worker berubah kuning selama itu,
dan worker lain tetap melayani. Lihat [Layanan](/id/guide/services#when-a-service-crashes).

Setiap instalasi PHP juga mendapat **`php.ini` buatan sendiri**, jadi versi-versi tidak pernah
memuat ekstensi milik versi lain. Ekstensi diatur per versi di halaman
[Ekstensi PHP](/id/guide/php-extensions).

Kunci disimpan di database lokal Rezure, berdasarkan proyek, bukan di folder proyek.

## Batasan dan catatan {#limitations-and-notes}

**Pasang versinya dulu.** Dialog hanya menampilkan build PHP yang sudah ada di disk. Kalau belum
ada yang terpasang, tertulis "No PHP versions installed yet: install one from the Switch page
first."

**Jalankan setiap layanan PHP yang kamu butuhkan.** Proyek yang dikunci mengembalikan 502 kalau
layanan PHP-nya berhenti sementara Nginx masih berjalan.

**Terminal.** Terminal yang kamu buka dari kartu proyek menaruh versi yang dikunci di urutan
pertama `PATH`, jadi `php artisan` di sana berjalan dengan versi yang sama dengan situsnya.
Terminal lain memakai `php` apa pun yang disediakan `PATH` sistemmu; dengan
[Use Rezure's PHP everywhere](/id/guide/php-configuration#use-rezure-s-php-everywhere) aktif, itu
adalah versi **global**, tidak pernah kunci milik proyek.

**Hal-hal yang memakai versi global.** Membuat proyek Laravel dengan **New project** dan
[Cek Kebutuhan](/id/guide/requirements-check) proyek sama-sama berjalan dengan PHP aktif global,
bahkan untuk proyek yang dikunci. Untuk mengecek ekstensi proyek yang dikunci, jalankan `php -m`
di terminal proyeknya.

**Menghapus versi PHP.** Kalau kamu menghapus build yang dikunci oleh sebuah proyek, proyek itu
kembali ke versi global sampai kamu menguncinya lagi.

**Mengganti nama folder proyek di `www`** memberinya identitas baru, jadi kuncinya tidak ikut.
Kunci lagi setelah mengganti nama.

## Pemecahan masalah {#troubleshooting}

### Proyek menampilkan 502 Bad Gateway setelah dikunci {#the-project-shows-a-502-bad-gateway-after-pinning}

Cek halaman **Services**. Jalankan layanan PHP untuk versi itu (misalnya **PHP 8.1.34**), bukan
hanya baris **PHP** utama. Pastikan Nginx berjalan.

### Dialog bilang belum ada versi PHP yang terpasang {#the-dialog-says-no-php-versions-are-installed}

Pasang minimal satu versi tambahan dari halaman **Switch**, atau pakai **Default** sampai kamu
melakukannya.

### Mengunci sepertinya tidak berpengaruh {#pinning-seems-to-have-no-effect}

Pastikan kamu memilih versi yang **berbeda** dari default global saat ini. Mengunci ke versi yang
sama dengan default sama saja dengan **Default** dan tidak membuat layanan terpisah.

### Aku mengganti default global dan satu proyek tidak ikut berubah {#i-changed-the-global-default-and-one-project-did-not-change}

Proyek itu dikunci. Buka dialog PHP version-nya dan ganti ke **Default** kalau kamu ingin proyek
itu mengikuti versi global lagi.

### Ekstensi berfungsi di browser tapi tidak di terminal (atau sebaliknya) {#an-extension-works-in-the-browser-but-not-in-the-terminal-or-the-other-way-round}

Toggle ekstensi di halaman Ekstensi PHP berlaku untuk situs dan proses PHP yang dijalankan Rezure
sendiri. `php.ini` yang dibaca terminal tidak diubah oleh toggle itu. Lihat
[Ekstensi PHP](/id/guide/php-extensions#browser-vs-terminal).

## Terkait {#related}

- [Versi PHP](/id/guide/php-versions): pasang versi PHP dan atur default global
- [Terminal Proyek](/id/guide/project-terminal): shell dengan PHP dan Node milik proyek di urutan pertama
- [Port](/id/guide/ports): setiap port yang dipakai Rezure

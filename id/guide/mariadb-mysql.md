---
title: MariaDB dan MySQL Lokal di Windows
description: 'Jalankan MariaDB atau MySQL secara lokal di Windows dengan Rezure: buat, ekspor, dan impor database, buka di SQL client-mu, atau pakai ulang data Laragon atau XAMPP.'
---

# MariaDB dan MySQL

Rezure menjalankan satu server keluarga MySQL di `127.0.0.1:3306`. Secara bawaan itu adalah
MariaDB dengan folder datanya sendiri, tetapi layanan yang sama juga bisa melayani **direktori
data** MySQL atau MariaDB yang sudah ada, misalnya milik Laragon atau XAMPP, tanpa menyalin atau
mengonversi apa pun.

## Server lokal {#the-local-server}

Setup default adalah profil bernama **Rezure**:

| | |
| --- | --- |
| Engine | MariaDB 11.2 |
| Folder data | `C:\rezure\data\mariadb\data` |
| Alamat | `127.0.0.1:3306` (tidak pernah mendengarkan di jaringanmu) |
| User | `root` |
| Password | kosong |

Jalankan dan hentikan dari baris **MariaDB** di halaman [Layanan](/id/guide/services). Saat profil
lain yang aktif, baris itu menampilkan engine dan versinya, misalnya **MySQL 8.4**.

## Halaman Databases {#the-databases-page}

Dengan server lokal sebagai target, halaman **Databases** menampilkan setiap database dengan:

- **Tables** dan **Size**.
- Collation-nya, di bawah nama.
- **Used by**: proyek yang namanya cocok dengan database, menganggap `_` dan `-` sama (database
  `my_shop` cocok dengan proyek `my-shop`).

**Search databases** memfilter berdasarkan nama, dan ikon refresh membaca ulang daftarnya. Kalau
server tidak berjalan, kamu akan melihat "MariaDB isn't running, so there's nothing to list yet.
Start it from Services, then retry."

### Membuat database {#create-a-database}

**New database** meminta **Database name** dan **Collation** (default `utf8mb4_unicode_ci`). Nama
boleh memakai huruf, angka, `_`, dan `-`, sampai 64 karakter.

### Ekspor {#export}

**Export** di sebuah baris menulis dump `.sql` ke `C:\rezure\dumps`, dengan nama
`<database>-<YYYYMMDD-HHMMSS>.sql` (timestamp-nya UTC). Progress bar dan **Cancel** muncul selama
berjalan, dan **Show folder** membuka hasilnya. Ekspor yang dibatalkan atau gagal tidak
meninggalkan file setengah jadi.

### Impor {#import}

**Import .sql** meminta file dan database tujuannya, yang sudah terisi dari nama file, dengan
akhiran timestamp milik Rezure dibuang.

- Kalau database belum ada, database dibuat.
- Kalau sudah ada, dialog memperingatkanmu: dump biasanya berisi `DROP TABLE`, jadi tabel yang
  didefinisikannya akan diganti.
- Impor tidak bersifat transaksional. Kalau gagal di tengah jalan, semua yang sebelum statement
  yang gagal tetap diterapkan.

### Menghapus database {#dropping-a-database}

Tidak ada tombol hapus. Hapus database dari SQL client atau console:

```sql
DROP DATABASE my_shop;
```

## Membuka di SQL client {#open-in-a-sql-client}

**Open** pada sebuah database meluncurkan SQL client yang kamu pasang. Kalau hanya ada satu client,
langsung terbuka; kalau ada beberapa, kamu mendapat "Open {db} with" dan pilihannya.

| Client | Membuka |
| --- | --- |
| TablePlus | Database-nya |
| DBeaver | Database-nya (mungkin meminta mengunduh driver-nya pertama kali) |
| HeidiSQL | Database-nya |
| MySQL Workbench, Navicat | Server-nya ("server only") |
| **MariaDB console (bundled)** | Selalu ada: sesi command line `mariadb` |

Client ditemukan di lokasi instalasi yang biasa, termasuk HeidiSQL dan DBeaver bawaan Laragon.
Masing-masing ditampilkan dengan logonya sendiri, diambil dari client yang kamu pasang.

DBeaver dan MySQL Workbench butuh beberapa detik untuk menampilkan jendela, jadi halaman
menampilkan **Opening {client}…** selama itu dan **Open** dinonaktifkan, supaya klik kedua tidak
menjalankan salinan kedua.

Untuk koneksi **remote** dengan password tersimpan, TablePlus, DBeaver, HeidiSQL, dan MariaDB
console diberi password itu supaya langsung tersambung; MySQL Workbench memintanya sendiri. Lihat
[Database Remote](/id/guide/remote-databases#open-in-an-external-client).

## Profil direktori data {#data-directory-profiles}

**Profil** adalah penunjuk tersimpan ke direktori data MySQL atau MariaDB: path, engine, versi, dan
port-nya, ditambah, untuk instalasi yang diadopsi, binary server dan `my.ini` milik instalasi itu.
Rezure menjalankan satu profil pada satu waktu dan mengganti direktori data yang dibuka server.
Datamu tidak pernah disalin, dipindah, atau dikonversi.

Profil ditampilkan di bagian **Data directory** pada pengalih target di atas halaman Databases,
dengan yang aktif ditandai **Active**.

### Memakai direktori data Laragon atau XAMPP {#use-a-laragon-or-xampp-data-directory}

1. Buka pengalih target dan klik **+ Add data directory**.
2. Rezure mencari tool lain di lokasi default-nya ("Looking for other tools…"):
   - **Laragon**: setiap instalasi `C:\laragon\bin\mysql\*`, memakai `datadir` di `my.ini`-nya.
   - **XAMPP**: `C:\xampp\mysql\data`.
3. Setiap yang ditemukan ditampilkan dengan engine, versi, dan path-nya. Klik **Add**.
4. Pilih profil baru di pengalih untuk pindah ke sana.

Profil yang diadopsi berjalan dengan binary server dan `my.ini` **milik tool itu sendiri**, jadi
folder data MySQL 8.4 milik Laragon dibuka oleh MySQL 8.4 milik Laragon, tidak pernah oleh versi
lain yang mungkin meng-upgrade-nya. Rezure hanya menimpa direktori data, port (selalu **3306**),
dan alamat listen (`127.0.0.1`).

Kalau instalasinya tidak menyertakan binary server, kartunya bertuliskan "No server binary found
beside it: you'll need a matching {engine} {version} build."

Tidak ada yang ditemukan? "No other database directories found. Laragon and XAMPP are checked in
their default locations." Pakai opsi manual di bawah untuk yang lain, termasuk WAMP atau MySQL yang
berdiri sendiri.

### Menunjuk folder sendiri {#point-at-a-folder-yourself}

**Point at a folder myself** meminta:

- **Name**: default-nya nama folder.
- **Data directory**: folder yang berisi `ibdata1`. **Browse** memilihnya. Rezure membaca engine
  dari folder itu sendiri: file `mysql.ibd` berarti MySQL 8+, `aria_log_control` berarti MariaDB.
- **Port**: default 3306.

Profil yang ditambahkan manual tidak punya catatan versi, binary, atau `my.ini`. Profil itu berjalan
dengan build **terbaru** yang terpasang dari engine-nya. Hati-hati dengan direktori data yang lebih
lama: server yang lebih baru mungkin meng-upgrade-nya di tempat, setelah itu server yang lebih lama
tidak bisa membukanya. Untuk folder Laragon dan XAMPP, lebih baik pakai deteksi otomatis di atas,
yang tetap memakai binary dan `my.ini` milik mereka.

### Apa yang terjadi saat berpindah {#what-happens-when-you-switch}

1. **Pengecekan dulu, sebelum ada yang dihentikan.** Rezure menolak berpindah kalau folder itu
   ditulis oleh engine yang berbeda dari yang dikatakan profil ("opening it with the wrong engine
   can corrupt it"), kalau tidak ada build server yang kompatibel, atau kalau server lain masih
   berjalan di folder itu ("Laragon's database server looks like it's still running against this
   data directory: stop it there first").
2. **Stop yang rapi** untuk server saat ini, sampai dua menit sebelum dipaksa.
3. **Start dengan profil baru**, baik server sebelumnya berjalan atau tidak. Overlay-nya
   bertuliskan "Switching to {profile}…".
4. **Rollback kalau gagal.** Kalau server lama sedang berjalan dan yang baru tidak mau start,
   Rezure kembali: "switched back to "{previous}": {reason}". Kalau sebelumnya tidak ada yang
   berjalan, profil baru tetap terpilih dengan pesan error-nya.

Build yang kompatibel berarti versi major dan minor yang sama: direktori data MariaDB 10.11 butuh
server MariaDB 10.11.x. Versi minor atau major yang berbeda ditolak daripada mengambil risiko
upgrade.

### Mengelola profil {#managing-profiles}

Profil belum bisa diganti nama atau dihapus dari aplikasi. Profil disimpan di
`C:\rezure\etc\profiles.json`; untuk menghapus satu, keluar dari Rezure, hapus entrinya dari file
itu, lalu jalankan Rezure lagi. Menghapus profil tidak pernah menyentuh direktori datanya.

## Memasang versi MariaDB lain {#install-more-mariadb-versions}

**Switch → Install version → MariaDB** menampilkan rilis dari indeks rilis resmi MariaDB untuk
branch **10.6, 10.11, 11.4, dan 11.8**, masing-masing dicocokkan dengan checksum yang dipublikasikan
MariaDB. Semuanya dipasang ke `C:\rezure\bin\mariadb\<version>`.

Versi yang terpasang dipakai oleh profil mana pun dengan versi major dan minor yang sama, dan oleh
profil yang ditambahkan manual (yang mengambil build terbaru). Memasang MariaDB yang lebih baru
tidak meng-upgrade data profil yang sudah ada; aturan versi di atas melindunginya.

Baris **MariaDB** di halaman Switch hanya menampilkan build terbaru yang terpasang; tidak ada
pengganti versi di sana, karena profil aktif yang menentukan.

### MySQL {#mysql}

Rezure tidak mengunduh MySQL. Untuk menjalankan MySQL (untuk direktori data MySQL 8, atau supaya
koneksi remote bisa memakai client MySQL sendiri), unduh **ZIP Archive** dari
[dev.mysql.com](https://dev.mysql.com/downloads/mysql/) dan ekstrak ke `C:\rezure\custom\mysql\`.
Rezure menemukannya di sana. Build yang ditambahkan dengan cara ini tidak diverifikasi checksum-nya.

## Menyambung dari PHP {#connecting-from-php}

Profil default:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

`pdo_mysql` dan `mysqli` aktif secara default di setiap versi PHP. Direktori data Laragon atau
XAMPP yang diadopsi tetap memakai user dan password-nya sendiri (kedua tool default-nya `root`
dengan password kosong). Lihat [Contekan .env Laravel](/id/guide/laravel-env) untuk engine lain.

## Pemecahan masalah {#troubleshooting}

### Daftar gagal dengan "access denied" di profil yang diadopsi {#listing-fails-with-access-denied-on-an-adopted-profile}

Rezure membaca server lokal sebagai `root` dengan password kosong. Kalau `root` di direktori data
yang diadopsi punya password, server tetap berjalan tetapi halaman Databases tidak bisa
menampilkan isinya. Kembalikan password `root` menjadi kosong di server itu, atau pakai SQL client
untuk profil tersebut.

### "no MariaDB 10.11 binary is installed: add one before switching to this profile" {#no-mariadb-10-11-binary-is-installed-add-one-before-switching-to-this-profile}

Profil itu butuh server dengan versi major dan minor tersebut. Pasang dari **Switch → Install
version → MariaDB**, atau untuk MySQL, ekstrak build yang cocok ke `C:\rezure\custom\mysql\`.

### "… doesn't look like a MySQL or MariaDB data directory" {#doesn-t-look-like-a-mysql-or-mariadb-data-directory}

Kamu memilih folder yang salah. Pilih folder yang langsung berisi `ibdata1`; untuk XAMPP itu
`C:\xampp\mysql\data`.

### Folder XAMPP yang ditambahkan manual gagal dengan "Incorrect file format" {#a-manually-added-xampp-folder-fails-with-incorrect-file-format}

Server butuh pengaturan `my.ini` milik XAMPP. Hapus profil itu dan tambahkan foldernya lewat
deteksi otomatis, yang memakai binary dan `my.ini` milik XAMPP.

### MariaDB tidak mau start: port 3306 sedang dipakai {#mariadb-won-t-start-port-3306-is-in-use}

MySQL milik Laragon atau XAMPP, atau layanan Windows MySQL, memakai port itu. Lihat
[Konflik Port](/id/guide/port-conflicts).

### Impor gagal dengan "Unknown collation utf8mb4_0900_ai_ci" {#import-fails-with-unknown-collation-utf8mb4-0900-ai-ci}

Dump-nya berasal dari MySQL 8, dan MariaDB tidak punya collation itu. Ganti `utf8mb4_0900_ai_ci`
dengan `utf8mb4_unicode_ci` di file-nya, atau impor ke profil MySQL.

## Terkait {#related}

- [Database Remote](/id/guide/remote-databases): server staging dan database VPS
- [PostgreSQL](/id/guide/postgresql) dan [SQL Server](/id/guide/sql-server): engine lokal lainnya
- [Konflik Port](/id/guide/port-conflicts): saat 3306 terpakai

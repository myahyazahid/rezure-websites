---
title: Mengaktifkan Ekstensi PHP di Windows (Redis, sqlsrv)
description: Nyalakan dan matikan ekstensi PHP per versi di Rezure tanpa mengedit php.ini, dan pasang Redis serta driver SQL Server yang tidak dibawa PHP.
---

# Ekstensi PHP

Halaman **PHP Extensions** menyalakan ekstensi yang sudah dibawa zip PHP di folder `ext\`-nya, dan
memasang beberapa yang tidak dibawa: Redis dan driver SQL Server. Tidak perlu mengedit potongan
`.ini` dengan tangan.

## Memilih versi {#pick-a-version}

Ekstensi diatur **per versi PHP**. Saat lebih dari satu versi terpasang, pemilih
**PHP {version}** di bagian atas menentukan versi mana yang sedang kamu edit; awalnya di versi
aktif global. Proyek yang [dikunci](/id/guide/project-php-version) ke PHP 8.1 memakai pengaturan
PHP 8.1, jadi edit versi itu untuk proyek tersebut.

Tanpa PHP yang terpasang, halaman bertuliskan "No PHP version installed yet: install one from
Switch first."

## Menyalakan atau mematikan ekstensi {#turn-an-extension-on-or-off}

Ekstensi dikelompokkan per kategori (Database, Debug, Filesystem, Format, Image, Math, Network,
Performance, Security, System) dan **Filter extensions** mencarinya. Setiap baris punya label,
nama ekstensi, deskripsi singkat, dan sebuah switch.

Switch **menyimpan pilihanmu** untuk versi itu. Efeknya berlaku saat versi PHP itu dijalankan
berikutnya. Kalau sedang berjalan, halaman memberitahumu: restart layanan PHP itu di halaman
**Services** supaya perubahannya sampai ke situsmu.

### Yang aktif secara default {#what-s-on-by-default}

| Aktif secara default | Mati secara default |
| --- | --- |
| `curl`, `fileinfo`, `gd`, `intl`, `mbstring`, `mysqli`, `openssl`, `pdo_mysql`, `pdo_sqlite`, `sqlite3`, `zip` | `bcmath`, `bz2`, `calendar`, `com_dotnet`, `dba`, `exif`, `ffi`, `ftp`, `gettext`, `gmp`, `imap`, `ldap`, `odbc`, `opcache`, `pdo_odbc`, `pdo_pgsql`, `pgsql`, `shmop`, `snmp`, `soap`, `sockets`, `sodium`, `tidy`, `xmlrpc`, `xsl` |

`redis`, `pdo_sqlsrv`, dan `sqlsrv` langsung aktif begitu kamu memasangnya.

Beberapa yang kemungkinan ingin kamu nyalakan:

- **`pdo_pgsql`** untuk proyek di [PostgreSQL](/id/guide/postgresql). Tanpanya Laravel gagal
  dengan "could not find driver".
- **`bcmath`**, **`sodium`**, **`exif`**: kebutuhan Composer yang umum.
  [Cek Kebutuhan](/id/guide/requirements-check) memberi tahu mana yang diminta sebuah proyek.
- **`opcache`** sengaja dimatikan: cache yang basi bisa menyembunyikan perubahan kode yang baru
  kamu buat. Nyalakan kalau kamu sedang mengukur performa, bukan saat mengedit.

### Badge {#badges}

- **special**: ekstensi yang bergantung pada lingkungan atau khusus debug (`oci8`, `pdo_oci`,
  `zend_test`, `phpdbg_webhelper`), bukan sesuatu yang dibutuhkan proyek biasa.
- **not in this build**: DLL ekstensinya tidak ada di folder `ext\` versi ini dan tidak ada
  unduhan untuknya.
- **not available for PHP X yet**: unduhan ada untuk versi PHP lain, tetapi belum untuk versi ini.

## Memasang Redis atau driver SQL Server {#install-redis-or-the-sql-server-drivers}

Zip PHP untuk Windows tidak menyertakannya, jadi Rezure mengunduh build yang sudah diverifikasi
checksum-nya (non-thread-safe x64, untuk PHP 7.4 sampai 8.5). Tombol di barisnya bertuliskan
**Install {version}**.

| Ekstensi | Versi |
| --- | --- |
| `redis` | 6.3.0 |
| `pdo_sqlsrv`, `sqlsrv` | 5.13.3 untuk PHP 8.3–8.5, 5.12.0 untuk 8.1–8.2, 5.10.0 untuk 7.4–8.0 |

Setelah terpasang, ekstensinya langsung aktif. Restart PHP supaya situs yang sedang berjalan ikut
memakainya.

Ekstensi SQL Server juga butuh **ODBC Driver for SQL Server dari Microsoft**. Saat salah satunya
aktif dan driver-nya tidak ada, halaman memberitahu ("PHP loads them without it, but every
connection fails until it's installed") dengan tombol **Install ODBC Driver**. Lihat
[SQL Server](/id/guide/sql-server#php-drivers).

Rezure memasang ekstensi `redis`, bukan server Redis. Server Redis belum menjadi bagian dari
Rezure.

## Browser vs terminal {#browser-vs-terminal}

Rezure menyimpan dua file `php.ini` per versi, karena PHP dijalankan dengan dua cara:

- **Untuk situsmu** (dan semua yang dijalankan Rezure sendiri, seperti Composer saat
  [Proyek Baru](/id/guide/new-project)): `php.ini` buatan yang disusun ulang setiap kali start dari
  switch di halaman ini.
- **Untuk terminal**: `php.ini` di dalam folder versi itu sendiri, misalnya
  `C:\rezure\bin\php\8.4.x\php.ini`. Rezure menulisnya sekali, dengan ekstensi yang aktif saat
  itu, lalu menyerahkannya padamu.

Jadi **switch di halaman ini tidak mengubah apa yang dimuat `php` di terminal**, dengan satu
pengecualian: ekstensi yang kamu *pasang* di sini (Redis, SQL Server) juga ditambahkan ke
`php.ini` terminal.

Kalau sebuah ekstensi berfungsi di browser tetapi `php -m` di terminal tidak menampilkannya, buka
`php.ini` milik versi itu dan tambahkan barisnya sendiri:

```ini
extension=bcmath
```

File itu milikmu: Rezure hanya pernah memperbaiki baris `extension_dir` dan bundel CA di sana.

Untuk pengaturan selain ekstensi (`memory_limit`, `upload_max_filesize`, …) pakai
`C:\rezure\etc\php\conf.d`; folder itu berlaku untuk keduanya. Lihat
[Konfigurasi PHP](/id/guide/php-configuration#your-php-settings).

## Xdebug {#xdebug}

Xdebug belum ditawarkan di halaman ini. Sudah ada di roadmap.

## Terkait {#related}

- [Cek Kebutuhan](/id/guide/requirements-check): ekstensi mana yang dibutuhkan sebuah proyek
- [Konfigurasi PHP](/id/guide/php-configuration): pengaturan `php.ini` milikmu
- [Versi PHP](/id/guide/php-versions): pasang versi lain

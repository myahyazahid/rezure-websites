---
title: SQL Server dengan PHP dan Laravel di Windows
description: 'Pakai SQL Server dengan PHP dan Laravel di Windows: Rezure memasang pdo_sqlsrv, ODBC Driver, dan SQL Server LocalDB dari dalam aplikasi.'
---

# SQL Server

Proyek PHP yang memakai SQL Server butuh tiga hal di Windows: driver PHP dari Microsoft, ODBC
Driver Microsoft yang dipakai driver itu untuk berkomunikasi, dan sebuah server. Rezure memasang
ketiganya dari dalam aplikasi, dengan server berupa **SQL Server 2022 Express LocalDB**, SQL Server
ringan yang berjalan sesuai kebutuhan.

Kamu bisa memakai bagian mana pun secara terpisah: hanya driver untuk menyambung ke SQL Server
kantor, atau seluruh set untuk database lokal.

## Driver PHP {#php-drivers}

Di [Ekstensi PHP](/id/guide/php-extensions), pada grup **Database**, pasang:

- **`pdo_sqlsrv`** ("PDO SQL Server"): yang dipakai Laravel.
- **`sqlsrv`** ("SQL Server"): fungsi-fungsi non-PDO.

Klik **Install {version}** di masing-masing. Rezure memilih rilis Microsoft yang tepat untuk versi
PHP (5.13.3 untuk PHP 8.3–8.5, 5.12.0 untuk 8.1–8.2, 5.10.0 untuk 7.4–8.0) dan menyalakannya.
Restart PHP setelahnya. Pasang terpisah untuk setiap versi PHP yang kamu pakai dengan SQL Server.

## ODBC Driver {#odbc-driver}

Driver PHP menyambung lewat **Microsoft ODBC Driver 18 for SQL Server**. PHP tetap memuatnya tanpa
driver itu, tetapi setiap koneksi gagal. Pasang dari salah satu tempat ini:

- banner di **PHP Extensions** (muncul saat ekstensi SQL Server aktif dan driver-nya tidak ada),
- **Install ODBC Driver** di form Add connection pada halaman Databases,
- [Cek Kebutuhan](/id/guide/requirements-check) proyek.

ODBC Driver **17 atau 18** yang sudah kamu punya ikut dihitung. Driver "SQL Server" bawaan Windows
yang sangat lama tidak dihitung.

### Seperti apa memasang paket Microsoft {#what-installing-a-microsoft-package-looks-like}

ODBC Driver (18.7.1.1) dan LocalDB (16.0.1000.6) adalah instalasi Windows sungguhan, jadi cara
kerjanya sedikit berbeda dari hal lain di Rezure:

1. Dialog berjudul **Install {name}** menjelaskan apa yang akan terjadi dan menautkan ke **Read
   Microsoft's license terms**.
2. Centang **I accept the Microsoft license terms for {name}.**: **Install** tetap nonaktif sampai
   kamu mencentangnya. Rezure tidak pernah menyetujui lisensi atas namamu.
3. Rezure mengunduh installer Microsoft dan mengecek checksum serta tanda tangan Microsoft-nya.
4. Windows meminta izin administrator **sekali**. Klik **Yes**.
5. Paketnya muncul di **Settings → Apps** seperti program lain. **Meng-uninstall Rezure tidak
   menghapusnya.**

File installer dan log-nya disimpan di `C:\rezure\data\installers\`.

## Memasang LocalDB {#install-localdb}

Pasang **SQL Server LocalDB** dari **Switch → Install version → SQL Server LocalDB**, tombol
**Install** di baris Services-nya, atau Cek Kebutuhan proyek. Langkah lisensi dan administratornya
sama seperti di atas.

Rezure lalu membuat instance LocalDB bernama **`Rezure`**. Kamu mengaksesnya sebagai:

```
(localdb)\Rezure
```

LocalDB berjalan sendiri begitu ada yang menyambung ke sana, jadi sebenarnya kamu tidak perlu
menjalankannya dari halaman Services. Barisnya di sana menampilkan `(localdb)\Rezure · :14330`;
**Stop** mematikannya dengan rapi dan **Force stop** mematikannya paksa.

File database untuk database yang dibuat Rezure disimpan di `C:\rezure\data\mssql\`.

### Menyambungkan Laravel ke LocalDB {#connect-laravel-to-localdb}

Kamu butuh `pdo_sqlsrv` dan ODBC Driver dari atas. Lalu di `.env`:

```dotenv
DB_CONNECTION=sqlsrv
DB_HOST=(localdb)\Rezure
DB_PORT=
DB_DATABASE=myapp
DB_USERNAME=
DB_PASSWORD=
```

- **`DB_PORT=` harus ada dan kosong.** LocalDB diakses lewat named pipe, bukan port TCP; kalau port
  diisi, Laravel menambahkan `,1433` dan koneksinya gagal.
- **Username kosong berarti autentikasi Windows**: kamu masuk sebagai user Windows-mu sendiri,
  tanpa password.
- Dengan ODBC Driver 18, enkripsi aktif secara default. Kalau mendapat error sertifikat, hapus
  komentar `'trust_server_certificate'` di `config/database.php` dan tambahkan
  `DB_TRUST_SERVER_CERTIFICATE=true` ke `.env`.

Cek Kebutuhan memverifikasi semua ini untuk proyek `sqlsrv`.

### Bridge TCP untuk client GUI {#the-tcp-bridge-for-gui-clients}

Banyak client GUI tidak bisa menjangkau named pipe. Untuk mereka, Rezure meneruskan
**`127.0.0.1:14330`** ke LocalDB, dengan login SQL **`rezure`** tanpa password. Sambungkan
TablePlus, DBeaver, atau client lain dengan:

```
Host: 127.0.0.1
Port: 14330
User: rezure
Password: (kosong)
Encryption: off
```

Bridge hanya berfungsi dengan enkripsi **off**.

## Di halaman Databases {#on-the-databases-page}

Setelah LocalDB terpasang, koneksi bernama **SQL Server LocalDB** (ditandai "SQL Server · this PC")
muncul di bagian **Connections** pada pengalih target. Koneksi ini memakai autentikasi Windows dan
tidak bisa dihapus.

| Aksi | LocalDB | SQL Server lain |
| --- | --- | --- |
| Daftar | Database-mu, dengan jumlah tabel dan ukuran (database sistem disembunyikan) | Sama |
| **New database** | Dengan collation: default server di urutan pertama, lalu opsi Latin1 dan UTF-8 yang umum | Sama |
| **Export** | Backup `.bak` (copy-only) ke `C:\rezure\dumps` | Tidak tersedia: `BACKUP` menulis ke disk milik server sendiri |
| **Import .sql / .bak** | Script `.sql`, atau **Restore .bak** | Hanya script `.sql` |

Tentang impor:

- Script `.sql` dipecah di baris `GO` (`GO 5` mengulang batch lima kali), dan file UTF-16 yang
  disimpan SSMS bisa dipakai. Error menyebut batch-nya: "batch 3: …".
- **Me-restore `.bak` menggantikan** database dengan nama yang sama sepenuhnya.

Tidak ada tombol hapus; pakai `DROP DATABASE myapp;` di client.

## Menyambung ke SQL Server lain {#connect-to-another-sql-server}

Rezure bisa bekerja dengan SQL Server mana pun yang bisa kamu jangkau: SQL Server Express di PC
ini, server di jaringan kantor, atau server di balik SSH. Di halaman Databases, buka pengalih
target, klik **+ Add connection**, lalu pilih **SQL Server**.

Rezure memindai PC ini dulu dan menampilkan temuannya di bawah **Found on this computer**: edisi
yang terpasang seperti "SQL Server 2022 (SQLEXPRESS)" (host `localhost\SQLEXPRESS`), dan instance
LocalDB lain seperti `(localdb)\MSSQLLocalDB`. Mengklik salah satunya mengisi form, dengan login
**Windows account** dan, untuk edisi yang terpasang, **Trust server certificate** dicentang. Kamu
tetap perlu **Test connection** lalu **Save**.

Detail per field, SSH tunnel, dan pemecahan masalah ada di
[Database Remote](/id/guide/remote-databases#sql-server-specifics).

## Membuka di SQL client {#open-in-a-sql-client}

| Client | Membuka |
| --- | --- |
| SQL Server Management Studio (SSMS) | Selalu: database-nya, dengan login Windows atau SQL; SSMS meminta password sendiri |
| TablePlus, DBeaver | Hanya untuk login SQL di port yang diketahui, termasuk LocalDB, lewat login `rezure` di bridge |

Kalau tidak ada yang terpasang: "No SQL Server client found. Install SQL Server Management Studio
to open databases from here."

## Batasan {#limitations}

- Unduhan driver dari Rezure untuk PHP **non-thread-safe x64**, build yang dipasang Rezure. PHP
  thread-safe yang kamu tambahkan sendiri tidak bisa memakainya.
- SQL Server remote tidak bisa diekspor atau di-restore dari `.bak` lewat Rezure.
- LocalDB dimaksudkan untuk pengembangan dan tidak punya SQL Server Agent. Kalau proyek bergantung
  pada fitur yang tidak dimiliki LocalDB, pasang SQL Server Express atau edisi Developer dan
  sambungkan sebagai SQL Server lain.

## Pemecahan masalah {#troubleshooting}

### Setiap koneksi gagal, padahal `pdo_sqlsrv` sudah terpasang {#every-connection-fails-even-though-pdo-sqlsrv-is-installed}

ODBC Driver tidak ada. Pasang dari PHP Extensions.

### "could not find driver" {#could-not-find-driver}

`pdo_sqlsrv` belum terpasang atau belum aktif untuk versi PHP yang dipakai proyek. Pasang di PHP
Extensions untuk versi itu, lalu restart PHP.

### Koneksi gagal dengan `,1433` di pesan error {#connection-fails-with-1433-in-the-error}

`DB_PORT` punya nilai. Kosongkan: `DB_PORT=`.

### Error sertifikat atau SSL {#certificate-or-ssl-errors}

ODBC Driver 18 mengenkripsi secara default dan tidak memercayai sertifikat self-signed. Untuk
Laravel, hapus komentar `'trust_server_certificate'` di `config/database.php` dan atur
`DB_TRUST_SERVER_CERTIFICATE=true`. Untuk koneksi tersimpan, tambahkan ulang dengan **Trust server
certificate** dicentang.

### Installer Microsoft gagal {#the-microsoft-installer-fails}

Rezure menerjemahkan error Windows Installer yang umum:

- **cancelled**: prompt lisensi atau administrator ditolak; coba lagi dan klik **Yes**.
- **another installation is already running**: tunggu Windows Update atau installer lain selesai.
- **another version is installed**: hapus versi lain itu dari Settings → Apps dulu.
- **no administrator rights**: akunmu tidak bisa memasang software; minta bantuan pengelola PC.

Selebihnya menunjuk ke file log di `C:\rezure\data\installers\`.

## Terkait {#related}

- [Contekan .env Laravel](/id/guide/laravel-env): nilai untuk setiap engine
- [Database Remote](/id/guide/remote-databases): SQL Server di mesin lain
- [Ekstensi PHP](/id/guide/php-extensions): toggle driver

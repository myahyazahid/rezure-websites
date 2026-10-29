---
title: Menjalankan PostgreSQL 16, 17, atau 18 Secara Lokal di Windows
description: 'Jalankan PostgreSQL 16, 17, atau 18 secara lokal di Windows dengan Rezure: pasang, ganti versi, buat, ekspor, dan impor database, serta sambungkan Laravel.'
---

# PostgreSQL

Rezure bisa menjalankan server PostgreSQL lokal di samping MariaDB, bukan menggantikannya. Rezure
memakai build Windows portabel dari EDB, jadi tidak ada yang dipasang ke Windows, tidak ada layanan
Windows, dan tidak ada prompt administrator.

## Memasang {#install}

Salah satu dari cara ini memasang PostgreSQL:

- **Install** di baris **PostgreSQL** pada halaman [Layanan](/id/guide/services): memasang versi
  terbaru.
- **Switch → Install version → PostgreSQL**: pilih versinya.
- **Install PostgreSQL** di [Cek Kebutuhan](/id/guide/requirements-check) proyek yang memakai
  `pgsql`, atau di form Add connection.

Versi yang ditawarkan: **18.6**, **17.11**, dan **16.15**, masing-masing dicocokkan dengan SHA-256
yang dikunci. Unduhannya sekitar 400 MB; Rezure hanya menyimpan server dan tool-nya, sekitar
**150 MB** per versi. pgAdmin tidak disertakan. File-filenya masuk ke
`C:\rezure\bin\postgres\<version>`.

## Start dan stop {#start-and-stop}

Jalankan dari baris **PostgreSQL** di halaman Services. Server mendengarkan di
**`127.0.0.1:5432`**.

Start pertama untuk setiap versi major membuat folder datanya, `C:\rezure\data\postgres\<major>\`,
sebagai UTF-8.

**Stop** mematikan server dengan rapi (shutdown "fast": koneksi yang terbuka ditutup, tidak ada
yang hilang).

::: warning Jangan jalankan Rezure sebagai administrator
PostgreSQL menolak berjalan dengan hak administrator. Kalau Rezure dijalankan dengan **Run as
administrator**, menjalankan PostgreSQL gagal dengan "PostgreSQL refuses to run with administrator
rights … close it and open it normally". Buka Rezure secara normal lalu jalankan lagi.
:::

## User dan password {#users-and-passwords}

Server punya dua superuser: **`postgres`**, superuser PostgreSQL yang biasa, dan **`root`**, yang
ditambahkan Rezure karena itu username `pgsql` default di Laravel.

Koneksi lokal memakai autentikasi **trust**, jadi **tidak perlu password**: password apa pun, atau
tanpa password, diterima. Itu praktis di laptopmu sendiri dan tidak aman di tempat lain; server
hanya mendengarkan di `127.0.0.1`.

## Menyambungkan Laravel {#connect-laravel}

Nyalakan **`pdo_pgsql`** untuk versi PHP-mu dulu; ekstensi ini dibawa PHP tetapi mati secara
default. Lakukan di [Ekstensi PHP](/id/guide/php-extensions), atau klik **Turn on pdo_pgsql** di Cek
Kebutuhan proyek. Tanpanya Laravel gagal dengan "could not find driver".

Lalu di `.env`:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

Pengaturan `pgsql` default Laravel sudah memakai `root` dan port 5432, jadi proyek baru tersambung
hanya dengan mengubah `DB_CONNECTION` dan `DB_DATABASE`. Buat database-nya dulu (di bawah), dan
restart PHP setelah menyalakan ekstensinya.

## Di halaman Databases {#on-the-databases-page}

Setelah sebuah versi terpasang, koneksi bernama **PostgreSQL** (ditandai "PostgreSQL · this PC")
muncul di bagian **Connections** pada pengalih target. Pilih untuk bekerja dengan server lokal.
Koneksi ini tidak bisa dihapus.

| Aksi | Fungsinya |
| --- | --- |
| Daftar | Setiap database yang bisa kamu sambungi, dengan jumlah tabel dan ukuran. Encoding tampil di bawah nama. Database sistem (`postgres`, `template0`, `template1`) disembunyikan. |
| **New database** | Membuatnya dengan encoding **UTF8**. |
| **Export** | Dump `.sql` biasa (`pg_dump`, tanpa statement owner atau privilege) ke `C:\rezure\dumps`. Menampilkan progres tetapi tidak bisa dibatalkan. |
| **Import .sql** | Membuat database kalau belum ada, lalu menjalankan file-nya. Berhenti di error pertama dan menyebut barisnya ("line 12: …"). Tidak transaksional. |

Tidak ada tombol hapus; pakai `DROP DATABASE myapp;` di client.

Mengimpor ke database yang **sudah ada** berhenti di tabel pertama yang sudah ada, jadi impor ke
nama baru supaya aman.

Kalau server tidak berjalan, halaman bertuliskan "Rezure's PostgreSQL isn't running, so there's
nothing to list yet. Start it from Services, then retry."

## Membuka di SQL client {#open-in-a-sql-client}

| Client | Membuka |
| --- | --- |
| TablePlus | Database-nya |
| DBeaver | Database-nya |
| pgAdmin 4 | Hanya membuka ("server only"); tambahkan server-nya sendiri di pgAdmin |
| **psql console** | Selalu ada: sesi `psql` di database itu |

Untuk TablePlus, DBeaver, atau client lain, detailnya: host `127.0.0.1`, port `5432`, user
`postgres` atau `root`, dan password apa pun.

Untuk [koneksi PostgreSQL remote](/id/guide/remote-databases#open-in-an-external-client) dengan
password tersimpan, TablePlus dan DBeaver diberi password itu, jadi langsung tersambung tanpa
bertanya, bahkan lewat SSH tunnel.

## Mengganti versi {#switch-versions}

Dengan lebih dari satu versi terpasang, pilih satu di baris **PostgreSQL** pada halaman
**Switch**. Setiap opsi menampilkan di mana datanya disimpan ("data: postgres\18"). Kalau server
sedang berjalan, Rezure menghentikannya dengan rapi lalu menjalankan versi baru ("Switching
PostgreSQL…"). Pilihannya diingat.

::: warning Setiap versi major punya datanya sendiri
Berpindah dari 17 ke 18 memulai folder data milik **18**; database-mu dari 17 tidak ikut. Untuk
memindahkannya, ekspor masing-masing selama 17 aktif, pindah versi, lalu impor ke 18. Rezure tidak
menjalankan `pg_upgrade`.
:::

## Server PostgreSQL remote {#remote-postgresql-servers}

Rezure juga bisa menyambung ke server PostgreSQL di tempat lain, memakai `psql` dan `pg_dump` dari
build lokal **terbaru**-mu. Lihat [Database Remote](/id/guide/remote-databases).

## Pemecahan masalah {#troubleshooting}

### Port 5432 sudah dipakai {#port-5432-is-already-in-use}

Biasanya PostgreSQL yang dipasang dengan installer Windows biasa dari EDB, yang berjalan sebagai
layanan Windows. Hentikan di `services.msc` (namanya seperti **postgresql-x64-17**). Lihat
[Konflik Port](/id/guide/port-conflicts).

### "could not find driver" di Laravel {#could-not-find-driver-in-laravel}

`pdo_pgsql` mati untuk versi PHP yang dipakai proyek. Nyalakan dan restart PHP.

### "role … does not exist" {#role-does-not-exist}

`DB_USERNAME`-nya bukan `root` atau `postgres`. Pakai salah satunya; password apa pun bisa.

### Database-ku hilang setelah ganti versi {#my-databases-disappeared-after-switching-versions}

Database-nya ada di folder data versi sebelumnya, tidak tersentuh. Pindah kembali untuk melihatnya,
dan pakai ekspor dan impor untuk memindahkannya.

## Terkait {#related}

- [Contekan .env Laravel](/id/guide/laravel-env): nilai untuk setiap engine
- [Database Remote](/id/guide/remote-databases): PostgreSQL di server lain
- [Ekstensi PHP](/id/guide/php-extensions): menyalakan `pdo_pgsql`

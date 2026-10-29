---
title: Menjalankan dan Menghentikan Nginx, PHP, dan Database
description: 'Jalankan, hentikan, dan restart Nginx, PHP, MariaDB, PostgreSQL, SQL Server LocalDB, dan Mailpit dari halaman Services Rezure, lengkap dengan pemulihan saat crash.'
---

# Layanan

Halaman **Services** adalah layar utama Rezure: setiap proses yang dibutuhkan proyekmu, dengan
status, versi, port, dan Start/Stop/Restart. Tidak ada yang berjalan dengan sendirinya: tidak
saat Rezure dibuka, dan tidak saat Windows login. Kamu yang menentukan apa yang berjalan.

## Daftar layanan {#the-services}

| Layanan | Fungsinya | Port | Asalnya |
| --- | --- | --- | --- |
| **Nginx** | Web server untuk setiap proyek | 80 | Ikut di installer |
| **PHP** | Menjalankan PHP untuk proyek yang memakai versi global, sebagai 4 worker | 9100–9103 | Ikut di installer (PHP 8.3); versi lain di halaman [Switch](/id/guide/php-versions) |
| **PHP x.y.z** | Satu baris per versi tambahan yang [dikunci](/id/guide/project-php-version) oleh sebuah proyek | 9110–9113, 9120–9123, … | Muncul saat kamu mengunci proyek |
| **MariaDB** / **MySQL** | Database keluarga MySQL lokal. Baris ini menampilkan engine yang dipakai [profil direktori data](/id/guide/mariadb-mysql) yang aktif | 3306 | Lihat [MariaDB & MySQL](/id/guide/mariadb-mysql) |
| **PostgreSQL** | Server PostgreSQL lokal | 5432 | **Install** di barisnya (versi terbaru), atau halaman Switch. Lihat [PostgreSQL](/id/guide/postgresql) |
| **SQL Server LocalDB** | SQL Server lokal, diakses sebagai `(localdb)\Rezure` | named pipe, plus bridge di 14330 | Installer Microsoft, dengan persetujuan lisensi. Lihat [SQL Server](/id/guide/sql-server) |
| **Mailpit** | Menangkap email keluar | 1025 (SMTP), 8025 (inbox) | **Install** di barisnya. Lihat [Mailpit](/id/guide/mailpit) |

Semua layanan kecuali Nginx hanya mendengarkan di `127.0.0.1`. Nginx mendengarkan di semua
interface pada port 80, jadi perangkat lain di jaringanmu bisa mengakses situsmu kalau Windows
Firewall mengizinkan. Daftar lengkapnya ada di [Port](/id/guide/ports).

Dev server untuk proyek Vite, Next.js, Nuxt, Astro, dan Node tidak ada di halaman ini, dan
**Start all** tidak pernah menjalankannya. Masing-masing dijalankan dari halaman Projects,
lewat **Open** atau di **Dev servers**. Lihat [Dev Server](/id/guide/dev-servers).

## Start, stop, restart {#start-stop-restart}

Setiap baris punya tombol **Start** atau **Stop** sendiri dan ikon **Restart**. Restart adalah
stop yang diikuti start.

Toolbar di atas berlaku untuk seluruh halaman sekaligus:

- **Start all** menjalankan setiap layanan di daftar yang sedang berhenti *dan* sudah
  terpasang. Baris yang menampilkan **Not installed** dilewati.
- **Restart all** me-restart setiap layanan yang sedang berjalan.
- **Stop all** menghentikan semua yang sedang berjalan.

Semuanya berjalan paralel, dan baris diperbarui satu per satu saat layanannya menyala. Kalau
satu layanan gagal saat **Start all**, barisnya tetap **Stopped** tanpa pesan error; klik
**Start** di baris itu sendiri untuk melihat alasannya.

### Isi sebuah baris {#what-a-row-shows}

- **Status**: **Running**, **Stopped**, **Starting…**, **Stopping…**, atau **Not installed**.
- Label **versi** dan **port**. PHP menampilkan rentang port dan jumlah worker, misalnya
  `:9100–9103 · 4/4 workers`; Mailpit menampilkan kedua port-nya.
- **CPU**: sparkline kecil dan persentase selama layanan berjalan (di jendela yang cukup
  lebar). Ini cuplikan yang diambil setiap kali halaman memuat ulang daftarnya, misalnya
  setelah sebuah aksi, bukan pengukur langsung.
- **Open**: di baris Mailpit selama berjalan, membuka inbox di `http://127.0.0.1:8025`.
- **Toggle logs**: 20 baris terakhir output layanan itu, tepat di bawah barisnya. Halaman
  [Log](/id/guide/logs) punya tampilan gabungan lengkap.

### Memasang dari sebuah baris {#installing-from-a-row}

Baris untuk layanan yang bisa langsung dipakai dengan satu unduhan menampilkan **Install**,
bukan **Start**: Nginx, Mailpit, dan PostgreSQL. Selama bekerja, tombolnya menampilkan
**Downloading… N%**, **Verifying…**, **Extracting…**, lalu **Installing…**. Setiap unduhan dicek
dengan checksum yang dipublikasikan sebelum dipakai.

SQL Server LocalDB adalah installer Microsoft, jadi **Install**-nya pertama meminta kamu
menyetujui lisensi Microsoft lalu menampilkan satu prompt administrator Windows. Lihat
[SQL Server](/id/guide/sql-server#install-localdb).

Versi PHP dan Node.js ditambahkan di halaman [Switch](/id/guide/php-versions).

## Cara kerja stop {#how-stopping-works}

- **Nginx dan PHP** dihentikan seketika.
- **Database** (MariaDB/MySQL dan PostgreSQL) diminta shutdown dengan rapi, supaya bisa
  menutup file datanya. Rezure menunggu sampai dua menit sebelum memaksanya.

### Force stop {#force-stop}

Saat sebuah layanan tidak merespons, buka **More actions** (⋮) di barisnya dan pilih
**Force stop**. Itu langsung mematikan prosesnya. Untuk database, Rezure bertanya dulu, karena
database tidak sempat menutup direktori datanya dan harus menjalankan crash recovery di start
berikutnya. Pakai **Stop** kecuali memang benar-benar macet.

### Berapa lama database boleh butuh untuk start {#how-long-a-database-may-take-to-start}

Baris database tetap di **Starting…** sampai server benar-benar menerima koneksi. Biasanya
hanya beberapa detik, tetapi direktori data besar yang butuh recovery bisa lebih lama. Rezure
terus menunggu selama server masih menulis output log, dan baru menyerah setelah 90 detik tanpa
output ("the server stopped responding") atau 15 menit secara total.

## Saat layanan crash {#when-a-service-crashes}

**PHP me-restart dirinya sendiri.** Rezure mengecek worker-nya setiap dua detik dan me-restart
yang mati, dengan jeda 1, 2, 5, 10, lalu 30 detik di antara percobaan. Selama itu, jumlah worker
berubah kuning ("Some workers stopped unexpectedly and are being restarted. The rest keep
serving."). Kalau PHP terus crash selama lima menit, Rezure menjeda restart otomatis sampai
kamu sendiri menjalankan atau menghentikannya.

**Layanan lain tidak di-restart.** Database atau Nginx yang keluar sendiri akan tampil
**Stopped** saat halaman diperbarui berikutnya. Cek log-nya, lalu jalankan lagi.

Untuk mendapat notifikasi Windows saat salah satunya terjadi, aktifkan
**Notify when a service crashes** di [Pengaturan](/id/guide/settings): "{name} stopped
unexpectedly", atau "{name} keeps crashing: automatic restart paused" saat PHP menyerah.

Proses yang tertinggal akibat Rezure sendiri pernah crash dibersihkan saat Rezure dijalankan
berikutnya, tetapi hanya proses yang bisa dibuktikan dijalankan oleh Rezure.

## Kelola layanan {#manage-services}

Tidak setiap proyek butuh PostgreSQL, SQL Server, atau Mailpit. **Manage services** ("Choose
which services this page shows") memungkinkan kamu hanya menyimpan baris yang dipakai.

- Dialognya punya dua grup: **On the Services page** dan **Not added**. **Remove** dan **Add**
  memindahkan layanan di antara keduanya.
- Menghapus layanan **tidak meng-uninstall atau menyentuh datanya**: tambahkan lagi kapan saja.
- Layanan yang sedang berjalan dihentikan dulu ("Running: removing it stops it first"). Layanan
  yang dihapus juga tidak ikut **Start all**, **Restart all**, dan **Stop all**.
- Nginx dan PHP ditandai "Your project sites need it". Kamu tetap bisa menghapusnya.
- Versi PHP yang dikunci mengikuti baris **PHP**; tidak bisa dihapus sendiri-sendiri.

Layanan yang ditambahkan di versi Rezure mendatang akan muncul di halaman secara default.

## Menutup jendela {#closing-the-window}

Secara default, menutup jendela Rezure akan **keluar** dari aplikasi, dan keluar menghentikan
setiap layanan, setiap SSH tunnel, dan setiap proyek yang sedang dibagikan.

Supaya semuanya tetap berjalan di latar belakang, aktifkan **Keep running in tray on close** di
[Pengaturan](/id/guide/settings). Menutup jendela lalu hanya menyembunyikannya. Menu ikon tray
punya **Show Rezure** dan **Quit**, dan **Quit** tetap menghentikan semuanya lebih dulu.

## Ringkasan di sidebar {#the-sidebar-summary}

Kartu di bagian bawah sidebar menampilkan berapa layanan yang menyala ("Services up … of N"),
dan **Uptime**: berapa lama Rezure sendiri sudah terbuka, bukan berapa lama satu layanan sudah
berjalan. Item **Services** di sidebar menampilkan jumlah berjalan/total yang sama.

## Pemecahan masalah {#troubleshooting}

### "port 80 is already in use" atau "can't start Nginx: port 80 is held by …" {#port-80-is-already-in-use-or-can-t-start-nginx-port-80-is-held-by}

Ada program lain yang memakai port itu. Lihat [Konflik Port](/id/guide/port-conflicts); untuk
kebanyakan program Rezure bisa menghentikannya untukmu.

### "{name} isn't installed yet: download it from the Binaries panel first" {#name-isn-t-installed-yet-download-it-from-the-binaries-panel-first}

Pesan itu berasal dari tata letak lama. Pasang layanannya dari barisnya, atau dari
**Install version** di halaman [Switch](/id/guide/php-versions).

### PostgreSQL menolak berjalan "with administrator rights" {#postgresql-refuses-to-start-with-administrator-rights}

Rezure dijalankan dengan **Run as administrator**, dan PostgreSQL tidak mau berjalan dalam mode
elevated. Tutup Rezure, buka secara normal, lalu jalankan PostgreSQL lagi.

### Database macet di "Starting…" {#a-database-is-stuck-on-starting}

Buka log-nya (toggle logs di barisnya). Kalau masih mencetak pesan recovery, biarkan sampai
selesai. Kalau tertulis "the server stopped responding: no output and no connections for 90s",
direktori datanya mungkin rusak atau sedang dipakai program lain; cek
[MariaDB & MySQL](/id/guide/mariadb-mysql#troubleshooting).

## Terkait {#related}

- [Konflik Port](/id/guide/port-conflicts): saat port sudah terpakai
- [Log](/id/guide/logs): output setiap layanan di satu tempat
- [Pengaturan](/id/guide/settings): tray, notifikasi, dan jalan saat Windows mulai

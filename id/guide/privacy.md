---
title: Privasi dan Data Penggunaan
description: 'Persis data pemakaian apa yang dikirim Rezure dan kapan: ID perangkat, event, dan heartbeat. Apa yang tidak pernah dikirim, dan cara mematikannya.'
---

# Privasi dan Data Penggunaan

Rezure mengirim sedikit data pemakaian ke server miliknya, supaya pengelola bisa melihat versi dan
stack apa yang dipakai orang dan error apa yang paling sering muncul. Halaman ini mencantumkan
semuanya. Fitur ini **aktif secara default**, dan tidak ada switch untuknya di aplikasi.

## ID perangkat {#the-device-id}

Saat pertama kali dijalankan, Rezure membuat ID acak (UUID) untuk instalasi ini dan menyimpannya di
`C:\rezure\etc\device.json`. ID ini tidak diturunkan dari hardware atau akunmu. ID ini dikirim
bersama setiap event dan heartbeat di bawah, **dan bersama setiap tiket Feedback**, jadi tiket dan
data pemakaian dari satu instalasi bisa dihubungkan satu sama lain.

Menghapus `device.json` (dengan Rezure tertutup) membuat instalasi terlihat baru.

## Apa yang dikirim {#what-is-sent}

### Event {#events}

| Kapan | Event | Isinya |
| --- | --- | --- |
| Rezure dibuka | `app_opened` | Tidak lebih dari data dasar di bawah |
| Sebuah layanan dijalankan | `service.start` | Nama layanan (misalnya "Nginx"), dan versi PHP, MariaDB/MySQL, PostgreSQL, dan SQL Server LocalDB yang dipakai, hanya yang terpasang |
| Sebuah layanan dihentikan | `service.stop` | Nama layanan |
| Start, stop, atau restart gagal | `error.report` | Hanya **jenis** error (misalnya `PortInUse`), plus aksi dan layanannya. Tidak pernah pesan error-nya. |
| Sebuah layanan crash sendiri | `error.report` | `ServiceCrashed` dan layanannya |
| Kamu menambahkan folder dengan **Add folder** | `project.linked` | id [framework](/id/guide/frameworks) hasil deteksi dan yang kamu pilih, kalau berbeda, misalnya `node` dan `codeigniter4` |
| Kamu mengganti framework proyek, atau mengembalikannya ke Auto | `project.framework_changed` | Dua id framework yang sama |

Event framework menunjukkan di mana deteksi salah menebak proyek dan framework apa yang dipakai
orang yang belum dikenali Rezure. Hanya id bawaan seperti `laravel` yang dikirim apa adanya.
Framework dari `frameworks.json` milikmu dikirim sebagai `user-defined`, karena id-nya bisa
menyebut nama perusahaan atau klienmu, custom folder sebagai `custom`, dan tidak ada kecocokan
sebagai `unknown`. Nama proyek, path, domain, dan file-nya tidak pernah disertakan.

[Dev server](/id/guide/dev-servers) sama sekali tidak mengirim apa pun: menjalankan, menghentikan,
atau crash-nya tidak mencatat event, karena id-nya adalah nama proyek.

Setiap event juga membawa ID perangkat, ID event acak, versi Rezure, dan waktu kejadiannya.

### Heartbeat {#heartbeats}

Sekali saat Rezure dijalankan dan setiap lima menit selama terbuka, Rezure mengirim heartbeat
berisi:

- ID perangkat,
- ID sesi: ID acak baru setiap kali Rezure dijalankan, hanya disimpan di memori,
- versi Rezure,
- edisi dan build Windows (misalnya "Windows 11 Home", "11 (26200)"),
- **nama akun Windows-mu** (nilai `%USERNAME%`), dipotong sampai 64 karakter.

Saat Rezure keluar, Rezure mengirim satu heartbeat terakhir dengan waktu selesai, tanpa detail
Windows atau nama akun.

### Di mana dan bagaimana {#where-and-how}

Event dan heartbeat diantrekan di `C:\rezure\rezure.db` dan dikirim setiap 60 detik, beberapa
sekaligus, lewat HTTPS ke `api.redscale.my.id`. Kalau pengiriman gagal, misalnya karena offline,
semuanya tetap di antrean dan dikirim nanti. Baris yang sudah terkirim dihapus dari antrean lokal
setelah tujuh hari.

Seperti request apa pun ke server mana pun, data ini sampai dari alamat IP-mu. Server memakainya
untuk mengetahui dari negara mana pemakaian berasal; alamat IP bukan bagian dari yang dikirim
Rezure.

## Apa yang tidak pernah dikirim {#what-is-never-sent}

- Path file atau folder
- Nama proyek, domain, atau nama database
- Apa pun yang kamu ketik: query, password, isi `.env`
- Pesan error atau baris log (kecuali log yang kamu pilih untuk dilampirkan ke tiket Feedback)
- Kode atau datamu

## Mematikannya {#turning-it-off}

Tidak ada switch di aplikasi. Rezure mematuhi sebuah pengaturan di file pengaturannya:

1. **Keluar** dari Rezure sepenuhnya, dari ikon tray kalau disimpan di sana. (Rezure menulis file
   ini selama berjalan, jadi editan saat aplikasi terbuka bisa tertimpa.)
2. Buka `C:\rezure\etc\settings.json` dan atur:

   ```json
   "shareUsageData": false
   ```

3. Jalankan Rezure lagi.

Sejak saat itu tidak ada yang baru dicatat dan tidak ada antrean yang dikirim. Pengaturan ini
bertahan setelah pembaruan. Baris yang diantrekan sebelum kamu mematikannya tetap di database
lokal, tidak terkirim.

## Tiket Feedback {#feedback-tickets}

Halaman **Feedback** hanya mengirim tiket saat kamu mengklik **Send ticket**. Isinya:

- ID perangkat (selalu),
- kategori, judul, dan deskripsi yang kamu tulis,
- versi Rezure dan versi Windows, kalau **Include Rezure version & OS info** dicentang (default-nya
  dicentang),
- file apa pun yang kamu lampirkan. **Attach latest log** menambahkan 200 baris terakhir dari
  halaman [Log](/id/guide/logs), yang bisa berisi path folder; baca dulu sebelum mengirim.

**Your reports** di halaman yang sama menampilkan tiket-tiketmu sebelumnya dan statusnya (Open,
In Progress, Resolved), dicari berdasarkan ID perangkat. Draf yang belum kamu kirim hanya disimpan
di mesinmu.

## Semua koneksi lain yang dibuat Rezure {#everything-else-rezure-connects-to}

Tidak satu pun dari ini membawa ID perangkat atau data pemakaian:

| Apa | Ke mana | Kapan |
| --- | --- | --- |
| Pengecekan pembaruan | `api.redscale.my.id` | Saat start, dan saat kamu membuka Changelog |
| Changelog, pemberitahuan major baru | `api.redscale.my.id` | Saat start / saat kamu membuka Changelog |
| Konten halaman Donate | `api.redscale.my.id` | Saat kamu membuka Donate |
| Katalog stiker | `api.redscale.my.id` | Saat kamu membuka **Browse** di Decorations |
| Daftar runtime dan unduhan | php.net, MariaDB, nodejs.org, getcomposer.org, EDB, GitHub, Microsoft, curl.se, wordpress.org | Hanya saat kamu memasang sesuatu |
| Cloudflare | Jaringan tunnel Cloudflare | Hanya selama kamu [membagikan](/id/guide/sharing) proyek |
| Database remote dan server SSH-mu | Ke mana pun kamu mengarahkannya | Hanya saat kamu memakai [koneksi](/id/guide/remote-databases) |

## Password tetap di mesinmu {#passwords-stay-on-your-machine}

Password database dan SSH yang disimpan masuk ke **Windows Credential Manager**, di bawah **Rezure
Database Connections**, tidak pernah ke file milik Rezure, dan tidak pernah keluar dari PC-mu.
Lihat [Database Remote](/id/guide/remote-databases#where-connections-are-stored).

Satu-satunya saat password database tersimpan keluar dari Rezure adalah saat kamu mengklik **Open**
di koneksi remote: password diserahkan ke SQL client yang kamu pilih di PC-mu sendiri, supaya
client bisa menyambung. Lihat
[Password dan "Open with"](/id/guide/remote-databases#passwords-and-open-with).

## Terkait {#related}

- [File & Folder](/id/guide/files-and-folders): di mana `device.json` dan `settings.json` disimpan
- [Pembaruan & Changelog](/id/guide/updates): apa yang dikirim pengecekan pembaruan

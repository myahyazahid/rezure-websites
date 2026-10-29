---
title: "Pertama Kali Dijalankan: Sajikan Situs PHP Pertamamu Secara Lokal"
description: Jalankan Nginx, PHP, dan MariaDB, sajikan proyek .test pertamamu, sambungkan ke database, ganti versi PHP, dan tangkap email keluar.
---

# Pertama Kali Dijalankan

Halaman ini memandu lima menit pertamamu dengan Rezure: jalankan layanan, buat proyek bisa
diakses, dan sambungkan ke database.

## 1. Jalankan layanan {#_1-start-the-services}

Buka halaman **Services**. Nginx dan PHP sudah terpasang: tekan **Start** di masing-masing,
atau **Start all** di toolbar, dan statusnya berubah menjadi **Running**.

Kalau sebuah layanan menolak berjalan, Rezure memberi tahu port mana yang terpakai dan program
mana yang memakainya, bukan gagal diam-diam. Port 80 hampir selalu dipakai stack server lokal
lain atau IIS. Untuk kebanyakan program, Rezure menawarkan tombol **Stop it and start Nginx**
yang membebaskan port untukmu; lihat [Konflik Port](/id/guide/port-conflicts) untuk detailnya.

MariaDB tidak dibundel: saat pertama kali kamu menjalankannya, Rezure akan mengunduhnya.
Menunggunya hanya sekali, sekitar satu atau dua menit, dan hanya kalau kamu butuh database.

## 2. Tambahkan proyek {#_2-add-a-project}

Ada tiga cara agar sebuah proyek muncul di daftar:

**Taruh di `www`.** Buat `C:\rezure\www\myapp` dan proyek itu muncul di halaman **Projects**
sebagai `myapp.test`. Tidak ada yang perlu dikonfigurasi.

**Tautkan folder yang sudah ada.** Pakai **Add folder** di halaman Projects dan pilih foldernya
di mana pun ia berada. Rezure menampilkan nama, framework yang terdeteksi, folder yang akan
dilayani, dan domainnya, semuanya bisa diedit, sebelum menyimpan apa pun. Tidak ada yang disalin
atau dipindah; hanya path-nya yang dicatat.

**Mulai yang baru.** **New project** membuatkan proyek Laravel, WordPress, PHP kosong, atau HTML
statis di `www` untukmu. Lihat [Proyek Baru](/id/guide/new-project).

Apa pun caranya, Rezure menentukan document root untukmu dari
[framework](/id/guide/frameworks) proyek tersebut. Untuk Laravel, CodeIgniter 4, dan Symfony
itu adalah `public/`, bukan folder proyeknya, dan proyek Vite atau Next.js dilayani oleh
[dev server](/id/guide/dev-servers)-nya. Nama folder sebaiknya hanya berisi huruf, angka, dan
tanda hubung: underscore atau spasi menghasilkan domain yang tidak valid, dan proyeknya
tercantum sebagai **Not served**.

## 3. Buat domainnya bisa di-resolve {#_3-make-the-domain-resolve}

Rezure menulis virtual host Nginx untuk setiap proyek secara otomatis, tetapi domain `.test`
juga butuh satu baris di file `hosts` Windows sebelum browser bisa menemukannya.

Di halaman **Projects**, domain yang tampil dengan warna redup belum ada di file `hosts`. Klik
**Sync hosts file** di bagian atas halaman. Windows akan meminta persetujuan administrator;
klik **Yes**, kalau tidak domainnya tidak akan bisa di-resolve. Setelah selesai, domain berganti
ke warna aksen, dan tombolnya menjadi abu-abu dengan tulisan "Every domain already resolves".

Kamu hanya perlu melakukan ini saat menambahkan proyek. Kalau tidak mau mengkliknya setiap
kali, aktifkan **Auto-write hosts entries** di [Pengaturan](/id/guide/settings): Rezure lalu
melakukan sinkronisasi sekali setiap kali dijalankan.

## 4. Buka {#_4-open-it}

Klik **Open** di baris proyek dan `http://myapp.test` terbuka di browser default-mu.

Kalau domainnya tidak termuat, penyebab umumnya: Nginx atau PHP tidak berjalan, sinkronisasi
`hosts` ditolak, atau browser menyimpan cache kegagalan sebelumnya: coba jendela private.
**502 Bad Gateway** berarti Nginx sudah jalan tetapi layanan PHP yang dipakai proyek belum.

## 5. Sambungkan ke database {#_5-connect-to-the-database}

Jalankan MariaDB, lalu buka halaman **Databases**. Server bawaan berjalan dengan kredensial
lokal default:

```
Host: 127.0.0.1
Port: 3306
User: root
Password: (kosong)
```

Di `.env` Laravel, itu menjadi:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=
```

**New database** membuat schema, dan setiap database menampilkan jumlah tabel, ukuran, dan
proyek yang tampaknya memakainya. **Open** membuka database di SQL client mana pun yang kamu
pasang (TablePlus, DBeaver, HeidiSQL, MySQL Workbench, atau Navicat), dengan **MariaDB console**
bawaan yang selalu tersedia sebagai cadangan. **Export** menulis dump `.sql` ke
`C:\rezure\dumps`, dan **Import .sql** memuatnya kembali.

Password kosong dan login root tidak masalah di mesin yang hanya bisa kamu akses. Jangan pakai
setup ini di tempat selain laptopmu sendiri.

Pakai PostgreSQL atau SQL Server? Lihat [PostgreSQL](/id/guide/postgresql),
[SQL Server](/id/guide/sql-server), dan [Contekan .env Laravel](/id/guide/laravel-env). Butuh
database di server staging atau VPS? Lihat [Database Remote](/id/guide/remote-databases).

## 6. Ganti versi PHP (opsional) {#_6-switch-php-versions-optional}

Halaman **Switch** menampilkan versi aktif setiap runtime. Klik **Install version**, pilih
**PHP**, dan Rezure menampilkan apa yang sedang dipublikasikan php.net: rilis terbaru dari
setiap branch, dengan SHA-256 asli per build, sehingga daftarnya tidak pernah basi.

Ada dua cara menambahkannya:

1. **Pasang dari aplikasi**: pilih versi, lalu Rezure mengunduh dan memverifikasinya.
2. **Taruh sendiri**: pakai **Add from folder…** di dialog yang sama, atau taruh build PHP yang
   kamu unduh sendiri ke `C:\rezure\custom\php`. Rezure akan menemukannya di pemindaian berikutnya.

Lalu pilih versinya di dropdown baris PHP. Mengganti **default global** hanya me-restart layanan
**PHP** utama. Proyek yang diatur ke **Default** mengikuti versi itu. Untuk menjaga proyek
tertentu tetap di versi lain sementara kamu mengganti default untuk yang lain, kunci proyek itu
di halaman **Projects**. Lihat [Versi PHP](/id/guide/php-versions) dan
[PHP per Proyek](/id/guide/project-php-version).

## 7. Tangkap email keluar (opsional) {#_7-catch-outgoing-mail-optional}

Klik **Install** di baris **Mailpit** pada halaman Services, lalu **Start**. Arahkan `.env`
proyekmu ke sana:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

Setiap email yang dikirim proyek sekarang masuk ke inbox di `http://127.0.0.1:8025`; tombol
**Open** di baris Mailpit membawamu ke sana. Lihat [Mailpit](/id/guide/mailpit).

## Ke mana selanjutnya {#where-to-go-next}

Itulah alur intinya. Dari sini, jalankan [Cek Kebutuhan](/id/guide/requirements-check) pada
sebuah proyek, buka [terminal proyek](/id/guide/project-terminal), atau
[bagikan proyek secara publik](/id/guide/sharing) saat kamu butuh link sementara untuk orang di
luar jaringanmu. Baca [FAQ](/id/guide/faq), atau buka issue di
[GitHub](https://github.com/myahyazahid/rezure/issues) kalau ada yang tidak berjalan seperti
yang dijelaskan di halaman ini.

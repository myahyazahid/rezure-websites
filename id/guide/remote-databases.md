---
title: Menyambung ke Database Remote lewat SSH Tunnel
description: 'Sambungkan Rezure ke MySQL, MariaDB, PostgreSQL, atau SQL Server di VPS atau server staging lewat SSH tunnel, lalu buka di TablePlus, DBeaver, atau HeidiSQL.'
---

# Koneksi Database Remote

Halaman **Databases** di Rezure tidak terbatas pada server yang dijalankannya secara lokal. Kamu
bisa menambahkan **koneksi** ke server yang tidak dikelola Rezure (server staging, VPS, instance
shared hosting, SQL Server kantor) dan memakai halaman yang sama untuk menampilkan database,
mengekspor dump, mengimpor SQL, dan menyerahkan database ke client yang sudah kamu pakai.

Rezure tidak pernah menjalankan atau menghentikan server remote. Rezure hanya menyambung, membaca,
dan (kalau kamu izinkan) menulis.

Tiga jenis server didukung: **MySQL / MariaDB**, **PostgreSQL**, dan **SQL Server**. Masing-masing
bisa dijangkau langsung atau lewat SSH tunnel.

## Yang bisa kamu lakukan di target remote {#what-you-can-do-on-a-remote-target}

Saat kamu mengganti halaman **Databases** ke koneksi tersimpan, kamu mendapat alur kerja yang sama
dengan server lokal, dengan beberapa perbedaan yang disengaja:

- **Daftar database**: jumlah tabel dan ukuran. Ikon refresh membacanya ulang.
- **Ekspor**: dump database ke file di `C:\rezure\dumps`. MySQL/MariaDB dan PostgreSQL menulis dump
  `.sql`. (SQL Server remote tidak bisa diekspor dari Rezure; lihat
  [di bawah](#export-and-import-notes).)
- **Impor**: muat file `.sql` ke server remote kalau koneksinya tidak read-only. Rezure memintamu
  mengetik ulang nama database sebelum impor remote dijalankan.
- **Open**: luncurkan SQL client yang terpasang dengan arah ke server remote (lewat tunnel, kalau
  dikonfigurasi).

Target remote **read-only secara default**. **New database** dinonaktifkan dan **Import .sql**
disembunyikan sampai kamu menyimpan koneksi dengan **Read-only** dimatikan.

Kolom **Used by** disembunyikan untuk server remote: mencocokkan nama database dengan proyek lokal
hanya masuk akal di mesinmu.

## Yang dibutuhkan Rezure secara lokal {#what-rezure-needs-locally}

Rezure berkomunikasi dengan server remote memakai tool client sungguhan, jadi satu komponen lokal
dibutuhkan per jenis server:

| Jenis server | Butuh | Dapatkan dari |
| --- | --- | --- |
| MySQL / MariaDB | Build MySQL atau MariaDB apa pun yang terpasang (client `mysql`/`mariadb` dan tool dump-nya) | **Switch → Install version → MariaDB**, atau build MySQL yang diekstrak ke `C:\rezure\custom\mysql` |
| PostgreSQL | Build PostgreSQL apa pun yang terpasang (`psql` dan `pg_dump`) | **Switch → Install version → PostgreSQL**, atau **Install PostgreSQL** di form Add connection |
| SQL Server | Microsoft ODBC Driver 17 atau 18 for SQL Server | **Install ODBC Driver** di form Add connection atau di PHP Extensions. Lihat [SQL Server](/id/guide/sql-server) |

Untuk PostgreSQL, Rezure memakai build **terbaru** yang terpasang, karena `pg_dump` menolak
men-dump server yang lebih baru darinya. Kalau server remote menjalankan PostgreSQL 18, pasang 18
secara lokal.

Saat komponennya tidak ada, koneksi tetap muncul di pengalih, dalam keadaan nonaktif, dengan
catatan apa yang perlu dipasang.

## Menambahkan koneksi {#add-a-connection}

1. Buka halaman **Databases**.
2. Buka pengalih target (di atas halaman) dan klik **+ Add connection**.
3. Isi detailnya:
   - **Name**: label yang mudah kamu kenali (`Staging`, `Production read replica`, dll.).
   - **Server type**: **MySQL / MariaDB**, **SQL Server**, atau **PostgreSQL**. Memilih salah
     satunya mengisi port dan user yang biasa (3306 / `root`, 1433 / `sa`, 5432 / `postgres`)
     kecuali kamu sudah mengetik milikmu sendiri.
   - **Host** dan **Port**: tempat database mendengarkan **dari sudut pandang mesin yang
     menyambung ke sana** (lihat [SSH tunnel](#connect-through-an-ssh-tunnel) di bawah kalau itu
     bukan PC-mu).
   - **User** dan **Password**: akun database, bukan login SSH.
   - **Server engine** (hanya MySQL / MariaDB): **MySQL** atau **MariaDB**. Rezure memilih client
     yang cocok dan beralih ke yang lain kalau hanya itu yang kamu punya. Client MariaDB tidak bisa
     login ke sebagian akun MySQL 8; lihat
     [pemecahan masalah](#caching-sha2-password-or-authentication-plugin-errors).
   - **Encryption**: **Automatic** (pakai TLS kalau server menawarkannya), **Required** (tolak
     menyambung tanpanya), atau **Off** (untuk jaringan privat atau SSH tunnel).
4. Klik **Test connection**. Kalau berhasil, Rezure menampilkan "Connected: server reports" dan
   string versi dari server. **Save** tetap nonaktif sampai tes lolos, dan perubahan apa pun pada
   form menghapus hasilnya, jadi tes hijau berarti koneksi yang disimpan berfungsi.
5. Klik **Save**.

Rezure menolak menyimpan server yang sama dua kali: kalau host, port, user, dan SSH host semuanya
cocok dengan koneksi yang sudah ada, Rezure memberitahu yang mana.

### Khusus SQL Server {#sql-server-specifics}

- **Host** bisa berupa nama dan instance, seperti `db.office.local\SQLEXPRESS`. Untuk named
  instance, kosongkan **Port**; SQL Server Browser memberikan port sebenarnya.
- **Sign in with**: **SQL Server login** (user dan password) atau **Windows account**. Windows
  account login sebagai user Windows yang menjalankan Rezure; tidak ada password yang disimpan di
  mana pun. Ini berfungsi untuk server di mesin ini dan di domain kantormu.
- **Trust server certificate**: mati secara default. Nyalakan hanya untuk server tepercaya yang
  memakai sertifikat self-signed.
- Saat kamu memilih SQL Server, Rezure memindai PC ini untuk edisi SQL Server dan instance LocalDB
  yang terpasang lalu menampilkannya di bawah **Found on this computer**. Mengklik salah satunya
  mengisi form; kamu tetap perlu mengetes dan menyimpannya. Lihat
  [SQL Server](/id/guide/sql-server#connect-to-another-sql-server).

### Di mana koneksi disimpan {#where-connections-are-stored}

Pengaturan koneksi (tanpa password) disimpan di `C:\rezure\etc\connections.json`.

Password tidak pernah ditulis ke file itu. Dengan **Save the password in Windows Credential
Manager** dicentang (default), Rezure menyimpannya di sana di bawah **Rezure Database
Connections**. Kalau tidak dicentang, Rezure bertanya sekali per sesi dan hanya menyimpan password
di memori.

## Berpindah ke server remote {#switch-to-a-remote-server}

Pakai pengalih target di halaman **Databases**. Pengalih punya dua bagian:

- **Data directory**: profil MySQL/MariaDB lokalmu (lihat [MariaDB & MySQL](/id/guide/mariadb-mysql)).
- **Connections**: server remote, plus PostgreSQL dan SQL Server LocalDB milik Rezure begitu
  terpasang.

Pilih sebuah koneksi untuk membaca server itu ("Now reading Staging."). Pilih lagi profil lokalmu
untuk kembali. Pilihannya diingat setelah restart.

Mengganti target **tidak** menghentikan atau menjalankan apa pun. Halaman **Services** tetap
menunjukkan apakah Nginx, PHP, dan database lokal berjalan, tidak tergantung server mana yang
sedang ditampilkan halaman Databases.

### "Needs password" dan Unlock {#needs-password-and-unlock}

Koneksi yang disimpan tanpa password menampilkan badge kuning **Needs password**. Memilihnya
membuka **Password for {name}**: ketik password lalu klik **Unlock**. Checkbox **Save it in Windows
Credential Manager** di sana memungkinkan kamu berubah pikiran ke arah mana pun: menghapus
centangnya menghapus salinan yang disimpan sebelumnya.

## Menyambung lewat SSH tunnel {#connect-through-an-ssh-tunnel}

Banyak database remote sama sekali tidak bisa dijangkau dari internet. Mereka mendengarkan di
`127.0.0.1` pada server itu sendiri, atau berada di balik firewall yang memblokir port database.
Untuk itu, aktifkan **Connect through an SSH tunnel** saat menambahkan koneksi. Tunnel berfungsi
untuk ketiga jenis server.

### Bagaimana field-field saling terkait {#how-the-fields-fit-together}

Dengan SSH aktif, ada dua lompatan:

1. **SSH**: PC-mu menyambung ke server (`SSH host`, `SSH port`, `SSH user`).
2. **Database**: dari sudut pandang server SSH, database ada di **Host** dan **Port** pada form
   utama.

Menyalakan tunnel mengisi **Host** dengan `127.0.0.1`, karena biasanya itu yang benar:

| Field | Nilai umum | Arti |
| --- | --- | --- |
| SSH host | `203.0.113.10` atau `staging.example.com` | Mesin tempat kamu SSH |
| SSH port | `22` | Port SSH di mesin itu |
| SSH user | `deploy`, `ubuntu`, `root`, … | Login SSH-mu |
| Host (database) | `127.0.0.1` | Database mendengarkan di loopback server |
| Port (database) | `3306`, `5432`, atau `1433` | Port database sebenarnya di server |

Rezure menjalankan client OpenSSH bawaan Windows (`C:\Windows\System32\OpenSSH\ssh.exe`) dengan
local port forward:

```
ssh -N -L 127.0.0.1:<free port>:<db host>:<db port> user@ssh-host
```

Karena ini client OpenSSH standar, `~\.ssh\config` dan `known_hosts` milikmu berlaku seperti
biasa. Semua yang terjadi setelah tunnel menyala (query, ekspor, impor, membuka di DBeaver) lewat
`127.0.0.1` di mesinmu, persis seperti database lokal.

Setiap koneksi mendapat tunnel sendiri di port lokal kosong sendiri, jadi beberapa koneksi lewat
tunnel bisa terbuka sekaligus. Tunnel tetap terbuka selama kamu memakai koneksinya dan dihentikan
saat kamu keluar dari Rezure atau menghapus koneksinya. Pemakaian ulang otomatis: beberapa ekspor
dalam satu sesi hanya membayar handshake SSH sekali, bukan per klik. **Test connection** membuka
tunnel sementara miliknya sendiri.

### Autentikasi SSH {#ssh-authentication}

Rezure mendukung dua metode:

**Private key (disarankan)**

- Tunjuk ke **file private key** itu sendiri, misalnya `C:\Users\you\.ssh\id_ed25519`, bukan
  folder dan bukan password yang diketik di kotak path.
- Pakai **Browse** untuk memilih file-nya.
- Key-nya **tidak boleh punya passphrase**. Rezure tidak punya konsol untuk menjawab prompt
  passphrase selama sesi SSH.
- Pakai key berformat OpenSSH. Key PuTTY `.ppk` harus dikonversi dulu (PuTTYgen →
  **Conversions → Export OpenSSH key**).
- Rezure memberi `ssh` salinan privat dari key yang hanya bisa dibaca akunmu, jadi kamu tidak
  terkena error "bad permissions" dari OpenSSH. Sertifikat `-cert.pub` di sebelah key ikut disalin.
  File key milikmu tidak pernah diubah.

**Password**

- Isi password login SSH di field **SSH password**.
- Rezure meneruskannya ke `ssh.exe` lewat mekanisme askpass milik OpenSSH, tidak pernah di command
  line. Hanya satu percobaan per koneksi.
- Password SSH selalu disimpan di Windows Credential Manager, terpisah dari password database.

Password SSH dan password database adalah akun yang terpisah. Jangan tertukar.

### TLS dengan tunnel {#tls-with-a-tunnel}

Trafik di dalam sesi SSH sudah terenkripsi. Banyak orang mengatur **Encryption** ke **Off** untuk
koneksi lewat tunnel, tetapi **Automatic** tetap bekerja kalau server database mengharapkan TLS
bahkan di localhost.

### Contoh: aplikasi Laravel di VPS {#example-laravel-app-on-a-vps}

Aplikasimu berjalan di VPS. MySQL hanya menerima koneksi dari `127.0.0.1` di mesin itu, dan port
3306 tidak dibuka ke publik.

```
Name:     Staging VPS
Type:     MySQL / MariaDB
Host:     127.0.0.1
Port:     3306
User:     forge
Password: (password DB-mu)

☑ Connect through an SSH tunnel
SSH host: 203.0.113.10
SSH port: 22
SSH user: forge
Auth:     Private key → C:\Users\you\.ssh\id_ed25519
```

Klik **Test connection**. Kalau berhasil, simpan dan pindah ke **Staging VPS** di pengalih target.

## Koneksi read-only {#read-only-connections}

Koneksi baru default-nya **Read-only**. Itu memblokir:

- Membuat database
- Menghapus database
- Mengimpor SQL

Biarkan read-only aktif untuk server produksi yang hanya ingin kamu lihat atau ekspor. Untuk
menulis (impor staging, perbaikan schema, dan sejenisnya), tambahkan koneksi dengan **Read-only**
tidak dicentang.

## Mengubah atau menghapus koneksi {#change-or-remove-a-connection}

Koneksi tersimpan tidak bisa diedit. Untuk mengubah apa pun (host, kebijakan password, enkripsi,
read-only), hapus koneksinya lalu tambahkan lagi.

Untuk menghapus, arahkan kursor ke barisnya di pengalih dan klik ikon tempat sampah. **Tidak ada
konfirmasi.** Menghapus koneksi juga menghapus password tersimpannya dari Windows Credential
Manager dan menutup tunnel-nya. Koneksi **PostgreSQL** dan **SQL Server LocalDB** milik Rezure
tidak bisa dihapus.

## Catatan ekspor dan impor {#export-and-import-notes}

**Ekspor** dari server remote masuk ke `C:\rezure\dumps` seperti ekspor lokal, dengan nama koneksi
di depan nama file (`staging-eu-blog-20261024-101500.sql`) supaya dump staging tidak tertukar
dengan dump lokal. Dump remote yang besar bisa makan waktu: datanya melintasi jaringan. Ekspor
MySQL/MariaDB menampilkan progress bar dan bisa dibatalkan; ekspor PostgreSQL menampilkan progres
tetapi tidak bisa dibatalkan.

**SQL Server remote** tidak bisa diekspor: `BACKUP` milik SQL Server menulis file `.bak` ke disk
server itu sendiri, bukan disk-mu. Me-restore `.bak` ke server remote juga tidak ditawarkan.
Mengimpor script `.sql` bisa.

**Impor** ke server remote mengharuskan kamu mengetik nama database tujuan sebagai konfirmasi.
Kalau database belum ada, Rezure membuatnya dulu; kalau user remote-mu tidak punya hak untuk itu,
error dari server ditampilkan apa adanya. Impor tidak transaksional: kegagalan di tengah jalan
meninggalkan statement sebelumnya tetap diterapkan.

## Membuka di client eksternal {#open-in-an-external-client}

**Open** mendeteksi SQL client yang terpasang di mesinmu dan menampilkan yang memahami jenis server
itu, masing-masing dengan logonya. Untuk koneksi lewat tunnel, Rezure memberi client endpoint lokal
hasil forward di `127.0.0.1`, jadi kamu tidak perlu mengonfigurasi lompatan SSH sendiri. Itu juga
mencakup SSH dengan key `.pem`: key-nya hanya untuk lapisan SSH, yang ditangani Rezure.

### Password dan "Open with" {#passwords-and-open-with}

TablePlus, DBeaver, HeidiSQL, dan MariaDB console langsung menyambung saat dibuka, tanpa meminta
password. Password yang disimpan di dalam client juga tidak membantu, karena port lokal tunnel
berubah dari satu sesi ke sesi berikutnya. Jadi saat koneksi punya **password tersimpan**, Rezure
menyerahkannya:

| Client | Cara password diteruskan |
| --- | --- |
| TablePlus | Di URL koneksi, percent-encoded, sehingga `@`, `:`, atau `/` di password tidak merusaknya |
| DBeaver | Di spec koneksi. Tidak disertakan kalau password berisi `\|` atau `=` |
| HeidiSQL | Sebagai `--password=`. Tidak disertakan kalau diawali `-` atau berisi spasi atau `"` |
| MariaDB console | Di environment variable `MYSQL_PWD` milik console itu saja, tidak pernah di command line |
| MySQL Workbench | Tidak diteruskan: Workbench tidak punya opsi untuk itu, jadi ia bertanya di dialognya sendiri |

Password di command line bisa dibaca program lain yang berjalan sebagai user Windows-mu, program
yang sama yang toh sudah bisa membacanya dari Credential Manager. Tanpa itu, **Open** sama sekali
tidak bisa bekerja untuk server remote. Di tempat lain, Rezure menjauhkan password dari command
line.

Saat password tidak disertakan karena salah satu alasan di atas, ketik di dialog koneksi milik
client.

DBeaver dan MySQL Workbench butuh beberapa detik untuk menampilkan jendela, jadi halaman
menampilkan **Opening {client}…** sampai client muncul, dan **Open** tetap nonaktif selama itu.

Client mana membuka apa tercantum di [MariaDB & MySQL](/id/guide/mariadb-mysql#open-in-a-sql-client),
[PostgreSQL](/id/guide/postgresql#open-in-a-sql-client), dan
[SQL Server](/id/guide/sql-server#open-in-a-sql-client).

## Pemecahan masalah {#troubleshooting}

### Test connection gagal dengan "SSH tunnel failed" {#test-connection-fails-with-ssh-tunnel-failed}

Baca pesannya: Rezure menampilkan baris-baris terakhir dari log `ssh`. Penyebab umum:

- **SSH host, user, atau key salah**: `Permission denied (publickey)` dari server.
- **Key punya passphrase**: buat deploy key tanpa passphrase, atau pakai autentikasi password.
- **"no SSH key at …"**: path-nya tidak menunjuk ke file key. Pilih file-nya, bukan folder atau
  password yang ditempel di kotak key.
- **"didn't come up within 20s"**: server SSH tidak menjawab tepat waktu: host salah, firewall,
  atau VPN yang belum tersambung.
- **Host/port database salah di sisi server**: ingat bahwa Host di-resolve **di server SSH**, bukan
  di PC-mu. Kalau MySQL mendengarkan di `127.0.0.1:3306` di sana, pakai persis itu.
- **Named instance SQL Server tanpa port**: tunnel butuh port TCP sebenarnya dari instance itu.
  Isi di **Port**.

### "can't reach host: the connection timed out" {#can-t-reach-host-the-connection-timed-out}

Tidak ada yang menjawab. Biasanya firewall membuang port itu, atau server hanya mendengarkan di
`127.0.0.1` di mesinnya sendiri, dalam hal itu pakai SSH tunnel. "The connection was refused"
berarti host menjawab tetapi tidak ada yang mendengarkan di port itu: cek server berjalan dan
port-nya benar.

### Access denied (1698) untuk root di Ubuntu {#access-denied-1698-for-root-on-ubuntu}

Akun itu login berdasarkan user sistem operasi (`auth_socket` / `unix_socket`), yang tidak bisa
bekerja lewat jaringan. Buat user database dengan password sendiri dan pakai itu.

### Error caching_sha2_password atau plugin autentikasi {#caching-sha2-password-or-authentication-plugin-errors}

Server-nya MySQL 8 dan akunnya memakai `caching_sha2_password`, yang tidak bisa ditangani client
MariaDB. Atur **Server engine** ke **MySQL** dan pasang build MySQL di `C:\rezure\custom\mysql\`,
atau beri akun itu `mysql_native_password`.

### Impor gagal dengan "Unknown collation utf8mb4_0900_…" {#import-fails-with-unknown-collation-utf8mb4-0900}

Itu dump MySQL 8 yang masuk ke MariaDB. Ganti collation-nya dengan `utf8mb4_unicode_ci` di file,
atau impor ke server MySQL.

### PostgreSQL: "no pg_hba.conf entry" {#postgresql-no-pg-hba-conf-entry}

Server tidak mengizinkan koneksi dari alamatmu. Tambahkan baris untuk alamatmu ke `pg_hba.conf`
server, atau sambungkan lewat SSH tunnel. Error "server version mismatch" berarti server remote
lebih baru dari build PostgreSQL lokal terbarumu; pasang versi itu atau yang lebih baru dari
halaman **Switch**.

### SQL Server: error sertifikat {#sql-server-certificate-errors}

Server memakai sertifikat yang tidak dipercaya Windows. Hapus dan tambahkan ulang koneksi dengan
**Trust server certificate** dicentang, hanya untuk server yang kamu percaya. Error "untrusted
domain" dengan **Windows account** berarti PC-mu tidak ada di domain server; pakai login SQL
Server.

### "Access denied … (using password: NO)" saat membuka di client {#access-denied-using-password-no-when-opening-in-a-client}

Koneksi tidak punya password tersimpan, atau punya tetapi tidak bisa diserahkan ke client (lihat
[Password dan "Open with"](#passwords-and-open-with)). Simpan password di koneksi Rezure, atau
ketik di dialog koneksi client. Rezure 3.3 ke atas meneruskan password tersimpan ke TablePlus,
DBeaver, HeidiSQL, dan MariaDB console, termasuk lewat SSH.

### HeidiSQL membuka sesi bernama seperti `b=shop` {#heidisql-opens-a-session-named-like-b-shop}

Sesi itu ditinggalkan Rezure versi lama, yang meneruskan `-db=` dan HeidiSQL membacanya sebagai
nama sesi. Hapus di session manager HeidiSQL. Versi terbaru tidak membuatnya.

### MySQL Workbench hanya membuka layar Home {#mysql-workbench-only-opens-its-home-screen}

Perbarui Rezure: versi sebelum 3.3 meneruskan opsi yang tidak dikenali Workbench 8.0. Workbench
lalu membuka koneksi dan meminta password sendiri.

### "read-only" saat mencoba menulis {#read-only-when-trying-to-write}

Koneksi disimpan dengan **Read-only** aktif. Hapus dan tambahkan lagi dengan kotak itu tidak
dicentang.

### Koneksi terpilih tetapi tidak ada yang termuat setelah restart {#the-connection-is-selected-but-nothing-loads-after-a-restart}

Kalau password hanya disimpan untuk sesi, password itu hilang setelah restart. Mengklik baris yang
sudah terpilih tidak berbuat apa-apa, jadi pilih dulu profil lokalmu di bawah **Data directory**,
lalu pilih lagi koneksinya untuk mendapat dialog **Unlock**.

### Koneksi berhasil sekali, lalu gagal kemudian {#connection-works-once-then-fails-later}

SSH tunnel bisa mati kalau server menutup sesi yang menganggur. Rezure mengirim keepalive, tetapi
laptop yang tertidur atau key server yang berubah tetap bisa memutus sesi lama. Pindah ke target
lain lalu kembali, atau tes ulang koneksinya: Rezure memulai tunnel baru saat yang lama mati.

### Host key ketat / koneksi pertama {#strict-host-key-first-connect}

Saat pertama kali menghubungi server SSH, Rezure menerima host key baru secara otomatis
(`StrictHostKeyChecking=accept-new`). Kalau key server berubah kemudian, SSH akan menolak koneksi
sampai kamu memperbarui `known_hosts` sendiri, sama seperti client OpenSSH lain.

## Terkait {#related}

- [MariaDB & MySQL](/id/guide/mariadb-mysql): server lokal dan profil direktori data
- [PostgreSQL](/id/guide/postgresql) dan [SQL Server](/id/guide/sql-server): engine lokal lainnya
- [Contekan .env Laravel](/id/guide/laravel-env): nilai koneksi untuk setiap engine
- [FAQ](/id/guide/faq): port, izin, dan apa saja yang dipasang Rezure

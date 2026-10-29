---
title: Mengatasi 502 Bad Gateway, Domain .test, dan Masalah Lain
description: 'Solusi untuk masalah umum Rezure: port terpakai, domain .test yang tidak bisa di-resolve, 502 Bad Gateway, 404 di CodeIgniter atau Symfony, Vite, cURL error 60.'
---

# Pemecahan Masalah

Cari gejalanya, coba perbaikannya. Kebanyakan entri menautkan ke halaman berisi detailnya. Saat
Rezure menampilkan pesan error, biasanya pesannya spesifik; baca dulu.

## Instalasi dan menjalankan {#installing-and-starting}

### SmartScreen bilang "Windows protected your PC" {#smartscreen-says-windows-protected-your-pc}

Itu soal code signing, bukan laporan virus. Verifikasi
[hash SHA-256](/id/download#verify-your-download) installer-nya, lalu pilih **More info → Run
anyway**.

### Nginx atau PHP menampilkan "Not installed" tepat setelah dipasang {#nginx-or-php-shows-not-installed-right-after-installing}

Binary bawaannya tidak terekstrak. Instal ulang di atasnya.

### Setup bilang WebView2 tidak ada {#setup-says-webview2-is-missing}

Pasang dari [halaman WebView2 Microsoft](https://developer.microsoft.com/microsoft-edge/webview2/),
lalu jalankan installer lagi.

## Layanan {#services}

### "port 80 is already in use" / "port 80 is held by …" {#port-80-is-already-in-use-port-80-is-held-by}

Ada program lain yang memakai port itu: Laragon, XAMPP, IIS, Docker. Klik **Stop it and start**,
atau lihat [Konflik Port](/id/guide/port-conflicts) untuk port yang dicadangkan Windows.

### Sebuah layanan tetap "Stopped" setelah Start all {#a-service-stays-stopped-after-start-all}

**Start all** tidak menampilkan error per layanan. Klik **Start** di baris itu sendiri untuk melihat
alasannya.

### "… isn't installed yet: download it from the Binaries panel first" {#isn-t-installed-yet-download-it-from-the-binaries-panel-first}

Kata-kata versi lama. Pasang layanannya dari barisnya di halaman Services, atau dari
**Install version** di halaman Switch.

### PostgreSQL "refuses to run with administrator rights" {#postgresql-refuses-to-run-with-administrator-rights}

Rezure dijalankan dengan **Run as administrator**. Tutup lalu buka secara normal.

### Database macet di "Starting…" atau "stopped responding" {#a-database-is-stuck-on-starting-or-stopped-responding}

Buka log-nya dari barisnya. Database yang sedang pulih setelah crash atau force stop bisa butuh
waktu dan mencetak progres selama berjalan. Lihat
[Layanan](/id/guide/services#how-long-a-database-may-take-to-start).

### PHP terus crash dan "automatic restart paused" {#php-keeps-crashing-and-automatic-restart-paused}

Cek halaman [Log](/id/guide/logs) yang difilter ke `php` untuk alasannya. Kalau kamu baru saja
menambahkan file ke `C:\rezure\etc\php\conf.d`, pengaturan yang tidak valid di sana patut dicurigai:
pindahkan file-nya keluar, lalu jalankan PHP lagi.

## Situs {#sites}

### `myapp.test` sama sekali tidak terbuka {#myapp-test-doesn-t-open-at-all}

1. Di halaman Projects, apakah domainnya berwarna aksen? Kalau tidak, klik **Sync hosts file** dan
   setujui prompt administrator.
2. Apakah Nginx berjalan?
3. Coba jendela browser private, siapa tahu kegagalan lama tersimpan di cache.

### Prompt hosts terus muncul lagi {#the-hosts-prompt-keeps-coming-back}

Tool lain (biasanya Laragon atau XAMPP) menulis ulang file `hosts` dan menghapus baris milik Rezure.
Hentikan tool itu atau matikan fitur pengelolaan hosts-nya.

### 502 Bad Gateway {#_502-bad-gateway}

Nginx berjalan tetapi layanan PHP yang dipakai proyek tidak. Jalankan **PHP**. Atau, untuk proyek
yang [dikunci](/id/guide/project-php-version), baris **PHP x.y.z**-nya.

### Proyek bertuliskan "Not served" {#the-project-says-not-served}

Nama foldernya berisi underscore, spasi, atau karakter lain yang tidak boleh ada di domain. Ganti
namanya dengan huruf, angka, dan tanda hubung. Lihat [Proyek](/id/guide/projects#domains).

### Situs Symfony atau CodeIgniter 4 menjawab 404 {#a-symfony-or-codeigniter-4-site-answers-404}

Sejak Rezure 3.3 keduanya dideteksi dan dilayani dari `public\`. Kalau situs masih menjawab 404,
berarti dilayani dari folder yang salah: arahkan kursor ke badge framework proyek untuk mengecek,
lalu klik dan pilih framework yang benar, atau **Custom folder…**. Tautan lama ke folder `public\`
proyek sebaiknya dihapus dan folder proyeknya ditambahkan. Lihat
[Framework](/id/guide/frameworks#troubleshooting).

### "This project's dev server isn't running" {#this-project-s-dev-server-isn-t-running}

Proyek Vite, Next.js, Nuxt, Astro, atau Node dilayani oleh dev server-nya sendiri, dan tidak ada
yang menjawab di port-nya. Klik **Open**, atau **Start** di **Dev servers** pada halaman Projects.
Lihat [Dev Server](/id/guide/dev-servers).

### Dev server tidak mau start {#a-dev-server-won-t-start}

Dialog **Dev servers** menyebut alasan dan perbaikannya: dependency belum terpasang
(**npm install**), versi Node.js yang belum terpasang, script yang tidak ada, atau salinan yang
sudah berjalan di terminal (**Stop it and start here**). Lihat
[Dev Server](/id/guide/dev-servers#when-a-dev-server-can-t-start-yet).

### Vite bilang "Blocked request. This host is not allowed" {#vite-says-blocked-request-this-host-is-not-allowed}

Versi Vite-mu terlalu lama untuk menerima domain yang diteruskan Rezure. Tambahkan
`server: { allowedHosts: ['.test'] }` ke `vite.config`. Lihat
[Dev Server](/id/guide/dev-servers#blocked-request-this-host-is-not-allowed-from-vite).

### Halaman kosong atau error 500 dari Laravel {#a-blank-page-or-a-500-error-from-laravel}

Alasannya ada di `storage\logs\laravel.log` di dalam proyek. Ekstensi PHP yang hilang adalah
penyebab paling umum; jalankan [Cek Kebutuhan](/id/guide/requirements-check).

### "cURL error 60: SSL certificate problem" {#curl-error-60-ssl-certificate-problem}

PHP tidak punya bundel CA. Di halaman Switch, klik **Download** di kartu **CA certificates**, lalu
restart PHP. Lihat [Konfigurasi PHP](/id/guide/php-configuration#ca-certificates).

### "413 Request Entity Too Large" saat upload {#_413-request-entity-too-large-on-upload}

Nginx menerima body request sampai 64 MB. Upload yang lebih besar ditolak sebelum PHP melihatnya,
apa pun nilai `upload_max_filesize`.

### Request panjang berhenti setelah lima menit {#a-long-request-stops-after-five-minutes}

`max_execution_time` milik PHP dan timeout FastCGI milik Nginx sama-sama 300 detik. Untuk pekerjaan
yang lebih lama, jalankan dari [terminal proyek](/id/guide/project-terminal) atau queue worker.

### Pengaturan di `php.ini` tidak berpengaruh {#a-setting-in-php-ini-doesn-t-take-effect}

Rezure menulis ulang `php.ini` miliknya setiap kali start. Taruh pengaturanmu di
`C:\rezure\etc\php\conf.d` lalu restart PHP. Lihat
[Konfigurasi PHP](/id/guide/php-configuration#your-php-settings).

## PHP dan terminal {#php-and-the-terminal}

### "could not find driver" {#could-not-find-driver}

Ekstensi PDO untuk database-mu mati atau tidak ada untuk versi PHP yang dipakai proyek:
`pdo_pgsql` untuk PostgreSQL (mati secara default), `pdo_sqlsrv` untuk SQL Server (pasang dulu).
Nyalakan di [Ekstensi PHP](/id/guide/php-extensions), lalu restart PHP.

### `php -v` di terminal menampilkan versi yang salah {#php-v-in-a-terminal-shows-the-wrong-version}

Jalankan `where php`. Terminal yang dibuka dari baris proyek memakai versi proyek itu. Di tempat
lain, `php` adalah apa pun yang ada di urutan pertama `PATH`; aktifkan
[Use Rezure's PHP everywhere](/id/guide/php-configuration#use-rezure-s-php-everywhere), dan hapus
PHP lain dari `PATH` **sistem**, yang dibaca Windows lebih dulu.

### Ekstensi berfungsi di situs tetapi tidak di terminal {#an-extension-works-on-the-site-but-not-in-the-terminal}

Situs dan terminal membaca file `php.ini` yang berbeda. Lihat
[Ekstensi PHP](/id/guide/php-extensions#browser-vs-terminal).

### `composer` is not recognized {#composer-is-not-recognized}

Rezure tidak menaruh Composer di `PATH`. Lihat
[Terminal Proyek](/id/guide/project-terminal#running-composer).

## Database {#databases}

### "MariaDB isn't running, so there's nothing to list yet" {#mariadb-isn-t-running-so-there-s-nothing-to-list-yet}

Jalankan database dari halaman Services, lalu klik ikon refresh di halaman Databases. Pesan yang
sama muncul saat profil MySQL aktif.

### Access denied di direktori data Laragon atau XAMPP yang diadopsi {#access-denied-on-an-adopted-laragon-or-xampp-data-directory}

Rezure membaca server lokal sebagai `root` dengan password kosong. Lihat
[MariaDB & MySQL](/id/guide/mariadb-mysql#troubleshooting).

### "Unknown collation utf8mb4_0900_ai_ci" saat impor {#unknown-collation-utf8mb4-0900-ai-ci-on-import}

Dump MySQL 8 yang masuk ke MariaDB. Ganti dengan `utf8mb4_unicode_ci` di file-nya.

### Database PostgreSQL-ku hilang setelah ganti versi {#my-postgresql-databases-disappeared-after-switching-versions}

Setiap versi major punya folder datanya sendiri. Pindah kembali untuk melihatnya; ekspor dan impor
untuk memindahkannya. Lihat [PostgreSQL](/id/guide/postgresql#switch-versions).

### Koneksi remote gagal {#a-remote-connection-fails}

Lihat bagian pemecahan masalah di
[Database Remote](/id/guide/remote-databases#troubleshooting).

### "Access denied (using password: NO)" saat membuka database remote di client {#access-denied-using-password-no-when-opening-a-remote-database-in-a-client}

Simpan password koneksi di Rezure: sejak 3.3, **Open** menyerahkan password tersimpan ke
TablePlus, DBeaver, HeidiSQL, dan MariaDB console, termasuk lewat SSH tunnel. MySQL Workbench
memintanya sendiri. Lihat
[Database Remote](/id/guide/remote-databases#passwords-and-open-with).

## Email {#mail}

### Email tidak pernah sampai ke inbox Mailpit {#emails-never-reach-the-mailpit-inbox}

Cek berurutan: Mailpit berjalan; `.env` berisi `MAIL_HOST=127.0.0.1` (bukan `mailpit`) dan
`MAIL_PORT=1025` (bukan 2525); kamu sudah menjalankan `php artisan config:clear` kalau konfigurasi
di-cache; email di antrean butuh `php artisan queue:work` yang berjalan. Lihat
[Mailpit](/id/guide/mailpit).

## Berbagi {#sharing}

### Link berbagi tidak termuat, atau modal-nya macet {#the-share-link-doesn-t-load-or-the-modal-hangs}

Lihat [Berbagi Proyek](/id/guide/sharing#troubleshooting).

## Pembaruan {#updates}

### Aku tahu ada versi baru, tetapi Changelog tidak menampilkan pembaruan {#i-know-there-s-a-new-version-but-changelog-shows-no-update}

Pengecekan pembaruan yang gagal terlihat sama seperti "tidak ada pembaruan". Pastikan kamu online
lalu buka Changelog lagi. Kamu selalu bisa memasang versi terbaru dari
[halaman unduhan](/id/download) di atas versi yang sekarang.

## Masih buntu? {#still-stuck}

Kirim laporan dari halaman **Feedback** di aplikasi. Centang **Attach latest log** supaya pengelola
bisa melihat apa yang terjadi; log bisa berisi path folder, jadi baca dulu. Atau buka issue di
[GitHub](https://github.com/myahyazahid/rezure/issues).

## Terkait {#related}

- [FAQ](/id/guide/faq): pertanyaan umum
- [Log](/id/guide/logs): tempat pertama untuk dicek

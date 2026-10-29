---
title: 'FAQ Rezure: Local Dev Environment untuk Windows'
titleTemplate: false
description: 'Jawaban seputar Rezure: versi PHP, framework, dan database yang didukung, dev server Node.js, port, hak admin, privasi, dan kenapa hanya untuk Windows.'
---

# Pertanyaan yang sering diajukan

## Tentang Rezure {#about-rezure}

### Apa itu Rezure? {#what-is-rezure}

Rezure adalah pengelola local development environment untuk Windows. Rezure membundel web server
(Nginx), PHP, dan database (MariaDB atau MySQL, PostgreSQL, SQL Server LocalDB) dan menaruhnya di
balik tombol start/stop, bukan file konfigurasi dan konsol layanan. Jawaban lengkapnya ada di
[Apa itu Rezure?](/id/guide/).

### Apakah Rezure gratis? {#is-rezure-free}

Ya. Rezure gratis dan open source, dan source code-nya ada di
[GitHub](https://github.com/myahyazahid/rezure). Kalau kamu ingin mendukungnya, halaman **Donate**
di aplikasi mencantumkan caranya; tidak ada yang berbayar di dalam aplikasi.

### Apa yang membuat Rezure berbeda? {#what-makes-rezure-different}

Beberapa hal yang sengaja dilakukan Rezure:

- **Versi runtime ditemukan, bukan ditulis mati.** Versi yang terpasang ditemukan dengan memindai
  folder unduhan Rezure dan folder drop-in, dan daftar yang bisa dipasang diambil langsung dari
  php.net, MariaDB, dan nodejs.org, lengkap dengan checksum.
- **Setiap unduhan diverifikasi** dengan checksum yang dipublikasikan sebelum dipakai.
- **Konflik port dilaporkan sebelum layanan gagal.** Rezure mengecek port dulu, menyebut program
  yang memakainya, dan bisa menghentikannya untukmu.
- **Hanya yang kamu minta yang diunduh.** Nginx dan PHP 8.3 ada di dalam installer; database,
  Mailpit, Node.js, dan versi PHP tambahan diunduh sesuai kebutuhan.
- **Jejak yang kecil.** Webview native, bukan engine browser yang dibundel, membuat ukuran aplikasi
  dan pemakaian memori tetap wajar.

### Apakah Rezure berjalan di macOS atau Linux? {#does-rezure-work-on-macos-or-linux}

Tidak. Rezure hanya untuk Windows 10 (build 1809 atau lebih baru) dan Windows 11, 64-bit. Tidak ada
build macOS atau Linux.

### Apakah Rezure memakai Docker? {#does-rezure-use-docker}

Tidak. Rezure menjalankan binary native langsung di mesinmu; tidak ada mode Docker.

### Apakah aplikasinya tersedia dalam bahasa lain? {#is-the-app-available-in-other-languages}

Belum. Antarmuka Rezure berbahasa Inggris.

## Instalasi dan menjalankan {#installing-and-running}

### Bisakah Rezure dijalankan bersama stack server lokal lain? {#can-i-run-rezure-alongside-another-local-server-stack}

Tidak bersamaan, kalau keduanya butuh port yang sama. Nginx dan MariaDB mendengarkan di port 80 dan
port 3306, dan tidak ada yang lain yang bisa berbagi port itu selama layanan Rezure berjalan. Kamu
tidak perlu meng-uninstall apa pun: cukup hentikan stack lain sebelum menjalankan milik Rezure.
Kalau lupa, Rezure menyebut program yang memakai port dan menawarkan untuk menghentikannya. Lihat
[Konflik Port](/id/guide/port-conflicts).

PHP milik Rezure sengaja menghindari port 9000, jadi tidak bentrok dengan PHP yang dijalankan
Laragon dan XAMPP di sana.

### Kenapa Rezure butuh hak administrator? {#why-does-rezure-need-administrator-rights}

Hanya untuk dua hal: mengedit file `hosts` Windows supaya domain `.test` proyek bisa di-resolve
(saat kamu mengklik **Sync hosts file**), dan memasang ODBC Driver Microsoft atau SQL Server
LocalDB kalau kamu memilihnya. Menolak prompt `hosts` membiarkan bagian lain aplikasi tetap
berjalan; domainnya saja yang belum bisa di-resolve sampai entri ditambahkan.

### Haruskah Rezure dijalankan sebagai administrator? {#should-i-run-rezure-as-administrator}

Tidak. Tidak ada bagian Rezure yang membutuhkannya, dan PostgreSQL menolak berjalan di bawah Rezure
yang di-elevate. Buka secara normal; Windows meminta persetujuan sendiri saat file `hosts` perlu
diubah.

### Windows SmartScreen memperingatkan publisher yang tidak dikenal. Apakah itu masalah? {#windows-smartscreen-warns-about-an-unrecognized-publisher-is-that-a-problem}

Peringatan itu soal code signing, bukan laporan virus. Cocokkan hash SHA-256 installer dengan yang
ada di [halaman rilis](https://github.com/myahyazahid/rezure/releases)
([langkah verifikasinya](/id/download#verify-your-download) hanya butuh sekitar sepuluh detik), dan
kalau cocok, pilih **More info → Run anyway**.

### Apakah layanan berjalan saat Rezure dibuka? {#do-services-start-when-rezure-opens}

Tidak. Tidak ada yang berjalan sampai kamu menjalankannya: tidak saat Rezure dibuka, dan tidak juga
dengan **Start Rezure with Windows** aktif. **Start all** di halaman Services menyalakan semuanya
sekaligus. Lihat [Layanan](/id/guide/services).

### Apakah menutup jendela menghentikan layananku? {#does-closing-the-window-stop-my-services}

Secara default, ya: menutup jendela keluar dari Rezure dan menghentikan semuanya. Aktifkan **Keep
running in tray on close** di [Pengaturan](/id/guide/settings) supaya tetap berjalan di latar
belakang.

### Bagaimana cara memperbarui Rezure? {#how-do-i-update-rezure}

Dari dalam aplikasi. Sebuah titik muncul di **Changelog** saat ada pembaruan; buka lalu klik
**Update**. Pembaruan ditandatangani dan diverifikasi. Lihat
[Pembaruan & Changelog](/id/guide/updates).

### Bagaimana cara meng-uninstall Rezure sepenuhnya? {#how-do-i-uninstall-rezure-completely}

Jalankan uninstaller, lalu hapus `C:\rezure` dan beberapa hal yang dipasang Rezure di luar folder
itu. Lihat [Uninstall](/id/guide/uninstall).

## Proyek {#projects}

### Di mana proyekku disimpan? {#where-do-my-projects-live}

Apa pun di `C:\rezure\www` dilayani otomatis: folder bernama `myapp` menjadi `myapp.test`. Proyek
yang disimpan di tempat lain bisa ditautkan di tempatnya dari halaman **Projects**, tanpa ada yang
disalin atau dipindah. Pengaturan, database, dan runtime yang diunduh juga ada di bawah
`C:\rezure`, di luar folder instalasi, jadi instal ulang atau kembali ke versi lama tidak menyentuh
pekerjaanmu. Lihat [File & Folder](/id/guide/files-and-folders).

### Bisakah aku memindahkan `C:\rezure` ke drive lain? {#can-i-move-c-rezure-to-another-drive}

Rezure memakai folder apa pun yang disebut environment variable `REZURE_HOME`, jadi kamu bisa
mengarahkannya ke drive lain sebelum mulai memakainya. Memindahkan setup yang sudah ada tidak
otomatis: profil database dan proyek tertaut mencatat path lengkap. Cara paling sederhana adalah
mengekspor database-mu, mengatur `REZURE_HOME`, mulai dari awal, lalu mengimpornya lagi. Lihat
[File & Folder](/id/guide/files-and-folders).

### Bisakah aku memakai domain selain `.test`? {#can-i-use-a-domain-other-than-test}

Tidak sebagai akhiran otomatis: selalu `.test`, karena browser memaksa `.dev` ke HTTPS dan `.local`
dipakai mDNS. [Proyek tertaut](/id/guide/projects#add-an-existing-folder) bisa diberi domain valid
apa pun saat kamu menambahkannya.

### Apakah Rezure mendukung HTTPS di situs lokal? {#does-rezure-support-https-on-local-sites}

Belum. Situs dilayani lewat `http://` biasa di domain `.test`.

### Apakah Rezure mendukung Apache? {#does-rezure-support-apache}

Tidak. Web server Rezure adalah Nginx. Laravel, WordPress, dan kebanyakan aplikasi PHP berjalan di
sana tanpa perubahan; file `.htaccess` diabaikan (dan ditolak untuk pengunjung).

### Framework apa saja yang didukung Rezure? {#which-frameworks-does-rezure-support}

Laravel, CodeIgniter 3 dan 4, WordPress, Bedrock, Drupal, Joomla, Symfony, Yii 2, CakePHP, Slim,
dan Laminas di sisi PHP, serta Next.js, Nuxt, Astro, Vue, React, Svelte, Angular, dan Node biasa di
sisi JavaScript. Rezure mendeteksi framework dari file proyek dan melayaninya dari folder yang
benar, misalnya `public/` untuk Laravel, CodeIgniter 4, dan Symfony. Kalau deteksinya salah, klik
badge framework proyek untuk menggantinya. Framework yang tidak dikenal Rezure bisa ditambahkan di
`C:\rezure\etc\frameworks.json`. Lihat [Framework](/id/guide/frameworks).

### Kenapa situs CodeIgniter 4 atau Symfony-ku menampilkan 404? {#why-does-my-codeigniter-4-or-symfony-site-show-404}

Di Rezure 3.3 ke atas seharusnya tidak: keduanya dideteksi dan dilayani dari `public/`. Kalau
proyek masih menjawab 404, kemungkinan dilayani dari folder yang salah. Arahkan kursor ke badge
framework-nya untuk melihat dari mana dilayani, lalu klik badge untuk memilih framework yang benar.
Kalau dulu kamu menautkan folder `public/` proyek secara langsung sebagai akalan, hapus tautan itu
dan tambahkan folder proyeknya. Lihat [Framework](/id/guide/frameworks#troubleshooting).

### Bisakah aku membuka aplikasi Vite, Next.js, atau Nuxt di domain `.test`? {#can-i-open-a-vite-next-js-or-nuxt-app-on-a-test-domain}

Bisa, sejak Rezure 3.3. Proyek JavaScript dan Node dilayani oleh dev server-nya sendiri: klik
**Open** dan Rezure menjalankan `npm run dev` di port sendiri, menunggu sampai menjawab, lalu
membuka `http://myapp.test`. Nginx meneruskan domain ke port itu, dengan hot reload tetap jalan.
Rezure juga mengurus pengecekan allowed-hosts milik Vite dan pengecekan dev-origin milik Next.js
16. Setiap dev server berhenti saat Rezure ditutup. Lihat [Dev Server](/id/guide/dev-servers).

### Bisakah pengunjung mengunduh file `.env` proyekku? {#can-visitors-download-my-project-s-env-file}

Tidak. Situs PHP menjawab **404** untuk setiap dotfile (`.env`, `.git`, `.htaccess`, dan
seterusnya) kecuali `.well-known`. Ini menutup celah di versi sebelum 3.3, saat proyek yang
dilayani dari foldernya sendiri, seperti WordPress atau PHP biasa, bisa membocorkan `.env`-nya.
Proyek JavaScript tidak pernah melayani foldernya secara langsung: request diteruskan ke dev
server. Lihat [Framework](/id/guide/frameworks#how-nginx-serves-each-kind).

### Bisakah aku menyajikan situs ke internet dengan Rezure? {#can-i-serve-a-site-to-the-internet-with-rezure}

Untuk **preview sementara**, bisa: pakai **Share** di halaman **Projects**. Rezure membuka
Cloudflare Quick Tunnel dan memberimu link `https://…trycloudflare.com` yang bisa dibuka siapa saja
selama berbagi aktif. Tidak perlu akun Cloudflare atau pengaturan router. Lihat
[Berbagi Proyek](/id/guide/sharing) untuk panduan lengkapnya.

Itu **bukan** hosting produksi. URL-nya berubah setiap kali kamu berbagi, tunnel berhenti saat kamu
berhenti berbagi atau keluar dari Rezure, dan fitur ini dimaksudkan untuk demo dan cek cepat,
bukan situs publik permanen. Untuk itu, deploy ke hosting sungguhan.

### Apakah Rezure bekerja dengan Claude Code dan AI coding agent lain? {#does-rezure-work-with-claude-code-and-other-ai-coding-agents}

Ya. Rezure menyimpan `AGENTS.md` di `C:\rezure` yang menjelaskan PHP, database, dan proyekmu, dan
Claude Code memuatnya otomatis di proyek di bawah `www`. Lihat
[AI Coding Agent](/id/guide/ai-agents).

## PHP dan runtime {#php-and-runtimes}

### Versi PHP apa saja yang bisa kupakai? {#which-php-versions-can-i-use}

PHP 8.3 ada di dalam installer. Dari halaman **Switch** kamu bisa memasang apa pun yang sedang
dipublikasikan php.net untuk Windows (rilis terbaru dari setiap branch, build non-thread-safe x64)
atau menaruh build yang sudah kamu unduh ke `C:\rezure\custom\php` dan Rezure akan menemukannya di
pemindaian berikutnya. Mengganti default global hanya me-restart layanan **PHP** utama; Nginx tetap
berjalan. Lihat [Versi PHP](/id/guide/php-versions).

### Bisakah proyek berbeda memakai versi PHP berbeda secara bersamaan? {#can-different-projects-use-different-php-versions-at-the-same-time}

Bisa. Di halaman **Projects**, kunci setiap proyek ke **Default** atau ke versi tertentu yang
terpasang. Versi yang dikunci selain default global mendapat layanan **PHP x.y.z** sendiri di
halaman **Services**. Layanan itu tidak dijalankan otomatis: jalankan setiap layanan PHP yang
dibutuhkan proyekmu, atau pakai **Start all**. Lihat
[PHP per Proyek](/id/guide/project-php-version).

### Bagaimana cara mengubah pengaturan `php.ini`? {#how-do-i-change-a-php-ini-setting}

Taruh di file `.ini` di `C:\rezure\etc\php\conf.d`: Rezure menulis ulang `php.ini` miliknya setiap
kali start, jadi editan di sana tidak bertahan. Ekstensi berupa toggle di halaman
[Ekstensi PHP](/id/guide/php-extensions). Lihat [Konfigurasi PHP](/id/guide/php-configuration).

### Apakah Xdebug didukung? {#is-xdebug-supported}

Belum. Sudah ada di roadmap.

### Apakah Rezure menyertakan Composer? {#does-rezure-include-composer}

Ya: pasang versinya dari halaman Switch. Rezure memakai Composer sendiri untuk proyek Laravel
baru, tetapi tidak menaruh perintah `composer` di `PATH`. Lihat
[Terminal Proyek](/id/guide/project-terminal#running-composer).

### Apakah Rezure mendukung Node.js? {#does-rezure-support-node-js}

Ya. Pasang versinya dari halaman Switch dan kunci satu per proyek; kunci berlaku untuk terminal
proyek dan dev server-nya. Aplikasi Vite, Next.js, Nuxt, Astro, Angular, dan Node terbuka di domain
`.test`-nya lewat dev server yang dijalankan Rezure untukmu. Lihat [Node.js](/id/guide/nodejs) dan
[Dev Server](/id/guide/dev-servers).

### Bagaimana dengan Python, Ruby, atau Go? {#what-about-python-ruby-or-go}

Tidak tersedia. Python tercantum di halaman Switch sebagai "not available yet".

## Database {#databases}

### Apakah MariaDB disertakan di installer? {#is-mariadb-included-in-the-installer}

Tidak, dan itu disengaja. MariaDB diunduh saat pertama kali kamu menjalankannya: menunggu sekali
saja sekitar satu atau dua menit, dan hanya kalau kamu memang butuh database.

### Bisakah aku tetap memakai database Laragon atau XAMPP-ku? {#can-i-keep-using-my-laragon-or-xampp-databases}

Bisa. **Add data directory** di halaman Databases menemukan data MySQL milik Laragon dan XAMPP di
lokasi default-nya dan melayaninya dengan binary server milik tool itu sendiri; tidak ada yang
disalin atau dikonversi. Hanya satu dari kedua tool yang bisa menjalankannya pada satu waktu. Lihat
[MariaDB & MySQL](/id/guide/mariadb-mysql#use-a-laragon-or-xampp-data-directory), dan
[Pindah dari Laragon atau XAMPP](/id/guide/switch-from-laragon-xampp) untuk memindahkan proyekmu
juga.

### Apakah Rezure mendukung PostgreSQL? {#does-rezure-support-postgresql}

Ya: versi 16, 17, dan 18, dipasang dari dalam aplikasi dan berjalan di samping MariaDB. Lihat
[PostgreSQL](/id/guide/postgresql).

### Apakah Rezure mendukung SQL Server? {#does-rezure-support-sql-server}

Ya. Rezure memasang driver PHP `pdo_sqlsrv` dan `sqlsrv` dari Microsoft, ODBC Driver, dan SQL Server
2022 Express LocalDB, serta menyambung ke instance SQL Server lain. Lihat
[SQL Server](/id/guide/sql-server).

### Apakah Rezure menyertakan Redis? {#does-rezure-include-redis}

Ekstensi PHP `redis`, ya: pasang dari PHP Extensions. Server Redis belum menjadi bagian dari Rezure.

### Bisakah Rezure menyambung ke database remote? {#can-rezure-connect-to-a-remote-database}

Bisa. Dari halaman **Databases** kamu bisa menambahkan koneksi tersimpan ke server MySQL, MariaDB,
PostgreSQL, atau SQL Server (staging, VPS, shared hosting, server kantor) dan mengganti halaman ke
target itu untuk menampilkan, mengekspor, dan mengimpor database. Koneksi **read-only secara
default** supaya kamu tidak sengaja menulis ke produksi.

Kalau database tidak bisa dijangkau langsung (hanya mendengarkan di `127.0.0.1` pada server, atau
port-nya diblokir firewall), aktifkan **Connect through an SSH tunnel** saat menambahkan koneksi.
Rezure memakai client OpenSSH bawaan Windows; tidak perlu software SSH tambahan. Lihat
[Database Remote](/id/guide/remote-databases) untuk setup per field dan contohnya.

### Bisakah aku membuka database remote lewat SSH di TablePlus, DBeaver, atau HeidiSQL? {#can-i-open-a-remote-database-over-ssh-in-tableplus-dbeaver-or-heidisql}

Bisa. **Open** pada koneksi remote memberi client alamat lokal tunnel, jadi client tidak pernah
berurusan dengan SSH. Saat koneksi punya password tersimpan, TablePlus, DBeaver, HeidiSQL, dan
MariaDB console juga mendapatkannya dan langsung tersambung. MySQL Workbench meminta password di
dialognya sendiri. Lihat
[Database Remote](/id/guide/remote-databases#open-in-an-external-client).

### Di mana password database disimpan? {#where-are-database-passwords-stored}

Di Windows Credential Manager, di bawah **Rezure Database Connections**, atau hanya di memori
selama sesi, kalau kamu memilihnya. Tidak pernah di file milik Rezure.

## Privasi {#privacy}

### Apakah Rezure mengumpulkan data? {#does-rezure-collect-data}

Ya, sedikit data pemakaian: ID instalasi acak, layanan mana yang dijalankan dan dihentikan beserta
versinya, jenis (bukan teks) error, dan heartbeat berkala yang menyertakan versi Windows dan nama
akunmu. Rezure tidak pernah mengirim path, nama proyek atau database, atau apa pun yang kamu ketik.
Daftar lengkapnya, dan cara mematikannya, ada di [Privasi & Data Penggunaan](/id/guide/privacy).

### Apakah Rezure mengirim kode atau database-ku ke mana pun? {#does-rezure-send-my-code-or-my-databases-anywhere}

Tidak. Proyek dan datamu tetap di mesinmu. Satu-satunya yang keluar adalah data pemakaian di atas,
tiket Feedback yang kamu pilih untuk dikirim, dan apa yang sengaja kamu
[bagikan](/id/guide/sharing) atau [sambungkan](/id/guide/remote-databases).

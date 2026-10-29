---
title: 'Apa itu Rezure? Local Development Server Terbaik'
titleTemplate: false
description: 'Rezure adalah local dev environment untuk Windows: Nginx, PHP, MySQL, PostgreSQL, SQL Server, Node.js, dan Mailpit di balik tombol sekali klik.'
---

# Apa itu Rezure?

Rezure adalah pengelola local development environment untuk Windows. Rezure membundel
komponen yang dibutuhkan proyek PHP (web server, PHP, dan database) dan menaruhnya di balik
tombol start/stop, bukan file konfigurasi dan konsol layanan.

Rezure dibangun di atas Tauri dan Rust, dan memegang beberapa prinsip sendiri: versi runtime
ditemukan secara otomatis, bukan ditulis mati di kode, setiap unduhan dicek dengan checksum
yang dipublikasikan, konflik port dilaporkan sebelum layanan gagal berjalan, dan komponen yang
tidak kamu minta tidak pernah diunduh.

## Yang kamu dapatkan {#what-you-get}

- **Layanan**: Nginx, PHP, MariaDB atau MySQL, PostgreSQL, SQL Server LocalDB, dan Mailpit,
  masing-masing dengan status, log langsung, dan Start/Stop/Restart. **Start all** menyalakan
  seluruh stack sekaligus, dan **Manage services** menyembunyikan yang tidak pernah kamu pakai.
  Lihat [Layanan](/id/guide/services).
- **Proyek**: folder di `C:\rezure\www` menjadi `nama-folder.test`, lengkap dengan virtual host.
  Folder yang ada di tempat lain bisa ditautkan tanpa dipindah. Proyek baru bisa dimulai dari
  template Laravel, WordPress, PHP, atau HTML. Lihat [Proyek](/id/guide/projects) dan
  [Proyek Baru](/id/guide/new-project).
- **Framework**: Laravel, CodeIgniter, Symfony, WordPress, Drupal, dan 15 lainnya dikenali dari
  file-filenya dan dilayani dari folder yang benar, misalnya `public/`. Satu klik membetulkan
  tebakan yang salah, dan kamu bisa menambahkan framework sendiri. Lihat
  [Framework](/id/guide/frameworks).
- **Dev server**: aplikasi Vite, Next.js, Nuxt, Astro, Angular, dan Node juga terbuka di domain
  `.test`-nya. Rezure menjalankan dev server saat **Open**, menjaga hot reload tetap jalan, dan
  menghentikannya saat aplikasi ditutup. Lihat [Dev Server](/id/guide/dev-servers).
- **PHP**: pasang versi dari php.net di dalam aplikasi atau taruh build milikmu sendiri, ganti
  default global, dan **kunci** proyek mana pun ke versinya sendiri sehingga beberapa versi
  berjalan bersamaan. Ekstensi cukup di-toggle, tanpa mengedit `.ini`. Lihat
  [Versi PHP](/id/guide/php-versions), [PHP per Proyek](/id/guide/project-php-version), dan
  [Ekstensi PHP](/id/guide/php-extensions).
- **Database**: buat, ekspor, dan impor di MariaDB lokal, pakai direktori data Laragon atau
  XAMPP yang sudah ada, jalankan [PostgreSQL](/id/guide/postgresql) dan
  [SQL Server LocalDB](/id/guide/sql-server) di sampingnya, dan sambungkan ke
  [server remote](/id/guide/remote-databases), termasuk lewat SSH tunnel.
- **Node.js dan Composer**: pasang versi dari feed rilis resminya, kunci Node per proyek, dan
  buka [terminal proyek](/id/guide/project-terminal) dengan PHP dan Node yang tepat sudah ada di
  urutan pertama `PATH`. Lihat [Node.js](/id/guide/nodejs).
- **Email**: [Mailpit](/id/guide/mailpit) menangkap setiap email yang dikirim aplikasimu dan
  menampilkannya di inbox lokal.
- **Pengecekan**: [Cek Kebutuhan](/id/guide/requirements-check) per proyek menemukan ekstensi
  PHP yang hilang, HTTPS dari PHP yang rusak, serta pengaturan email atau database yang tidak
  bisa tersambung, dengan tombol perbaikan kalau tersedia.
- **Berbagi**: buka akses proyek ke internet untuk sementara dengan satu klik, lewat Cloudflare
  Quick Tunnel, tanpa akun atau pengaturan router. Lihat [Berbagi Proyek](/id/guide/sharing).
- **AI coding agent**: Rezure menyimpan `AGENTS.md` yang menjelaskan setup mesinmu, sehingga
  tool seperti Claude Code tahu bagaimana stack-mu berjalan. Lihat
  [AI Coding Agent](/id/guide/ai-agents).
- **Sentuhan pribadi**: 14 tema, efek kaca dan kecerahan yang bisa diatur, dan stiker yang bisa
  ditempel di mana saja pada jendela. Lihat [Tampilan & Stiker](/id/guide/appearance).

## Yang bukan Rezure {#what-it-isn-t}

Rezure menjalankan binary native di mesinmu, bukan container: tidak ada mode Docker. Rezure
hanya untuk Windows, dan dibuat untuk pengembangan lokal, bukan sebagai hosting web produksi.
Situs dilayani lewat HTTP biasa di domain `.test`; belum ada HTTPS lokal. Fitur Share untuk
demo dan preview singkat, bukan deployment publik permanen.

## Langkah selanjutnya {#next-steps}

- [Instalasi](/id/guide/installation): unduh, pasang, dan pastikan aplikasi berjalan normal
- [Pertama Kali Dijalankan](/id/guide/first-run): jalankan layanan dan sajikan proyek pertama
- [Pindah dari Laragon atau XAMPP](/id/guide/switch-from-laragon-xampp): tetap pakai proyek dan
  database lamamu, plus apa saja yang berbeda
- [Layanan](/id/guide/services): semua yang bisa dilakukan halaman Services
- [Contekan .env Laravel](/id/guide/laravel-env): nilai koneksi untuk setiap database dan
  Mailpit, di satu tempat
- [Pemecahan Masalah](/id/guide/troubleshooting) dan [FAQ](/id/guide/faq): saat ada yang tidak
  berjalan semestinya

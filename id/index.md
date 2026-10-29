---
# Versi Indonesia dari index.md, dirender oleh .vitepress/theme/Landing.vue.
# Strukturnya harus sama dengan index.md; hanya teks dan link yang berbeda.
layout: Landing

title: Rezure | Local Development Server Terbaik
titleTemplate: false
description: 'Rezure adalah local development server terbaik untuk Windows: Nginx, PHP, MySQL, PostgreSQL, SQL Server, Node.js, dan Mailpit dalam satu klik. Gratis dan open source.'

hero:
  eyebrow: Gratis · Open source · Untuk Windows
  headline: Local development server terbaik
  tagline: Nginx, PHP, MySQL, PostgreSQL, SQL Server, Node.js, dan Mailpit, terpasang, berjalan, dan terhubung ke domain .test untuk setiap proyek. Tanpa file konfigurasi, tanpa Docker.
  actions:
    - text: Unduh
      link: /id/download
      theme: brand
    - text: Mulai
      link: /id/guide/
      theme: alt
    - text: Lihat di GitHub
      link: https://github.com/myahyazahid/rezure
      theme: ghost

featuresTitle: Semua yang developer butuhkan, dalam satu jendela

features:
  - title: Pengelola layanan sekali klik
    link: /id/guide/services
    icon: power
    details: Jalankan, hentikan, dan restart Nginx, PHP, database, dan Mailpit dari satu layar, satu per satu atau sekaligus, dengan log untuk setiap layanan dan restart PHP otomatis setelah crash.
  - title: Konflik port terdeteksi lebih awal
    link: /id/guide/port-conflicts
    icon: docker
    details: Rezure mengecek setiap port sebelum layanan dijalankan, menyebut apa yang sedang memakainya (Laragon, XAMPP, Docker, IIS), dan bisa menghentikannya untukmu dengan satu klik.
  - title: Virtual host yang mengenali framework-mu
    link: /id/guide/frameworks
    icon: nginx
    details: Setiap folder di direktori www menjadi situs .test sendiri, dan folder di tempat lain bisa ditautkan tanpa dipindah. Laravel, CodeIgniter, Symfony, WordPress, dan Drupal dikenali dan dilayani dari folder yang benar, dengan file hosts Windows yang selalu tersinkron.
  - title: PHP per proyek
    link: /id/guide/project-php-version
    icon: php
    details: Pasang versi PHP mana pun langsung dari php.net, aktifkan ekstensinya tanpa mengedit .ini, dan kunci tiap proyek ke versinya sendiri. Beberapa versi bisa melayani bersamaan.
  - title: MariaDB dan MySQL
    link: /id/guide/mariadb-mysql
    icon: mariadb
    details: Buat, ekspor, dan impor database, buka di SQL client yang sudah kamu pakai, dan arahkan Rezure ke direktori data Laragon atau XAMPP yang sudah ada tanpa menyalin satu byte pun.
  - title: PostgreSQL dan SQL Server
    link: /id/guide/postgresql
    icon: postgresql
    details: PostgreSQL 16, 17, dan 18 serta SQL Server LocalDB berjalan berdampingan dengan MariaDB, dengan driver PHP untuk keduanya dipasang dari dalam aplikasi.
  - title: Vite, Next.js, dan Node di .test
    link: /id/guide/dev-servers
    icon: nodedotjs
    details: Buka aplikasi Vite, Next.js, Nuxt, dan Astro di domain .test masing-masing. Rezure menjalankan dev server, menjaga hot reload tetap jalan, dan memakai versi Node.js yang dikunci untuk proyek itu. Composer dan terminal proyek juga tersedia.
  - title: Bagikan dan uji tanpa deploy
    link: /id/guide/sharing
    icon: share
    details: Kirim proyek ke siapa saja lewat link Cloudflare sementara, dan tangkap setiap email yang dikirim aplikasimu di inbox Mailpit lokal, bukan di kotak masuk orang sungguhan.
  - title: Portabel dan ringan
    link: /id/guide/installation
    icon: tauri
    details: Setiap unduhan dicek dengan checksum yang dipublikasikan, semuanya ada di satu folder, dan webview native dari Tauri membuat aplikasi tetap kecil dan hemat memori.

whyTitle: Kenapa Rezure
whyLede: Satu aplikasi seharusnya cukup untuk membangun apa saja secara lokal di Windows, dari API Laravel sampai situs WordPress atau front end Next.js, tanpa repot dengan XAMPP, instalasi Node, dan tiga server database. Rezure dibangun di atas Tauri dan Rust, dan bisa membaca database Laragon atau XAMPP yang sudah ada kalau kamu pindah dari salah satunya.

reasons:
  - title: Tidak perlu mengunduh apa pun sebelum mulai
    details: Nginx dan PHP 8.3 sudah ada di dalam installer, jadi situs langsung bisa dilayani begitu setup selesai. Versi PHP tambahan, database, Node.js, dan Mailpit diunduh sesuai kebutuhan, hanya kalau kamu memintanya.
  - title: Versi runtime yang benar-benar terlihat
    details: Daftar yang bisa dipasang diambil langsung dari php.net, MariaDB, dan nodejs.org, lengkap dengan checksum, dan build yang kamu taruh sendiri di folder juga ikut terdeteksi.
  - title: Jejak yang kecil
    details: Webview native, bukan engine browser yang dibundel, membuat ukuran aplikasi dan pemakaian memori tetap wajar.

cta:
  title: Seluruh stack dev-mu, satu unduhan
  text: Rezure gratis, open source, dan terus dikembangkan. Laporan bug dan pull request sangat diterima di GitHub.
  action:
    text: Unduh untuk Windows
    link: /id/download
  note: Windows 10 (1809+) atau Windows 11, 64-bit · Gratis dan open source
---

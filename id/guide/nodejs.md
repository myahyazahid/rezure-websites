---
title: Memasang dan Mengganti Versi Node.js di Windows
description: 'Pasang versi Node.js di dalam Rezure, kunci satu per proyek, dan jalankan dev server Vite, Next.js, atau Nuxt di domain .test pada Windows, lengkap dengan npm.'
---

# Node.js

Rezure memasang dan mengganti versi Node.js dengan cara yang sama seperti PHP: build resmi,
diverifikasi checksum-nya, beberapa versi berdampingan. Setiap build membawa `npm` dan `npx`
sendiri.

Node di Rezure menjalankan dua hal: [terminal proyek](/id/guide/project-terminal) (`npm install`,
build tool) dan [dev server](/id/guide/dev-servers), yang melayani aplikasi Vite, Next.js, Nuxt,
Astro, dan Node di domain `.test`-nya. Lihat [Proyek JavaScript](#javascript-projects) di bawah.

## Memasang versi {#install-a-version}

1. Di halaman **Switch**, klik **Install version** lalu pilih **Node.js**.
2. Rezure membaca indeks rilis nodejs.org dan menampilkan **patch terbaru dari setiap jalur LTS**
   (badge **LTS** plus codename-nya) dan rilis **Current** terbaru (badge **Latest**), masing-masing
   dengan versi `npm` yang dibawanya.
3. Klik **Install**. Unduhannya dicocokkan dengan SHA-256 yang dipublikasikan untuk rilis itu dan
   diekstrak ke `C:\rezure\bin\node\<version>`.

Build Node yang kamu unduh sendiri (`.zip` untuk Windows) juga bisa diekstrak ke
`C:\rezure\custom\node`; Rezure menemukannya di pemindaian berikutnya, tanpa verifikasi checksum.

## Versi global {#the-global-version}

Pilih versi di baris **Node.js** pada halaman Switch; barisnya menampilkan "active X · npm Y".
Pilihannya diingat setelah restart.

Versi global adalah yang didapat [terminal proyek](/id/guide/project-terminal), kecuali proyek
mengunci versinya sendiri. Memilih versi tidak me-restart apa pun; buka terminal proyek baru untuk
memakainya.

Tidak ada opsi "Node di mana saja" seperti PHP: Rezure tidak menyentuh `PATH` sistemmu untuk Node.
Terminal yang tidak dibuka Rezure tetap memakai Node apa pun yang kamu pasang sendiri, kalau ada.

## Mengunci Node per proyek {#pin-node-per-project}

1. Di halaman **Projects**, klik ikon **Node.js version** proyek ("Pin this project to its own
   Node.js version").
2. Pilih **Default · follows the global active version**, atau salah satu versi yang terpasang
   ("Node.js 22.x · npm 10.x").
3. Buka terminal dari baris proyek. `node -v` di sana menampilkan versi yang dikunci.

Selama sebuah versi dikunci, ikonnya terisi dan tooltip-nya bertuliskan "Pinned to Node.js X: click
to change".

Kunci menentukan `node`, `npm`, dan `npx` mana yang ada di urutan pertama `PATH` pada terminal
**berikutnya** yang dibuka dari baris proyek itu, dan Node.js mana yang dipakai
[dev server](/id/guide/dev-servers) proyek saat dijalankan berikutnya. Kunci tidak me-restart apa
pun, dan terminal yang sudah terbuka tetap memakai versi saat dibuka.

Rezure tidak membaca `.nvmrc`, `.node-version`, atau field `engines` di `package.json`; kunci di
Rezure yang berlaku.

Tanpa Node yang terpasang, dialog bertuliskan "No Node.js versions installed yet: install one from
the Switch page first."

## Proyek JavaScript {#javascript-projects}

Folder dengan `package.json` tercantum di halaman Projects sebagai **Vue**, **React**, **Svelte**,
**Angular**, **Astro**, **Next.js**, **Nuxt**, atau **Node**. Sejak Rezure 3.3 proyek-proyek ini
dilayani oleh **dev server**-nya sendiri: klik **Open** dan Rezure menjalankan `npm run dev` (atau
script milik proyek) di port sendiri, menunggu sampai menjawab, lalu membuka `http://<nama>.test`.
Nginx meneruskan domain ke port itu, termasuk hot reload. Lihat [Dev Server](/id/guide/dev-servers)
untuk port, script, dan pemecahan masalah.

Dependency lebih dulu. Kalau `node_modules` tidak ada, dialog **Dev servers** menawarkan tombol
**npm install** (atau pnpm, yarn, atau bun, sesuai lockfile proyek). Kamu juga bisa menjalankannya
dari terminal proyek:

```bat
npm install
```

Untuk melayani folder `dist\` hasil **build** sebagai file biasa, klik badge framework proyek dan
pilih **Custom folder…**. Lihat [Framework](/id/guide/frameworks#change-a-project-s-framework).

### Laravel dengan Vite {#laravel-with-vite}

Proyek Laravel dilayani Nginx dan PHP seperti biasa, jadi bukan proyek dev server. Jalankan
`npm run dev` di terminal proyeknya untuk menjalankan Vite di sampingnya demi hot reload. Plugin
Vite milik Laravel menulis alamat dev server ke halaman, jadi situs di `http://myapp.test` langsung
menangkap perubahan CSS dan JS-mu. Hal yang sama berlaku untuk CodeIgniter, Symfony, dan proyek PHP
lain yang memakai npm untuk aset: Rezure mendeteksinya sebagai framework PHP-nya.

## Menghapus versi {#remove-a-version}

Tidak ada tombol uninstall. Keluar dari Rezure dan hapus foldernya di bawah `C:\rezure\bin\node\`
(atau `C:\rezure\custom\node\`). Proyek yang dikunci ke versi itu kembali ke versi global.

## Terkait {#related}

- [Dev Server](/id/guide/dev-servers): Vite, Next.js, Astro, dan Nuxt di domain `.test`
- [Terminal Proyek](/id/guide/project-terminal): tempat versi Node berlaku
- [Versi PHP](/id/guide/php-versions): halaman Switch secara umum
- [Framework](/id/guide/frameworks): cara proyek JavaScript dideteksi

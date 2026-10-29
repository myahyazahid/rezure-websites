---
title: Terminal Proyek untuk artisan, Composer, dan npm
description: Buka terminal di proyek Rezure mana pun dengan versi PHP dan Node.js milik proyek itu di urutan pertama PATH, dan cara menjalankan artisan, Composer, dan npm di sana.
---

# Terminal Proyek

Ikon **Terminal** di baris proyek ("Open a terminal in this folder") membuka shell di folder
proyek, diatur sehingga `php`, `node`, `npm`, dan `npx` adalah versi yang dipakai **proyek itu**,
bukan apa pun yang kebetulan ada di urutan pertama `PATH` sistemmu.

Itulah yang mencegah `php artisan migrate` berjalan di PHP 8.1 padahal situsnya sendiri dilayani
PHP 8.4.

## Apa yang diatur {#what-s-set-up}

Untuk terminal yang dibuka, dan hanya untuk terminal itu, Rezure:

- **Menaruh PHP milik proyek di urutan pertama `PATH`**: versi yang
  [dikunci](/id/guide/project-php-version) proyek, atau versi aktif global kalau tidak dikunci
  (atau kalau versi yang dikunci sudah dihapus).
- **Menaruh Node.js milik proyek berikutnya**:
  [Node yang dikunci](/id/guide/nodejs#pin-node-per-project), atau Node aktif global.
- **Menambahkan `C:\rezure\etc\php\conf.d` ke `PHP_INI_SCAN_DIR`**, supaya pengaturan PHP milikmu
  dimuat di terminal sama seperti untuk situs. Lihat [Konfigurasi PHP](/id/guide/php-configuration).

Tidak ada yang diubah di tingkat sistem. Terminal lain, terminal bawaan editor-mu, dan Windows
sendiri tidak terpengaruh.

Terminalnya adalah jendela **Command Prompt** (`cmd`) biasa, bukan Windows Terminal. Windows
Terminal memakai ulang jendela yang sudah ada dan mengabaikan environment variable per peluncuran,
yang diam-diam akan membuang versi di atas. Rezure hanya memakai Windows Terminal saat tidak ada
yang perlu diatur: tidak ada PHP dan tidak ada Node yang terpasang.

Environment-nya ditetapkan saat terminal dibuka. Kalau kamu mengubah kunci versi proyek, tutup
terminalnya dan buka yang baru dari baris proyek.

## Cek apa yang kamu dapat {#check-what-you-got}

```bat
where php
php -v
node -v
```

`where php` menampilkan PHP yang ditaruh Rezure di urutan pertama, paling atas.

## Menjalankan Composer {#running-composer}

Rezure tidak menaruh perintah `composer` di `PATH`. Ada dua cara menjalankannya:

- **Composer global yang kamu pasang sendiri** (installer Composer-Setup, Scoop, dan sebagainya).
  Composer berjalan dengan `php` mana pun yang ada di urutan pertama `PATH`: di terminal proyek,
  versi milik proyek.
- **Composer milik Rezure**, lewat PHP:

  ```bat
  php C:\rezure\bin\composer\2.8.12\composer.phar install
  ```

  Ganti `2.8.12` dengan versi di folder `C:\rezure\bin\composer` milikmu. Sebuah `composer.bat`
  satu baris di suatu tempat di `PATH` membuatnya lebih singkat:

  ```bat
  @php C:\rezure\bin\composer\2.8.12\composer.phar %*
  ```

Versi Composer dipasang dari halaman [Switch](/id/guide/php-versions#composer).

## Perintah yang umum {#typical-commands}

```bat
php artisan migrate
php artisan queue:work
npm install
npm run dev
```

Dev server yang dijalankan dengan `npm run dev` berjalan di terminal ini, bukan di bawah Rezure.
Tutup jendelanya (atau tekan **Ctrl + C**) untuk menghentikannya.

Untuk proyek Vite, Next.js, Nuxt, Astro, atau Node biasanya kamu tidak perlu melakukannya:
**Open** di baris proyek menjalankan dev server di bawah Rezure pada port yang dituju domain
`.test`-nya. Lihat [Dev Server](/id/guide/dev-servers). Kalau kamu sudah menjalankan satu di sini,
dialog Dev servers akan menyadarinya dan menawarkan **Stop it and start here**.

## Di terminal lain {#in-other-terminals}

Di luar terminal proyek, `php` adalah apa pun yang disediakan `PATH` sistemmu. Untuk menjadikan
PHP aktif Rezure sebagai default di mana saja, aktifkan
[Use Rezure's PHP everywhere](/id/guide/php-configuration#use-rezure-s-php-everywhere). Itu selalu
menunjuk ke versi **global**; kunci versi proyek hanya berlaku di terminal proyek dan situsnya
sendiri. Node.js tidak punya opsi tingkat sistem; ia hanya ada di `PATH` pada terminal proyek.

## Terkait {#related}

- [PHP per Proyek](/id/guide/project-php-version): mengunci PHP
- [Node.js](/id/guide/nodejs): memasang dan mengunci Node
- [AI Coding Agent](/id/guide/ai-agents): cara Rezure memberi tahu coding tool tentang setup ini

---
title: Melayani Laravel, CodeIgniter 4, dan Symfony dari public/
description: 'Rezure mendeteksi Laravel, CodeIgniter 4, Symfony, WordPress, Drupal, Next.js, dan lainnya, lalu melayani masing-masing dari folder yang benar. Ubah atau tambahkan milikmu sendiri.'
---

# Framework

Rezure menentukan framework yang dipakai setiap proyek dengan membaca file-filenya, dan framework
menentukan cara Nginx melayaninya:

- **Framework PHP** menentukan **folder mana** yang dilayani. Laravel, CodeIgniter 4, dan Symfony
  menaruh front controller-nya di `public/index.php`, jadi dilayani dari `public/`. Kalau
  dilayani dari folder proyek, setiap URL menjawab 404, padahal kodenya baik-baik saja.
- **Framework JavaScript atau Node** (Vue, React, Svelte, Angular, Astro, Next.js, Nuxt, Node)
  dilayani oleh **dev server**-nya sendiri, yang bisa dijalankan Rezure untukmu. Lihat
  [Dev Server](/id/guide/dev-servers).

Deteksinya otomatis, dan kamu selalu bisa menimpanya. Tidak ada yang dieksekusi untuk
mengetahuinya; Rezure hanya membaca file.

## Framework yang didukung {#supported-frameworks}

| Framework | Dikenali dari | Dilayani dari |
| --- | --- | --- |
| **Laravel** | `artisan`, atau `laravel/framework` di `composer.json` | `public/` |
| **CodeIgniter 4** | `spark`, atau `codeigniter4/framework` | `public/` |
| **CodeIgniter 3** | `system/core/CodeIgniter.php`, atau `codeigniter/framework` | folder proyek |
| **WordPress** | `wp-config.php` atau `wp-load.php` | folder proyek |
| **Bedrock** (Roots) | `roots/wordpress` dan folder `web/app/` | `web/` |
| **Drupal** | `drupal/core`, `drupal/core-recommended`, atau `core/lib/Drupal.php` | `web/` |
| **Joomla** | folder `administrator/` dan `includes/defines.php` | folder proyek |
| **Symfony** | `symfony/framework-bundle` | `public/` |
| **Yii 2** | `yiisoft/yii2` | `web/` |
| **CakePHP** | `cakephp/cakephp` | `webroot/` |
| **Slim** | `slim/slim` | `public/` |
| **Laminas / Mezzio** | `laminas/laminas-mvc` atau `mezzio/mezzio` | `public/` |
| **Next.js**, **Nuxt**, **Astro** | `next`, `nuxt`, `astro` di `package.json` | [dev server](/id/guide/dev-servers) |
| **Vue**, **React**, **Svelte**, **Angular** | `vue`, `react`, `svelte` atau `@sveltejs/kit`, `@angular/core` | [dev server](/id/guide/dev-servers) |
| **PHP (public/)** | `public/index.php` dan tanpa `index.php` sendiri | `public/` |
| **PHP** | `composer.json` atau `index.php` | folder proyek |
| **Node** | `package.json` lainnya | [dev server](/id/guide/dev-servers) |
| **Static** | `index.html` | folder proyek |

Sebuah package dihitung kalau ada di `require` atau `require-dev` (Composer) atau di
`dependencies` atau `devDependencies` (npm). Proyek yang tidak cocok dengan apa pun menjadi
**Unknown** dan dilayani dari foldernya sendiri.

Kalau folder sebuah framework tidak ada di proyek tertentu, misalnya aplikasi Symfony tanpa
`public/`, proyeknya dilayani dari foldernya sendiri.

## Bagaimana framework yang tepat menang {#how-the-right-framework-wins}

Proyek nyata sering cocok dengan lebih dari satu framework. Aplikasi CodeIgniter 4 yang punya
`package.json` untuk meng-compile Sass cocok dengan CodeIgniter 4 dan Node, dan aplikasi Laravel
dengan Inertia cocok dengan Laravel dan Vue. Rezure tidak mengambil yang pertama dicek. Semua
kecocokan ditimbang, dan **yang paling spesifik yang menang**:

| Prioritas | Jenis | Contoh |
| --- | --- | --- |
| 90 | Framework PHP dengan file penanda sendiri | Laravel, CodeIgniter 3 dan 4, WordPress, Bedrock, Drupal, Joomla |
| 80 | Framework PHP yang dikenali lewat Composer | Symfony, Yii 2, CakePHP, Slim, Laminas |
| 55 | Meta-framework JavaScript | Next.js, Nuxt, Astro |
| 50 | Framework JavaScript | Vue, React, Svelte, Angular |
| 30 | Aplikasi PHP apa pun dengan `public/index.php` dan tanpa `index.php` | PHP (public/) |
| 20 / 15 / 10 | Cadangan | PHP, Node, Static |

Jadi "PHP plus npm untuk aset" (Sass, Vite, Laravel Mix) terdeteksi sebagai framework PHP-nya,
dan aplikasi Next.js tetap Next.js, bukan React.

## Melihat sebagai apa proyek dilayani {#see-what-a-project-is-served-as}

Setiap proyek menampilkan framework-nya sebagai badge di halaman [Proyek](/id/guide/projects),
baik di tampilan list maupun grid. Arahkan kursor untuk melihat folder yang dilayani, misalnya
`public/`, dan klik untuk mengganti framework. Untuk proyek dev server, badge juga menampilkan
port-nya, misalnya `Astro · :4400`.

Saat kamu menautkan folder dengan **Add folder**, dialog menampilkan framework dan folder yang
akan dilayani sebelum apa pun disimpan, dengan **Change** di sebelah framework.

### Tidak sengaja menautkan folder `public/`? {#linked-the-public-folder-by-mistake}

Rezure versi lama melayani CodeIgniter 4 dan Symfony dari folder proyek, dan cara akalinya
biasanya dengan menautkan folder `public/` proyek secara langsung. Kalau sekarang kamu memilih
folder `public/`, `web/`, atau `webroot/`, dialog bertuliskan "This looks like the public folder
of a CodeIgniter 4 project" dan menawarkan **Add {project} instead**.

Untuk membersihkan tautan lama seperti itu: hapus dari Rezure (foldernya tidak disentuh), lalu
tambahkan folder root proyeknya. Domain polosnya (`myapp.test`, bukan `myapp-2.test`) kembali,
dan **Folder** serta **Terminal** membuka root proyek, bukan `public/`.

## Mengganti framework proyek {#change-a-project-s-framework}

1. Di halaman **Projects**, klik badge framework proyek.
2. Pilih framework lain dari daftar. **Search frameworks** memfilternya.
3. Perubahannya langsung berlaku: Rezure menulis ulang virtual host proyek dan me-reload Nginx.

Daftarnya juga punya dua entri khusus:

- **Auto** kembali ke deteksi otomatis.
- **Custom folder…** ("Serve a subfolder you name") melayani subfolder apa pun yang kamu ketik,
  misalnya `public` atau `src/web`. Ini juga cara melayani folder `dist/` hasil **build** proyek
  JavaScript sebagai file biasa, bukan lewat dev server-nya.

Badge dengan titik berarti diatur olehmu. Tooltip-nya tetap menyebut hasil deteksi (misalnya
"detected: Node"), jadi kamu selalu bisa melihat apa tebakan Rezure.

Mengganti framework berlaku untuk proyek di `www` maupun proyek tertaut. Pilihan disimpan di
`C:\rezure\etc\project-frameworks.json`:

- Proyek di `www` dikenali dari nama foldernya, jadi **mengganti nama folder membuang
  pilihannya**.
- Menghapus proyek tertaut juga membuang pilihannya.

## Menambahkan framework yang belum dikenal Rezure {#add-a-framework-rezure-doesn-t-know}

Framework internal, atau yang belum dibawa Rezure, bisa ditambahkan tanpa menunggu rilis.
Jelaskan di `C:\rezure\etc\frameworks.json`:

```json
{
  "frameworks": [
    {
      "id": "acme-cms",
      "label": "Acme CMS",
      "priority": 85,
      "detect": { "any": [{ "composer": "acme/cms-core" }, { "file": "acme.php" }] },
      "docroot": "htdocs"
    }
  ]
}
```

Lalu buka dialog framework proyek mana pun dan klik **Reload frameworks.json**, atau restart
Rezure. Framework milikmu tampil paling atas di pemilih, di bawah "Your frameworks".

- **id baru** menambahkan framework. **id bawaan** (`laravel`, `codeigniter4`, dan seterusnya)
  menggantikan definisi itu sepenuhnya.
- Entri yang tidak bisa dipakai dilewati sendiri dan sisa file tetap berlaku. Halaman Projects
  menampilkan "Some framework settings aren't being used" beserta alasannya. File yang bukan JSON
  valid diabaikan seluruhnya, dan itu juga dilaporkan.

### Field {#fields}

| Field | Wajib | Arti |
| --- | --- | --- |
| `id` | ya | Huruf kecil, angka, dan tanda hubung, sampai 64 karakter. `unknown` dan `custom` dicadangkan. |
| `label` | ya | Yang ditampilkan halaman Projects, sampai 40 karakter. |
| `priority` | ya | 0–100. Kecocokan tertinggi menang; kalau seri, yang tercantum lebih dulu. Pakai rentang di [Bagaimana framework yang tepat menang](#how-the-right-framework-wins). |
| `detect` | ya | Kapan sebuah proyek dianggap framework ini. Lihat [Aturan detect](#detect-rules). |
| `docroot` | tidak | Subfolder yang dilayani, relatif terhadap proyek. Kalau dikosongkan: folder proyek. |
| `category` | tidak | Judul grup di pemilih, sampai 24 karakter. |
| `serve` | tidak | `php` (default) atau `proxy` untuk dev server. Lihat [Dev Server](/id/guide/dev-servers). |
| `dev` | tidak | Hanya dengan `"serve": "proxy"`: `{ "script": "dev", "port": "vite" }`. Lihat [cara port diteruskan](/id/guide/dev-servers#how-the-port-is-passed). |

Field yang tidak dikenal ditolak, bukan diabaikan, jadi salah ketik seperti `docRoot`
dilaporkan, bukan diam-diam tidak berbuat apa-apa.

### Aturan detect {#detect-rules}

Sebuah aturan adalah object dengan tepat satu key:

| Aturan | Cocok kalau |
| --- | --- |
| `{ "file": "artisan" }` | file itu ada (path bertingkat bisa: `system/core/CodeIgniter.php`) |
| `{ "dir": "web/app" }` | folder itu ada |
| `{ "composer": "laravel/framework" }` | `composer.json` mencantumkan package itu di `require` atau `require-dev` |
| `{ "npm": "next" }` | `package.json` mencantumkan package itu di `dependencies` atau `devDependencies` |
| `{ "any": [ … ] }` | minimal satu aturan di dalamnya cocok |
| `{ "all": [ … ] }` | semua aturan di dalamnya cocok |
| `{ "not": { … } }` | aturan di dalamnya tidak cocok |

Nama package dibandingkan tanpa membedakan huruf besar kecil, dan aturan bersarang paling dalam 8
tingkat. Path di `docroot`, `file`, dan `dir` harus relatif terhadap proyek: tanpa huruf drive,
tanpa garis miring di depan, tanpa `..`. `/` dan `\` sama-sama bisa.

Untuk membagikan definisi ke semua orang, buka pull request yang menambahkannya ke
[`src-tauri/resources/frameworks.json`](https://github.com/myahyazahid/rezure/blob/main/src-tauri/resources/frameworks.json)
beserta fixture tes kecil. `docs/v1/frameworks.md` di repositori menjelaskan caranya.

## Cara Nginx melayani tiap jenis {#how-nginx-serves-each-kind}

| Profil | Yang dilakukan Nginx | Dipakai oleh |
| --- | --- | --- |
| `php` | Melayani file di folder apa adanya dan mengirim sisanya ke `index.php` lewat FastCGI. Dotfile seperti `.env` dan `.git` menjawab **404**, kecuali `.well-known`. | Setiap framework PHP, Static, dan Custom folder |
| `proxy` | Meneruskan setiap request, termasuk websocket hot reload, ke dev server proyek di port-nya sendiri. | Next.js, Nuxt, Astro, Vue, React, Svelte, Angular, Node |

Memblokir dotfile penting untuk proyek yang dilayani dari foldernya sendiri, seperti WordPress,
CodeIgniter 3, dan PHP biasa: sebelum Rezure 3.3, `http://myapp.test/.env` bisa mengunduh `.env`
milik proyek itu.

Definisi framework hanya memilih profil. Ia tidak bisa menambahkan directive Nginx sendiri,
karena semua situs berbagi satu konfigurasi Nginx dan satu directive yang rusak akan menghentikan
semuanya.

## Pemecahan masalah {#troubleshooting}

### Situs menjawab 404, atau menampilkan daftar folder {#the-site-answers-404-or-lists-a-folder}

Proyeknya kemungkinan dilayani dari folder yang salah. Arahkan kursor ke badge framework-nya
untuk mengecek dari mana dilayani. Lalu klik badge dan pilih framework yang benar, atau
**Custom folder…** kalau proyek memakai struktur sendiri.

### "Some framework settings aren't being used" {#some-framework-settings-aren-t-being-used}

Sebuah entri di `etc\frameworks.json` dilewati (pesannya menjelaskan alasannya), atau sebuah
proyek diatur ke framework yang sudah tidak didefinisikan. Sementara itu proyek tersebut dilayani
sesuai hasil deteksi. Perbaiki file-nya, lalu klik **Reload** di sebelah pesan.

### Domain mendapat akhiran `-2` {#the-domain-got-a-2-suffix}

Proyek lain, sering kali tautan lama ke folder `public/` proyek yang sama, sudah memakai nama
polosnya. Lihat [Tidak sengaja menautkan folder public/?](#linked-the-public-folder-by-mistake).

## Apa yang dikirim tentang framework {#what-s-sent-about-frameworks}

Saat kamu menambahkan folder atau mengganti framework proyek, data pemakaian anonim Rezure
mencatat **id** framework yang terdeteksi dan yang kamu pilih, misalnya `node` dan
`codeigniter4`. Ini menunjukkan di mana deteksi salah menebak proyek. Tidak pernah nama proyek,
path, domain, atau file-nya. Framework dari `frameworks.json` milikmu hanya dilaporkan sebagai
`user-defined`, dan custom folder hanya sebagai `custom`. Lihat
[Privasi & Data Penggunaan](/id/guide/privacy).

## Terkait {#related}

- [Proyek](/id/guide/projects): domain, file hosts, dan setiap aksi pada proyek
- [Dev Server](/id/guide/dev-servers): Vite, Next.js, Astro, dan Nuxt di domain `.test`
- [Pindah dari Laragon atau XAMPP](/id/guide/switch-from-laragon-xampp): memindahkan proyek yang sudah ada

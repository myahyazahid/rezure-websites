---
title: Domain .test Lokal dan Virtual Host Nginx
description: 'Cara Rezure melayani proyek di domain .test: folder www dan folder tertaut, deteksi framework, document root, dev server, file hosts, dan aksi-aksinya.'
---

# Proyek

Setiap proyek yang dilayani Rezure mendapat virtual host Nginx dan domain `.test` sendiri.
Halaman **Projects** menampilkan semuanya, menunjukkan apakah setiap domain sudah bisa
di-resolve, dan menaruh hal-hal yang kamu lakukan pada sebuah proyek (membuka, membagikan,
mengecek, membuka terminal) di barisnya.

## Asal proyek {#where-projects-come-from}

### Folder di `www` {#folders-in-www}

Setiap folder di `C:\rezure\www` adalah sebuah proyek. Folder bernama `myapp` menjadi
`myapp.test`. Folder yang namanya diawali `.` dilewati.

### Folder tertaut {#linked-folders}

Proyek yang ada di tempat lain, misalnya `D:\work\client-site`, bisa **ditautkan** di
tempatnya. Rezure hanya mencatat path-nya; foldernya tidak disalin, dipindah, atau ditulisi.
Proyek tertaut punya badge **Linked**. Lihat [Menambahkan folder yang sudah ada](#add-an-existing-folder)
di bawah.

### Proyek baru {#new-projects}

**New project** membuat proyek di `www` dari template: Laravel, WordPress, PHP kosong, atau HTML
statis. Lihat [Proyek Baru](/id/guide/new-project).

## Domain {#domains}

- Akhirannya selalu `.test`. Ini sengaja tidak bisa diubah: browser memaksa `.dev` ke HTTPS,
  dan `.local` dipakai mDNS di banyak jaringan.
- Domain boleh memakai huruf, angka, dan tanda hubung, dengan titik di antara bagian-bagiannya
  (`api.myapp.test`). Sebuah bagian tidak boleh diawali atau diakhiri tanda hubung, dan paling
  panjang 63 karakter.
- Folder yang namanya mengandung underscore, spasi, atau karakter lain tidak bisa menjadi domain
  yang valid. Barisnya bertuliskan "Not served: rename the folder using letters, digits and
  hyphens only." dan tidak mendapat virtual host sampai kamu mengganti namanya.

Situs dilayani lewat `http://` biasa di port 80. Tidak ada HTTPS lokal.

## Framework dan document root {#frameworks-and-document-root}

Rezure membaca file setiap proyek untuk menentukan framework-nya, dan framework menentukan cara
Nginx melayaninya:

- **Framework PHP** dilayani dari folder yang berisi front controller-nya: `public\` untuk
  Laravel, CodeIgniter 4, Symfony, Slim, dan Laminas, `web\` untuk Drupal, Bedrock, dan Yii 2,
  `webroot\` untuk CakePHP, dan folder proyek untuk WordPress, CodeIgniter 3, Joomla, dan PHP
  biasa.
- **Proyek JavaScript dan Node** (Vue, React, Svelte, Angular, Astro, Next.js, Nuxt, Node)
  diteruskan ke **dev server**-nya sendiri, yang dijalankan Rezure saat kamu mengklik **Open**.
  Lihat [Dev Server](/id/guide/dev-servers).
- Proyek HTML **Static** dan **Unknown** dilayani dari folder proyek sebagai file biasa. Folder
  tertaut yang sudah tidak ada ditampilkan sebagai **Missing**.

Kecocokan yang paling spesifik yang menang, jadi aplikasi CodeIgniter 4 dengan `package.json`
untuk Sass-nya tetap CodeIgniter 4, bukan Node, dan aplikasi Laravel dengan Inertia tetap
Laravel, bukan Vue. Setiap proyek menampilkan framework-nya sebagai badge. Klik untuk memilih
framework lain, atau **Custom folder…** milikmu sendiri, dan perubahannya langsung berlaku.
Daftar lengkap, aturan deteksi, dan cara menambahkan framework sendiri ada di
[Framework](/id/guide/frameworks).

Proyek PHP memakai aturan Nginx yang sama: file statis lebih dulu, selebihnya lewat `index.php`
(pola front controller), **dotfile seperti `.env` dan `.git` menjawab 404**, body request
sampai 64 MB, dan PHP diberi waktu sampai 300 detik per request.

Rezure membuat ulang konfigurasi di `C:\rezure\data\nginx\vhosts\` setiap kali proyek berubah,
jadi editan manual di sana akan hilang.

## File hosts {#the-hosts-file}

Domain `.test` baru bisa di-resolve setelah punya satu baris di file `hosts` Windows. Di halaman
Projects:

- Domain berwarna **aksen** sudah bisa di-resolve ("Resolves in the browser").
- Domain yang **redup** belum ("Not in the hosts file yet: it won't resolve until you sync").

Klik **Sync hosts file** untuk menambahkan setiap domain yang belum ada dan membuang yang sudah
basi. Windows meminta persetujuan administrator setiap kali file memang perlu diubah; tombolnya
bertuliskan "Waiting for admin approval…" selama menunggu, dan menjadi abu-abu dengan tulisan
"Every domain already resolves" saat tidak ada yang perlu dilakukan.

Rezure hanya menyentuh bloknya sendiri di file itu, di antara dua baris ini:

```
# --- Rezure managed entries (do not edit below) ---
127.0.0.1	myapp.test
# --- Rezure managed entries end ---
```

Bagian lain dari file dibiarkan persis seperti semula. Setiap baris `127.0.0.1 <domain>`
dihitung sebagai sudah bisa di-resolve, termasuk yang kamu tambahkan sendiri.

Untuk melewati tombol itu, aktifkan **Auto-write hosts entries** di
[Pengaturan](/id/guide/settings). Rezure lalu melakukan sinkronisasi sekali setiap kali
dijalankan, dengan satu prompt administrator saat startup kalau ada yang berubah.

## Daftar proyek {#the-project-list}

- **Search projects or domains** memfilter berdasarkan nama atau domain.
- **List** dan **Grid** mengganti tata letak.
- Setiap proyek menampilkan nama, folder, domain, badge framework, dan baris pemakaian: "Not
  opened yet", atau "Opened 3× · last today". Membuka situs, foldernya, atau terminalnya dari
  Rezure ikut dihitung. Arahkan kursor ke badge framework untuk melihat folder yang dilayani;
  klik untuk [mengganti framework](/id/guide/frameworks#change-a-project-s-framework).
- **Dev servers**, di sebelah **Sync hosts file**, menampilkan proyek JavaScript dan Node yang
  dilayani dev server-nya sendiri, dengan badge yang menghitung yang sedang berjalan. Lihat
  [Dev Server](/id/guide/dev-servers).
- Folder tertaut yang sudah hilang menampilkan "Folder not found: it may have moved, or be on a
  drive that isn't connected." Proyeknya tetap tercantum, tanpa virtual host, sehingga kembali
  lagi saat drive-nya tersambung.

## Aksi pada proyek {#actions-on-a-project}

Setiap baris punya, berurutan:

| Aksi | Fungsinya |
| --- | --- |
| **Open** | Membuka `http://<domain>` di browser default-mu. Untuk proyek [dev server](/id/guide/dev-servers), dev server dijalankan dulu dan browser terbuka begitu ada jawaban; titik di tombolnya hijau selama berjalan. |
| **Share** | Memulai link Cloudflare publik untuk proyek. Lihat [Berbagi Proyek](/id/guide/sharing). |
| **Folder** | Membuka folder proyek di Explorer. |
| **Requirements check** | Mengecek ekstensi PHP proyek, HTTPS dari PHP, serta pengaturan email dan database. Lihat [Cek Kebutuhan](/id/guide/requirements-check). |
| **PHP version** | Mengunci proyek ke versi PHP-nya sendiri. Lihat [PHP per Proyek](/id/guide/project-php-version). |
| **Node.js version** | Mengunci versi Node.js yang dipakai terminal dan dev server-nya. Lihat [Node.js](/id/guide/nodejs#pin-node-per-project). |
| **Terminal** | Membuka terminal di folder dengan PHP dan Node milik proyek di urutan pertama `PATH`. Lihat [Terminal Proyek](/id/guide/project-terminal). |
| **×** (hanya proyek tertaut) | Menghapus proyek dari Rezure. |

Tombol PHP dan Node.js menampilkan logo runtime masing-masing: abu-abu selama proyek mengikuti
versi global, berwarna di tombol yang terisi begitu sebuah versi dikunci. Ikon Share terisi
selama sedang dibagikan.

Tidak ada aksi rename. Untuk mengganti nama proyek di `www`, ganti nama foldernya, tetapi
perhatikan bahwa proyek itu lalu dihitung sebagai proyek baru, jadi riwayat pemakaian, kunci
PHP/Node, pilihan framework, dan pengaturan dev server-nya tidak ikut.

## Menambahkan folder yang sudah ada {#add-an-existing-folder}

1. Klik **Add folder** ("Serve a project from a folder outside your www directory").
2. Klik **Choose a folder** dan pilih foldernya.
3. Rezure menampilkan **framework** yang terdeteksi dan folder yang akan **dilayani**, misalnya
   Laravel dilayani dari `public/`, dengan **Change** di sebelah framework kalau deteksinya
   salah. Proyek JavaScript bertuliskan "Served through its dev server". Tanpa penanda apa pun:
   "No framework markers found here: it'll be served from the folder itself. Pick the framework
   below if you know it."
   Kalau kamu memilih folder `public/` sebuah proyek, bukan proyeknya sendiri, dialog akan
   memberitahu dan menawarkan untuk menambahkan folder proyeknya. Lihat
   [Framework](/id/guide/frameworks#linked-the-public-folder-by-mistake).
4. Cek **Name** dan **Domain**. Domain disarankan dari nama folder; kalau sudah dipakai, sebuah
   angka ditambahkan (`myapp-2.test`). Kamu boleh mengetik domain valid apa pun; tidak harus
   berakhiran `.test`, meskipun `.test` adalah pilihan yang aman.
5. Klik **Add project**, lalu **Sync hosts file**.

Rezure menolak beberapa folder dan menjelaskan alasannya sebelum menyimpan apa pun:

- root sebuah drive ("serving a whole drive isn't safe")
- `C:\Windows`, `C:\Program Files`, atau `C:\Program Files (x86)`
- folder di dalam `www` ("it's already inside your www folder, so it's listed automatically")
- folder yang sudah ditautkan, atau domain yang dipakai proyek lain

Proyek tertaut disimpan di `C:\rezure\etc\links.json`. Nama dan domainnya tidak bisa diedit
setelah ditautkan; hapus proyeknya lalu tambahkan lagi untuk mengubahnya.

### Menghapus proyek tertaut {#remove-a-linked-project}

Klik **×** di barisnya ("Remove from Rezure (the folder is left alone)") dan konfirmasi. Rezure
berhenti melayaninya dan membuang virtual host-nya. Folder dan semua isinya tetap persis di
tempatnya, dan kamu bisa menambahkannya lagi kapan saja: menambahkan ulang path yang sama dengan
nama yang sama mengembalikan riwayat dan kuncinya.

Proyek di `www` tidak punya aksi hapus: pindahkan foldernya keluar dari `www`.

## Pemecahan masalah {#troubleshooting}

### Domain tidak terbuka {#the-domain-doesn-t-open}

Cek berurutan: domain berwarna aksen (kalau tidak, **Sync hosts file**); Nginx berjalan; layanan
PHP milik proyek berjalan. **502 Bad Gateway** berarti Nginx baik-baik saja tetapi PHP tidak.
Lalu coba jendela browser private, siapa tahu kegagalan lama tersimpan di cache.

### Prompt hosts terus muncul lagi {#the-hosts-prompt-keeps-coming-back}

Tool lain (Laragon dan XAMPP sama-sama melakukannya) menulis ulang file `hosts` dan menghapus
entri milik Rezure. Hentikan tool itu, atau matikan fitur pengelolaan hosts-nya.

### "hosts file update was cancelled" {#hosts-file-update-was-cancelled}

Prompt administrator ditolak. Klik **Sync hosts file** lagi dan pilih **Yes**.

### Proyek menampilkan "Not served" {#the-project-shows-not-served}

Nama foldernya tidak bisa menjadi domain. Ganti nama folder dengan huruf, angka, dan tanda
hubung.

### Situs menjawab 404 padahal kodenya jalan di tempat lain {#the-site-answers-404-although-the-code-works-elsewhere}

Proyek dilayani dari folder yang salah: framework front controller yang dilayani dari folder
proyeknya, bukan `public/`, menjawab setiap URL dengan 404. Arahkan kursor ke badge framework
untuk mengecek, lalu klik dan pilih framework yang benar. Lihat [Framework](/id/guide/frameworks).

### "This project's dev server isn't running" {#this-project-s-dev-server-isn-t-running}

Proyeknya aplikasi JavaScript atau Node dan tidak ada yang menjawab di port-nya. Klik **Open**,
atau **Start** di **Dev servers**. Lihat [Dev Server](/id/guide/dev-servers#troubleshooting).

## Terkait {#related}

- [Framework](/id/guide/frameworks): deteksi, document root, dan menambahkan milikmu sendiri
- [Dev Server](/id/guide/dev-servers): Vite, Next.js, Astro, dan Nuxt di domain `.test`
- [Proyek Baru](/id/guide/new-project): mulai dari template
- [Cek Kebutuhan](/id/guide/requirements-check): temukan apa yang kurang dari sebuah proyek
- [Terminal Proyek](/id/guide/project-terminal): jalankan `artisan`, `composer`, dan `npm`

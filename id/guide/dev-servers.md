---
title: Dev Server Vite, Next.js, dan Nuxt di Domain .test
description: 'Buka aplikasi Vite, Next.js, Nuxt, Astro, dan Node di myapp.test pada Windows. Rezure menjalankan dev server, mem-proxy domain, dan menjaga hot reload tetap jalan.'
---

# Dev Server

Proyek Vite, Next.js, Nuxt, atau Astro bukanlah folder berisi file yang bisa langsung disajikan
web server. Proyek itu hanya berfungsi selama dev server-nya sendiri berjalan. Rezure mengurus
itu untukmu: Nginx meneruskan setiap request untuk domain `.test` proyek ke port dev server, dan
Rezure menjalankan dev server saat kamu membuka proyeknya.

Jadi `http://my-astro-site.test` bekerja sama seperti `http://my-laravel-app.test`, lengkap
dengan hot reload, dan kamu tidak perlu mengingat `localhost:5173`.

Baru di Rezure 3.3.

## Proyek mana yang memakai dev server {#which-projects-use-a-dev-server}

Setiap proyek yang terdeteksi sebagai **Vue**, **React**, **Svelte**, **Angular**, **Astro**,
**Next.js**, **Nuxt**, atau **Node**. Termasuk aplikasi Node yang mendengarkan di port sendiri,
seperti API Express atau tool yang di-host sendiri. Lihat [Framework](/id/guide/frameworks) untuk
cara kerja deteksinya.

Untuk melayani output **build** proyek JavaScript (`dist/`) sebagai file biasa, buka badge
framework-nya dan pilih **Custom folder…**. Untuk menaruh proyek di dev server yang terlewat oleh
deteksi, pilih framework-nya dari badge yang sama.

Laravel dengan Vite berbeda: situsnya tetap dilayani PHP, dan plugin Vite milik Laravel berbicara
langsung dengan `npm run dev`. Lihat [Node.js](/id/guide/nodejs#laravel-with-vite).

## Membuka proyek {#open-a-project}

Klik **Open** di baris proyek. Kalau dev server belum berjalan, Rezure:

1. Menampilkan bahwa dev server sedang dijalankan.
2. Menjalankan script proyek (misalnya `npm run dev`) di port proyek.
3. Menunggu sampai port menjawab, dan **baru kemudian** membuka browser-mu, supaya kamu langsung
   sampai di aplikasi, bukan di halaman error.

Titik kecil di tombol **Open** menunjukkan statusnya: abu-abu saat berhenti, berkedip saat
sedang dijalankan, dan hijau selama berjalan.

Kalau gagal berjalan, browser tidak dibuka. Pesan di bawah header menjelaskan alasannya, dengan
**Fix in Dev servers**, yang membuka dialog langsung di proyek itu.

Dengan **Open starts it** dimatikan, **Open** hanya membuka browser. Sampai kamu menjalankan
server-nya, halaman bertuliskan "This project's dev server isn't running".

## Dialog Dev servers {#the-dev-servers-dialog}

**Dev servers**, di sebelah **Sync hosts file** pada halaman Projects, menampilkan setiap proyek
yang dilayani dengan cara ini. Badge-nya menghitung yang sedang berjalan.

Kartu setiap proyek menampilkan domain, framework, status (**Running**, **Starting…**,
**Stopped**), perintah persis yang dijalankan, dan **Start** / **Stop** / **Log**. **Stop all**
menghentikan semua dev server sekaligus.

| Pengaturan | Fungsinya |
| --- | --- |
| **Port** | Ke mana Nginx mengirim domain. Rezure memilih satu dari **4400–4499** pertama kali dan menyimpannya, jadi sebuah domain selalu sampai ke port yang sama. Ganti untuk aplikasi yang mendengarkan di port tetap miliknya sendiri. |
| **Tell it the port with** | Cara memberi tahu dev server untuk memakai port itu. Default-nya berasal dari framework. Lihat di bawah. |
| **Script** | Script `package.json` yang menjalankannya. Dropdown menampilkan script milik proyek. |
| **Open starts it** | Aktif: **Open** menjalankan dev server dulu. Mati: kamu menjalankannya sendiri. |

Port dan script hanya bisa diubah selama dev server berhenti ("Stop it to change its port or
script."). Klik **Save** untuk menyimpan perubahan, atau **Revert** untuk membatalkannya.

Pengaturan disimpan di `C:\rezure\etc\dev-servers.json`. Jangan edit file itu selama Rezure
berjalan.

### Cara port diteruskan {#how-the-port-is-passed}

| Opsi | Ditambahkan ke perintah | Untuk |
| --- | --- | --- |
| **--port + --strictPort** | `-- --port 4400 --strictPort` | Vite (Vue, React, Svelte). Tanpa `--strictPort`, Vite diam-diam pindah ke port berikutnya saat port-nya terpakai. |
| **--port** | `-- --port 4400` | Next.js, Nuxt, Astro, `ng serve` |
| **PORT variable only** | tidak ada | Create React App, dan aplikasi Node yang membaca `process.env.PORT` |
| **The app's own port** | tidak ada | Aplikasi yang selalu memakai port yang sama. Isi port itu di **Port**. |

Environment variable `PORT` diatur di semua kasus.

### Script default {#default-scripts}

| Framework | Script |
| --- | --- |
| Vue, React, Svelte, Astro, Next.js, Nuxt | `dev` |
| Angular, Node | `start` |

Kalau `package.json` tidak punya script default, Rezure mencoba `dev`, lalu `start`. Kalau
keduanya tidak ada, kartunya memberitahu dan membiarkan kamu memilih.

### Aturan port {#port-rules}

Saat kamu menyimpan port, Rezure mengeceknya sebelum menyimpan:

- Harus di antara 1024 dan 65535.
- Tidak boleh dipakai proyek lain.
- Tidak boleh salah satu port milik Rezure: 80, MariaDB/MySQL, PostgreSQL, port PHP, Mailpit,
  atau bridge LocalDB. Lihat [Port](/id/guide/ports).

## Saat dev server belum bisa berjalan {#when-a-dev-server-can-t-start-yet}

Kartunya memberi tahu apa yang kurang dan menawarkan perbaikannya:

| Pesan | Perbaikan |
| --- | --- |
| "Its dependencies aren't installed yet." | Klik **npm install** (atau **pnpm install**, **yarn install**, **bun install**, tergantung lockfile proyek). Output-nya tampil di log kartu. |
| "Node.js isn't installed." / "Set to Node.js x, which isn't installed." | **Open Switch** lalu pasang. Lihat [Node.js](/id/guide/nodejs). |
| "package.json has no "dev" script" | Pilih script yang benar dari **Script**. |
| "This project uses pnpm, which isn't installed." | Jalankan `corepack enable` di terminal, atau pasang pnpm (atau yarn). |
| "It's already running outside Rezure …" | Klik **Stop it and start here**. Lihat di bawah. |
| Port dipakai program lain | Klik **Free port N and start**, alur yang sama dengan [Konflik Port](/id/guide/port-conflicts). |

### Sudah berjalan di terminal {#already-running-in-a-terminal}

Kalau kamu menjalankan dev server yang sama sendiri, dengan `npm run dev` di terminal atau tombol
run di IDE, Rezure akan menemukannya. Rezure mencari proses Node, Bun, atau Deno yang bekerja di
folder proyek dan mendengarkan di sebuah port. Astro dan Next.js menolak berjalan dua kali di satu
folder, dan dua salinan toh akan berebut port.

**Stop it and start here** menghentikan server salinan itu dan menjalankan milik Rezure di port
proyek. Terminal tempat kamu mengetik perintah tetap terbuka. Build watcher atau test runner di
folder yang sama tidak disentuh, karena tidak mendengarkan di port.

### Pesan error yang jelas {#clear-error-messages}

Saat dev server keluar ketika startup, Rezure menyimpan 40 baris output terakhirnya dan
menampilkan **error yang sebenarnya**, bukan stack trace di bawahnya. Untuk kegagalan yang sudah
dikenal, perbaikannya ikut ditampilkan: salinan lain sudah berjalan, file lock, `EADDRINUSE`, atau
module yang hilang (→ **Install**). **Log** menampilkan output lengkapnya.

## Apa yang dilakukan dan tidak dilakukan Rezure {#what-rezure-does-and-doesn-t-do}

- Dev server berjalan **hanya saat kamu memintanya**, lewat **Open** atau **Start**. Mereka tidak
  ada di halaman [Layanan](/id/guide/services) dan **Start all** tidak pernah menjalankannya,
  karena masing-masing bisa memakan ratusan MB memori.
- Masing-masing berjalan dengan versi Node.js milik proyek kalau proyek itu
  [mengunci versi](/id/guide/nodejs#pin-node-per-project).
- **Setiap dev server berhenti saat Rezure ditutup.** Yang tertinggal akibat crash dibersihkan
  saat dev server itu dijalankan berikutnya.
- Dev server yang keluar sendiri tidak di-restart, karena error compile hanya akan membuatnya
  crash lagi. Log-nya menjelaskan apa yang terjadi.
- [Berbagi](/id/guide/sharing) bekerja seperti proyek lain: tunnel Cloudflare melewati Nginx ke
  dev server.
- Dev server tidak pernah dimasukkan ke [data pemakaian](/id/guide/privacy) Rezure.

## Hot reload, Vite, dan Next.js {#hot-reload-vite-and-next-js}

Nginx meneruskan websocket, jadi hot module replacement bekerja lewat domain `.test`. Rezure juga
menangani dua pengecekan host yang biasanya merusak setup seperti ini:

- **Vite** menolak request untuk hostname yang tidak dikenalnya ("Blocked request. This host is
  not allowed"). Rezure memberi tahu Vite untuk menerima domain proyek, jadi `vite.config` tidak
  perlu entri `allowedHosts`.
- **Next.js 16** menolak resource dev miliknya sendiri (`/_next/*`, termasuk websocket hot reload)
  untuk origin selain `localhost`, sehingga halaman macet di layar loading. Virtual host Rezure
  membuang header `Origin` di path-path itu hanya kalau isinya domain proyek sendiri, jadi
  `next.config` tidak perlu `allowedDevOrigins`. Request dari situs lain tetap ditolak.

Vite mendengarkan di `localhost`, yang di banyak mesin Windows berarti hanya IPv6 (`::1`). Nginx
mencoba `127.0.0.1` dulu lalu beralih ke `[::1]`, jadi keduanya bisa.

## Pemecahan masalah {#troubleshooting}

### "This project's dev server isn't running" {#this-project-s-dev-server-isn-t-running}

Tidak ada yang menjawab di port proyek. Klik **Open**, atau **Start** di Dev servers. Kalau kamu
menjalankan server sendiri, buat ia mendengarkan di port yang ditampilkan Dev servers.

### "Blocked request. This host is not allowed" dari Vite {#blocked-request-this-host-is-not-allowed-from-vite}

Versi Vite-mu terlalu lama untuk menerima host tambahan dari Rezure. Tambahkan ini ke
`vite.config`:

```js
export default {
  server: { allowedHosts: ['.test'] }
}
```

### Hot reload tidak memperbarui halaman {#hot-reload-doesn-t-update-the-page}

Buka situs lewat domain `.test`-nya setelah dev server menyala, dan cek console browser untuk
websocket yang gagal. Pengaturan `server.hmr` di `vite.config` yang menyebut host atau port lain
akan menimpa apa yang diteruskan Nginx.

### "It's listening on :3001 instead of :4400" {#it-s-listening-on-3001-instead-of-4400}

Dev server mengabaikan port yang diberikan. Ini khas script yang membungkusnya, seperti
`concurrently` atau `server.js` kustom. Atur **Port** ke port yang benar-benar dipakai dan
**Tell it the port with** ke **The app's own port**, atau buat script-nya meneruskan `--port`.

### Halaman Next.js tetap di layar loading {#a-next-js-page-stays-on-its-loading-screen}

Restart dev server dari Dev servers, lalu muat ulang lewat domain `.test`. Rezure 3.3 ke atas
menangani pengecekan origin Next 16 (lihat [di atas](#hot-reload-vite-and-next-js)). Kalau kamu
menambahkan `allowedDevOrigins` sendiri sebagai akalan, kamu bisa menghapusnya.

### Proyek malah muncul sebagai situs PHP {#the-project-shows-up-as-a-php-site-instead}

Deteksi tidak melihat framework JavaScript. Mungkin `package.json` ada di subfolder, atau
framework-nya adalah dependency dari dependency. Klik badge framework dan pilih yang benar.

## Terkait {#related}

- [Framework](/id/guide/frameworks): cara proyek dideteksi, dan cara mengubahnya
- [Node.js](/id/guide/nodejs): pasang versi dan kunci satu per proyek
- [Proyek](/id/guide/projects): domain, file hosts, dan aksi proyek
- [Port](/id/guide/ports): setiap port yang dipakai Rezure

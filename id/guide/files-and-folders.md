---
title: File dan Folder
description: 'Di mana Rezure menyimpan proyek, database, runtime, pengaturan, dan log di disk: struktur C:\rezure, apa yang aman diedit, dan apa yang diubahnya di luar folder itu.'
---

# File dan Folder

Rezure menyimpan semua yang dikelolanya di **satu folder**, `C:\rezure`, terpisah dari folder
instalasi aplikasi. Instal ulang, pembaruan, atau kembali ke versi lama tidak menyentuhnya.

Kalau `C:\` tidak bisa ditulisi di mesinmu, Rezure memakai `%LOCALAPPDATA%\Rezure` sebagai gantinya.
Untuk menaruhnya di tempat lain sama sekali, misalnya drive lain, atur environment variable
`REZURE_HOME` ke folder yang kamu mau sebelum menjalankan Rezure.

## Struktur {#the-layout}

```
C:\rezure
├── www\          proyek-proyekmu
├── dumps\        hasil ekspor database
├── bin\          runtime yang diunduh dan diverifikasi Rezure
├── custom\       runtime yang kamu tambahkan sendiri
├── data\         state layanan (dibuat otomatis)
├── etc\          pengaturan dan konfigurasi milikmu
├── current\      link PHP yang dipakai "PHP everywhere"
├── stickers\     stiker yang diunduh
├── rezure.db     proyek dan data pemakaian yang tertunda
├── AGENTS.md     catatan untuk AI coding agent
├── CLAUDE.md
└── docs\how-rezure-works.md
```

### `www\`: proyek {#www-projects}

Setiap folder adalah proyek, dilayani sebagai `<folder>.test`. Lihat [Proyek](/id/guide/projects).

### `dumps\`: ekspor {#dumps-exports}

Setiap ekspor database, bernama `<database>-<YYYYMMDD-HHMMSS>.sql` (atau `.bak` untuk SQL Server
LocalDB). Ekspor dari koneksi remote mendapat nama koneksinya sebagai awalan.

### `bin\`: runtime yang diunduh {#bin-downloaded-runtimes}

Satu folder per runtime dan versi, semuanya dicocokkan dengan checksum yang dipublikasikan:
`bin\php\8.4.x`, `bin\mariadb\11.4.x`, `bin\postgres\18.6`, `bin\node\22.x`, `bin\composer\2.x`,
`bin\nginx`, `bin\mailpit`, `bin\cloudflared`.

Menghapus folder sebuah versi (dengan Rezure tertutup) menghapus versi itu sepenuhnya.

### `custom\`: runtime milikmu {#custom-your-own-runtimes}

Build yang kamu unduh sendiri dan ingin dipakai Rezure: `custom\php`, `custom\mysql`,
`custom\node`, dan seterusnya untuk runtime lain. Ditemukan otomatis tetapi tidak diverifikasi
checksum-nya.

### `data\`: state layanan {#data-service-state}

Dibuat dan dikelola Rezure. **Jangan edit apa pun di sini secara manual**; sebagian besar ditulis
ulang setiap kali start.

| Path | Isi |
| --- | --- |
| `data\nginx\` | Konfigurasi Nginx, satu virtual host per proyek di `vhosts\`, dan `logs\error.log` |
| `data\php\ini\` | `php.ini` buatan untuk setiap versi PHP |
| `data\php\<version>\extensions.json` | Toggle ekstensimu untuk versi itu |
| `data\php\tmp\` | Session PHP dan upload yang sedang berjalan |
| `data\mariadb\data\` | Direktori data MariaDB default, **database-mu** |
| `data\postgres\<major>\` | Data PostgreSQL, satu folder per versi major, **database-mu** |
| `data\mssql\` | File database SQL Server LocalDB, **database-mu** |
| `data\mailpit\mailpit.db` | Email yang ditangkap Mailpit |
| `data\installers\` | Installer Microsoft yang dijalankan Rezure, beserta log-nya |

Folder database berisi data aslimu. Backup dulu (atau lebih baik, ekspor database-nya) sebelum
menghapus `data\`.

### `etc\`: pengaturan {#etc-settings}

| File | Isi |
| --- | --- |
| `settings.json` | [Pengaturan](/id/guide/settings)-mu, plus versi aktif, tampilan, dan layanan mana yang ditampilkan halaman Services |
| `profiles.json` | [Profil direktori data](/id/guide/mariadb-mysql#data-directory-profiles) MySQL/MariaDB |
| `connections.json` | [Koneksi database](/id/guide/remote-databases) tersimpan, tidak pernah password |
| `links.json` | Proyek yang ditautkan dari luar `www` |
| `project-frameworks.json` | Framework atau custom folder yang kamu pilih untuk sebuah proyek. Lihat [Framework](/id/guide/frameworks#change-a-project-s-framework) |
| `frameworks.json` | **Definisi framework milikmu**, kalau kamu menambahkannya, memang untuk diedit manual. Lihat [Framework](/id/guide/frameworks#add-a-framework-rezure-doesn-t-know) |
| `dev-servers.json` | Port, script, dan pengaturan **Open starts it** dev server setiap proyek JavaScript. Lihat [Dev Server](/id/guide/dev-servers) |
| `php\conf.d\` | **Pengaturan PHP milikmu**, satu-satunya tempat yang memang untuk diedit manual. Lihat [Konfigurasi PHP](/id/guide/php-configuration#your-php-settings) |
| `cacert.pem` | Bundel CA yang dipakai PHP untuk HTTPS |
| `device.json` | ID acak instalasi ini, dipakai untuk [data pemakaian](/id/guide/privacy) dan tiket Feedback |
| `stickers.json` | Pustaka stiker unduhanmu |
| `changelog_cache.json`, `changelog_state.json`, `donate_cache.json`, … | Salinan cache dari yang diambil aplikasi, supaya tetap jalan offline |

Rezure menyimpan pengaturan ini di memori selama berjalan dan menulisnya kembali saat ada yang
berubah. **Keluar dari Rezure** (dari tray, kalau disimpan di sana) sebelum mengedit file JSON di
`etc\`, kalau tidak editanmu bisa tertimpa.

### `rezure.db` {#rezure-db}

Database SQLite kecil berisi detail proyek (jumlah pemakaian, kunci PHP dan Node) dan antrean data
pemakaian yang menunggu dikirim.

### `AGENTS.md`, `CLAUDE.md`, `docs\` {#agents-md-claude-md-docs}

Catatan untuk AI coding agent, dibuat ulang selama Rezure berjalan. Lihat
[AI Coding Agent](/id/guide/ai-agents).

## Di luar `C:\rezure` {#outside-c-rezure}

Beberapa hal disimpan di tempat lain karena Windows mengharuskannya:

| Apa | Di mana | Kapan |
| --- | --- | --- |
| Domain proyek | Blok Rezure di `C:\Windows\System32\drivers\etc\hosts` | Saat kamu menyinkronkan hosts |
| PHP di `PATH` | Entri di `PATH` **user**-mu, dan `PHP_INI_SCAN_DIR` | Hanya dengan [Use Rezure's PHP everywhere](/id/guide/php-configuration#use-rezure-s-php-everywhere) aktif |
| Password database | Windows Credential Manager, di bawah **Rezure Database Connections** | Saat kamu menyimpan password koneksi |
| Jalan bersama Windows | Entri startup milik user-mu | Hanya dengan **Start Rezure with Windows** aktif |
| ODBC Driver, SQL Server LocalDB | Instalasi Windows biasa, tercantum di **Settings → Apps**, plus instance LocalDB bernama `Rezure` | Hanya kalau kamu memasangnya |
| State jendela aplikasi | Folder profil WebView2 di bawah `%LOCALAPPDATA%` | Selalu |

## Pindah dari versi lama {#moving-from-an-older-version}

Versi Rezure sebelum struktur satu folder memakai `%LOCALAPPDATA%\Rezure`, `%APPDATA%\Rezure`, dan
`%USERPROFILE%\rezure`. Versi terbaru memindahkan semua itu ke `C:\rezure` saat pertama kali
dijalankan, tanpa pernah menimpa apa pun dan tanpa pernah menghapus saat gagal. Lihat
[Instalasi](/id/guide/installation#upgrading-from-an-older-rezure).

## Terkait {#related}

- [Uninstall](/id/guide/uninstall): menghapus semua ini
- [Port](/id/guide/ports): separuh lainnya dari "apa saja yang dipakai Rezure"

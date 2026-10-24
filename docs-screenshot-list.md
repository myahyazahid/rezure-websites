# Daftar Screenshot untuk Docs

Catatan internal (tidak ikut di-build — ada di `srcExclude`). Daftar screenshot yang perlu diambil
dari app Rezure 3.1.1 untuk halaman docs di `guide/`.

**Konvensi:**
- Simpan di `public/screenshots/<halaman>-<nama>.png`, contoh `public/screenshots/services-overview.png`.
- Rujuk dari markdown: `![Services page](/screenshots/services-overview.png)`.
- Ukuran jendela default app (1080×700), tema **Rezure**, mode **Light**, stiker **dimatikan**
  (Decorations → Show stickers off) supaya gambar bersih. Untuk halaman Appearance boleh tema lain.
- Jangan tampilkan data pribadi: nama project klien, path user (`C:\Users\<nama>`), host/IP server
  sungguhan, nama koneksi production. Pakai project contoh (`myapp`, `blog`, `legacy-shop`).
- Prioritas: **P1** = paling membantu user, ambil dulu.

## Getting Started

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `installation` | `installation-first-launch.png` | Services page pertama kali dibuka: Nginx & PHP **Stopped**, baris lain **Not installed** | P1 |
| `first-run` | `first-run-services-running.png` | Services page dengan Nginx, PHP, MariaDB **Running** | P1 |
| `first-run` | `first-run-sync-hosts.png` | Projects page: domain masih warna muted + tombol **Sync hosts file** | P1 |
| `first-run` | `first-run-databases.png` | Databases page dengan beberapa database (kolom Tables/Size/Used by) | P2 |

## Services

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `services` | `services-overview.png` | Services page lengkap: toolbar Start all/Restart all/Stop all, beberapa row running, pill port PHP `:9100–9103 · 4/4 workers` | P1 |
| `services` | `services-row-menu.png` | Menu **More actions (⋮)** terbuka dengan **Force stop** | P3 |
| `services` | `services-log-panel.png` | Panel log satu service terbuka di bawah row | P2 |
| `services` | `services-manage.png` | Dialog **Manage services** (grup "On the Services page" / "Not added") | P2 |
| `port-conflicts` | `port-conflicts-holder.png` | Row Nginx gagal start: pesan "port 80 is held by …" + tombol **Stop it and start Nginx** (bisa direproduksi dengan menjalankan Nginx Laragon/XAMPP dulu) | P1 |
| `logs` | `logs-overview.png` | Logs page dengan filter service & level | P2 |

## Projects

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `projects` | `projects-list.png` | Projects page (List view): beberapa project, badge **Linked**, kolom Stack, toolbar aksi | P1 |
| `projects` | `projects-actions.png` | Close-up toolbar aksi satu project (Open, Share, Folder, Requirements, PHP, Node, Terminal) — bisa dianotasi | P1 |
| `projects` | `projects-add-folder.png` | Dialog **Add existing folder** setelah memilih folder ("Detected as Laravel · served from public/") | P2 |
| `new-project` | `new-project-step1.png` | Step 1: daftar template | P1 |
| `new-project` | `new-project-step2.png` | Step 2: nama project + preview domain | P3 |
| `requirements-check` | `requirements-check.png` | Dialog Requirements check dengan satu extension missing + tombol fix, dan bagian HTTPS hijau | P1 |
| `project-terminal` | `project-terminal.png` | Jendela cmd dari tombol Terminal, menjalankan `where php` dan `php -v` | P2 |
| `sharing` | `sharing-live.png` | Modal share saat live: URL trycloudflare + **Copy** + **Stop sharing** (URL boleh diblur) | P1 |

## PHP

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `php-versions` | `php-versions-switch.png` | Switch page: semua runtime row | P1 |
| `php-versions` | `php-versions-install.png` | Dialog **Install version → PHP** dengan daftar versi dari php.net | P1 |
| `project-php-version` | `project-php-version-modal.png` | Dialog **PHP version · <project>** dengan opsi Default + versi terinstal | P1 |
| `project-php-version` | `project-php-version-services.png` | Services page dengan baris **PHP** dan **PHP 8.1.x** (port 9110–9113) | P2 |
| `php-extensions` | `php-extensions.png` | PHP Extensions page: picker versi, beberapa grup, toggle | P1 |
| `php-configuration` | `php-configuration-cards.png` | Bagian **PHP configuration** di Switch page (3 kartu + Drop-in folder) | P1 |

## Databases

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `mariadb-mysql` | `mariadb-target-switcher.png` | Target switcher terbuka: bagian **Data directory** & **Connections** | P1 |
| `mariadb-mysql` | `mariadb-add-data-directory.png` | Dialog **Add data directory** dengan hasil deteksi Laragon/XAMPP | P2 |
| `mariadb-mysql` | `mariadb-open-with.png` | Menu **Open {db} with** berisi beberapa client | P3 |
| `postgresql` | `postgresql-databases.png` | Databases page dengan koneksi **PostgreSQL · this PC** terpilih | P2 |
| `postgresql` | `postgresql-switch.png` | Dropdown PostgreSQL di Switch page ("data: postgres\18") | P3 |
| `sql-server` | `sql-server-license.png` | Dialog lisensi Microsoft (checkbox "I accept…") | P1 |
| `sql-server` | `sql-server-found.png` | Add connection → SQL Server dengan bagian **Found on this computer** | P2 |
| `remote-databases` | `remote-add-connection.png` | Dialog **Add connection** terisi (host contoh `203.0.113.10`), termasuk bagian SSH tunnel | P1 |
| `remote-databases` | `remote-unlock.png` | Dialog **Password for {name}** (Unlock) | P3 |

## Tools

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `nodejs` | `nodejs-install.png` | Install version → Node.js dengan badge LTS/Latest | P2 |
| `mailpit` | `mailpit-inbox.png` | Inbox Mailpit di browser (`127.0.0.1:8025`) dengan satu email contoh | P1 |
| `ai-agents` | `ai-agents-file.png` | Isi `C:\rezure\AGENTS.md` dibuka di editor (path user disamarkan) | P3 |

## Customize & Reference

| Halaman | Screenshot | Isi | Prioritas |
|---|---|---|---|
| `appearance` | `appearance-themes.png` | Appearance page: grid tema + Adjustments | P1 |
| `appearance` | `appearance-themes-collage.png` | Kolase 4–6 tema berbeda (opsional, untuk visual) | P3 |
| `appearance` | `appearance-decorations.png` | Decorations page: preview dengan beberapa stiker + palette | P2 |
| `settings` | `settings.png` | Settings page lengkap | P2 |
| `updates` | `updates-available.png` | Changelog page dengan kartu **Rezure X.Y.Z is available** + **Update** | P2 |

## Landing page

- Hero saat ini memakai **ilustrasi** daftar service (bukan screenshot) di `index.md` → `services:`.
  Kalau mau diganti screenshot asli: ambil `services-overview.png` versi **Dark** + tema default,
  lalu ganti blok `app-frame` di `.vitepress/theme/Landing.vue`.
- `public/og-image.png` (1200×630) bisa diperbarui dengan screenshot Services page.

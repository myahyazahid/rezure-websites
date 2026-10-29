---
title: Port Default untuk Nginx, PHP, MariaDB, PostgreSQL, Mailpit
description: 'Setiap port yang dipakai Rezure di Windows (Nginx, PHP, MariaDB, PostgreSQL, LocalDB, Mailpit, dan dev server) dan mana yang bisa dijangkau dari jaringanmu.'
---

# Port

| Port | Layanan | Mendengarkan di | Catatan |
| --- | --- | --- | --- |
| **80** | Nginx | Semua interface | Situs setiap proyek, `http://<nama>.test` |
| **9100–9103** | PHP (versi global) | `127.0.0.1` | 4 worker FastCGI |
| **9110–9113**, **9120–9123**, … | PHP x.y.z (versi yang dikunci) | `127.0.0.1` | Satu blok sepuluh per versi tambahan; masing-masing 4 worker |
| **3306** | MariaDB / MySQL | `127.0.0.1` | Profil direktori data yang ditambahkan manual bisa memakai port lain |
| **5432** | PostgreSQL | `127.0.0.1` | |
| tidak ada | SQL Server LocalDB | named pipe | Diakses sebagai `(localdb)\Rezure`, tanpa port TCP |
| **14330** | Bridge LocalDB | `127.0.0.1` | Relay TCP ke LocalDB untuk client GUI, login `rezure` |
| **1025** | SMTP Mailpit | `127.0.0.1` | Tujuan email yang dikirim proyek |
| **8025** | Inbox Mailpit | `127.0.0.1` | `http://127.0.0.1:8025` |
| **4400–4499** | Dev server | Tergantung dev server | Satu port per proyek JavaScript atau Node, tetap setelah diberikan. Lihat [Dev Server](/id/guide/dev-servers) |
| acak | SSH tunnel | `127.0.0.1` | Satu port kosong per [koneksi remote](/id/guide/remote-databases) lewat tunnel |
| acak | Proxy berbagi | `127.0.0.1` | Di antara tunnel Cloudflare dan Nginx selama proyek [dibagikan](/id/guide/sharing) |

## Kenapa angka-angka ini {#why-these-numbers}

- **PHP mulai dari 9100**, bukan 9000 yang biasa, supaya tidak bentrok dengan PHP yang dijalankan
  Laragon dan XAMPP di 9000, dan port 9003 tetap bebas untuk Xdebug.
- Setiap versi PHP memegang blok port-nya selama berjalan, jadi mengunci atau melepas kunci satu
  proyek tidak pernah memindahkan worker versi lain.
- **Dev server mendapat port dari 4400–4499**, rentang yang tidak dipakai default framework yang
  umum (3000 untuk Next.js, 4200 untuk Angular, 4321 untuk Astro, 5173 untuk Vite). Sebuah proyek
  tetap memegang port-nya, jadi domain `.test`-nya selalu sampai ke tempat yang sama. Port yang kamu
  atur sendiri boleh apa saja dari 1024 sampai 65535 yang tidak dipakai proyek lain atau layanan
  Rezure.

## Apa yang bisa dijangkau dari jaringanmu {#what-s-reachable-from-your-network}

Semua kecuali Nginx hanya mendengarkan di `127.0.0.1`, jadi database, PHP, dan Mailpit tidak bisa
dijangkau dari perangkat lain, apa pun pengaturan firewall-mu. Dev server mendengarkan di mana pun
framework-nya menentukan; Vite, Next.js, dan kebanyakan lainnya default-nya hanya `localhost`.

**Nginx mendengarkan di semua interface pada port 80.** Kalau Windows Firewall mengizinkan (Windows
mungkin bertanya saat Nginx pertama kali berjalan), perangkat lain di jaringan yang sama bisa
menyambung ke Nginx di PC-mu, dan lewat itu ke proyek-proyekmu. Di jaringan yang tidak kamu
percaya, jawab prompt itu dengan **Cancel**, atau izinkan hanya **Private networks**. Untuk
menunjukkan situs ke orang di tempat lain, pakai [Share](/id/guide/sharing).

## Saat sebuah port terpakai {#when-a-port-is-taken}

Rezure mengecek setiap port sebelum menjalankan layanan dan menyebut apa yang memakainya. Lihat
[Konflik Port](/id/guide/port-conflicts).

## Terkait {#related}

- [Layanan](/id/guide/services): setiap layanan secara detail
- [File & Folder](/id/guide/files-and-folders): di mana semuanya disimpan di disk

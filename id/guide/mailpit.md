---
title: "Mailpit di Windows: Tangkap Email Laravel dan PHP Lokal"
description: 'Tangkap setiap email yang dikirim proyek PHP atau Laravel lokalmu dengan Mailpit di Rezure: pemasangan, pengaturan .env, dan inbox di 127.0.0.1:8025.'
---

# Mailpit

[Mailpit](https://mailpit.axllent.org/) adalah penangkap email lokal. Arahkan proyek ke sana dan
setiap email yang dikirim proyek (reset password, konfirmasi pesanan, notifikasi) masuk ke inbox
web di mesinmu, bukan ke kotak masuk orang sungguhan. Tidak ada yang keluar dari PC-mu.

## Memasang dan menjalankan {#install-and-start}

Di halaman [Layanan](/id/guide/services), klik **Install** di baris **Mailpit**, lalu **Start**.
(Juga ada di **Switch → Install version → Mailpit**.) Rezure membawa satu versi yang dikunci, sudah
diverifikasi checksum-nya.

| | |
| --- | --- |
| Server SMTP | `127.0.0.1:1025` |
| Inbox web | `http://127.0.0.1:8025` |
| Login | Username dan password apa pun diterima, atau tanpa login |
| Email tersimpan | `C:\rezure\data\mailpit\mailpit.db`, tetap ada setelah restart |

Selama berjalan, tombol **Open** di barisnya membuka inbox.

## Mengarahkan proyek Laravel ke sana {#point-a-laravel-project-at-it}

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@myapp.test"
MAIL_FROM_NAME="${APP_NAME}"
```

Lalu bersihkan cache konfigurasi Laravel kalau kamu meng-cache-nya (`php artisan config:clear`),
dan kirim email. Email itu muncul di inbox dalam hitungan detik.

Dua nilai yang sering bikin keliru, keduanya terdeteksi oleh
[Cek Kebutuhan](/id/guide/requirements-check) proyek:

- **`MAIL_HOST=mailpit`** adalah hostname Docker milik Laravel Sail. Tidak ada di luar Docker;
  pakai `127.0.0.1`.
- **`MAIL_PORT=2525`** adalah nilai di `.env` default Laravel. Mailpit mendengarkan di **1025**.

Kalau Mailpit tidak berjalan, Cek Kebutuhan menawarkan **Start Mailpit** (atau **Install and start
Mailpit**).

## Proyek PHP lain {#other-php-projects}

Apa pun yang mengirim email lewat SMTP bekerja dengan cara yang sama: host `127.0.0.1`, port
`1025`, tanpa enkripsi, kredensial apa pun atau tanpa kredensial.

- **WordPress**: plugin SMTP (misalnya WP Mail SMTP) dengan pengaturan itu.
- **PHP biasa dengan PHPMailer atau Symfony Mailer**: host dan port yang sama.

Fungsi bawaan PHP `mail()` di Windows mengirim lewat pengaturan `SMTP` dan `smtp_port`. Untuk ikut
menangkapnya, tambahkan file `.ini` ke `C:\rezure\etc\php\conf.d` (lihat
[Konfigurasi PHP](/id/guide/php-configuration#your-php-settings)) lalu restart PHP:

```ini
SMTP = 127.0.0.1
smtp_port = 1025
sendmail_from = hello@myapp.test
```

## Terkait {#related}

- [Contekan .env Laravel](/id/guide/laravel-env): nilai email dan database sekaligus
- [Layanan](/id/guide/services): menjalankan dan menghentikan Mailpit
- [Port](/id/guide/ports): 1025 dan 8025 bersama yang lainnya

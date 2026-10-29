---
title: Pembaruan dan Changelog
description: Cara Rezure mengecek dan memasang pembaruan, cara pembaruan ditandatangani dan diverifikasi, apa yang ditampilkan halaman Changelog, dan cara versi major baru diumumkan.
---

# Pembaruan dan Changelog

Rezure memperbarui dirinya sendiri dari dalam aplikasi. Kamu tidak perlu mengunduh installer baru
untuk setiap rilis.

## Cara kamu tahu {#how-you-find-out}

Rezure mengecek pembaruan **sekali saat dijalankan**, dan lagi setiap kali kamu membuka halaman
**Changelog**. Rezure tidak terus mengecek di latar belakang selama terbuka.

Saat ada pembaruan, titik merah muncul di **Changelog** pada sidebar. Tidak ada pop-up.

## Memasang pembaruan {#install-an-update}

1. Buka **Changelog**. Selama mengecek, halaman menampilkan "Checking for updates…".
2. Sebuah kartu bertuliskan **Rezure X.Y.Z is available**. Klik **Update**.
3. Tombolnya berubah menjadi **Downloading…** dengan progress bar.
4. Installer berjalan, lalu Rezure dibuka ulang di versi baru.

Sebelum memasang, selesaikan dulu apa pun yang sedang kamu kerjakan: pembaruan me-restart aplikasi,
dan restart menghentikan layananmu. Proyek, database, dan pengaturanmu di `C:\rezure` tidak
disentuh.

Kalau unduhan gagal, error-nya ditampilkan di kartu; klik **Update** untuk mencoba lagi. Kalau
**pengecekan** yang gagal, misalnya karena offline, tidak ada yang ditampilkan sama sekali, jadi
terlihat sama seperti "tidak ada pembaruan". Buka Changelog lagi setelah kembali online.

## Cara pembaruan diverifikasi {#how-updates-are-verified}

- Setiap pembaruan **ditandatangani**. Public key-nya tertanam di aplikasi, dan pembaruan yang tanda
  tangannya tidak cocok (ditandatangani key lain, atau diubah setelah ditandatangani) diunduh tetapi
  **ditolak**.
- Pembaruan harus berupa **versi yang lebih baru** dari yang kamu punya. Rezure tidak pernah
  memasang build yang lebih lama lewat updater.
- Pengecekan pembaruan adalah request biasa berisi versi, platform, dan arsitektur saat ini. Tidak
  membawa ID perangkat dan tidak membawa data pemakaian.

Untuk sengaja kembali ke versi sebelumnya, unduh installer-nya dari
[halaman rilis GitHub](https://github.com/myahyazahid/rezure/releases) lalu jalankan di atas
instalasimu. Lihat [Unduh](/id/download#previous-versions).

## Versi major baru {#new-major-versions}

Updater tetap di dalam **versi major**-mu: Rezure 3.x hanya diperbarui ke rilis 3.x yang lebih baru.

Saat versi major baru keluar, halaman Changelog menampilkan banner: **Rezure v4 is out**, dengan
pesan singkat dan **Learn more**. **Learn more** membuka situs web di browser-mu; tidak pernah
mengunduh atau memasang apa pun. Pindah ke versi major baru selalu pilihanmu.

## Halaman Changelog {#the-changelog-page}

"What's new in Rezure, release by release." Setiap entri punya judul, versi, dan tanggal rilis,
yang terbaru di atas, sepuluh per halaman (**Newer** / **Older**).

Entri diambil dari server Rezure dan disimpan secara lokal, jadi halaman tetap menampilkan salinan
terakhir saat offline. Membuka halaman menandai entri terbaru sebagai sudah dilihat, yang
menghilangkan titik di sidebar.

## Terkait {#related}

- [Unduh](/id/download): installer dan checksum
- [Privasi & Data Penggunaan](/id/guide/privacy): apa yang dikirim Rezure, dan apa yang tidak

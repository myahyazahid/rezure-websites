---
title: Bagikan Situs Lokal secara Publik dengan Cloudflare Tunnel
description: Bagikan proyek Rezure lokal ke internet untuk sementara dengan satu klik, memakai Cloudflare Quick Tunnel. Tanpa akun, tanpa setup manual.
---

# Berbagi Proyek secara Publik

Rezure bisa membuka akses proyek lokal yang sedang berjalan ke internet untuk waktu singkat: demo
untuk klien, cek cepat di ponsel, atau link untuk rekan tim yang tidak ada di jaringanmu. Satu
klik di halaman **Projects** memulai **Cloudflare Quick Tunnel** dan memberimu link
`https://…trycloudflare.com` yang bisa kamu salin dan kirim.

Tanpa akun Cloudflare, tanpa file konfigurasi tunnel, dan tanpa port forwarding di router.

## Sebelum berbagi {#before-you-share}

Pastikan dasar-dasarnya sudah berjalan secara lokal:

1. **Nginx berjalan** di halaman **Services**. Tunnel meneruskan trafik ke stack lokalmu; kalau
   Nginx tidak menyala, link publiknya tidak punya tujuan.
2. **Proyek bisa dibuka secara lokal**: klik **Open** di baris proyek dan pastikan `myapp.test`
   (atau domain apa pun yang diberikan Rezure) termuat di browser.
3. **Kamu punya akses internet.** Rezure berkomunikasi dengan edge Cloudflare untuk membuka tunnel.

Itu saja. Proyek PHP butuh layanan PHP-nya berjalan, dan database hanya penting kalau halaman yang
kamu bagikan membutuhkannya, sama seperti saat browsing lokal.

Proyek JavaScript dan Node dibagikan dengan cara yang sama: tunnel melewati Nginx ke
[dev server](/id/guide/dev-servers) proyek, jadi jalankan dulu (klik **Open**) dan biarkan
berjalan selama link-nya dipakai.

## Cara berbagi {#how-to-share}

1. Buka halaman **Projects**.
2. Cari proyeknya dan klik ikon **Share** ("Share this project publicly (Cloudflare Quick
   Tunnel)").
3. Berbagi langsung dimulai dan sebuah modal menampilkan progresnya: "Setting up your project…",
   "Starting the tunnel…", "Almost done…". Saat pertama kali berbagi di sebuah mesin, Rezure juga
   mengunduh binary `cloudflared`; itu bisa butuh beberapa detik.
4. Saat tunnel siap, modal menampilkan URL publik seperti
   `https://random-words-here.trycloudflare.com`. Klik **Copy** dan kirim ke siapa pun yang butuh
   akses.
5. Klik **Stop sharing** setelah selesai, atau **Close** modal-nya dan hentikan nanti dari ikon
   yang sama.

Selama berbagi aktif, ikon Share terisi warna aksen. Klik lagi kapan saja untuk membuka kembali
modal dan menyalin link. Kamu bisa membagikan beberapa proyek sekaligus; masing-masing mendapat
link sendiri.

## Apa yang dilihat penerima {#what-recipients-see}

Siapa pun yang punya link bisa membuka proyekmu di browser biasa selama berbagi masih aktif.
Mereka **tidak** butuh Rezure, Wi‑Fi-mu, atau domain `.test` di mesinnya; URL tunnel adalah alamat
lengkapnya.

**Link baru bisa butuh sampai satu menit** sebelum merespons dari perangkat atau jaringan lain.
Kalau pemuatan pertama gagal, tunggu sebentar lalu coba lagi.

## Setup pertama kali {#first-time-setup}

Berbagi pertama di instalasi baru memicu unduhan sekali saja untuk tool `cloudflared` dari
Cloudflare. Rezure memverifikasi file itu dengan checksum SHA-256 sebelum memakainya.

Binary-nya disimpan di:

```
C:\rezure\bin\cloudflared\<version>\cloudflared.exe
```

Setelah itu, memulai berbagi biasanya hanya butuh beberapa detik, kebanyakan untuk menunggu
Cloudflare mengembalikan URL publik.

## Cara kerjanya (singkat) {#how-it-works-briefly}

Di balik tombol itu, Rezure:

1. Menjalankan proxy lokal kecil yang meneruskan request ke Nginx dengan header `Host` yang benar
   untuk domain `.test` proyekmu.
2. Menjalankan `cloudflared tunnel --url …` terhadap proxy itu.
3. Cloudflare mengembalikan URL publik acak `https://*.trycloudflare.com` dan mengarahkan trafik
   HTTPS yang masuk kembali ke mesinmu.

Framework sering membangun URL absolut dari domain lokal, dan `myapp.test` tidak berarti apa-apa
di komputer orang lain. Jadi dalam perjalanan balik, proxy menulis ulang URL itu ke URL tunnel:

- **Redirect**: header `Location: http://myapp.test/login` mengirim browser ke
  `https://<tunnel>/login`.
- **Konten halaman**: di respons HTML, CSS, JavaScript, JSON, plain text, dan SVG, setiap
  `http://myapp.test`, `https://myapp.test`, dan `myapp.test` polos menjadi alamat `https://`
  milik tunnel. Itulah yang menjaga link aset Vite milik Laravel dan URL absolut serupa tetap
  berfungsi bagi pengunjung.

Gambar, font, dan file biner lainnya diteruskan apa adanya.

Saat kamu berhenti berbagi atau keluar dari Rezure, proses tunnel dihentikan. Tidak ada yang terus
mem-proxy setelah itu.

## Batasan {#limitations}

Berbagi dimaksudkan untuk **pemakaian pengembangan lokal yang sementara**, bukan untuk meng-host
situs produksi.

- **URL-nya berubah** setiap kali kamu memulai berbagi baru. Quick Tunnel tidak memberi hostname
  tetap.
- **Berbagi berhenti** saat kamu mengklik **Stop sharing** atau saat Rezure keluar.
- **Respons dikirim utuh.** Proxy membaca setiap respons sampai selesai sebelum meneruskannya, jadi
  respons streaming (server-sent events, unduhan panjang yang melaporkan progres) datang sekaligus,
  dan koneksi WebSocket tidak bisa lewat.
- **Cookie yang terikat ke domain `.test`** tidak ditulis ulang. Login yang mengatur cookie untuk
  `myapp.test` secara eksplisit mungkin tidak bertahan bagi pengunjung; cookie tanpa domain tetap
  bekerja.
- **Trafik melewati layanan Quick Tunnel gratis dari Cloudflare**, tunduk pada batas dan
  ketersediaan Cloudflare sendiri.
- **Ini bukan hosting produksi yang diperkuat.** Jangan buka akses ke data sensitif, panel admin
  tanpa autentikasi, atau apa pun yang tidak kamu percayakan di mesin dev yang bisa diakses dari
  internet.
- Rezure **tidak** membuka port database apa pun ke publik; hanya proyek web yang kamu bagikan.

Untuk deployment publik permanen, pakai hosting dan pipeline deploy yang semestinya.

## Pemecahan masalah {#troubleshooting}

### Modal lama tertahan di "Starting the tunnel…" {#the-modal-stays-on-starting-the-tunnel-for-a-long-time}

Saat berbagi pertama kali, Rezure mungkin masih mengunduh `cloudflared`. Beri waktu sampai
setengah menit di koneksi yang lambat.

Kalau tidak pernah selesai, cek bahwa tidak ada yang memblokir HTTPS keluar (firewall, proxy
kantor, Wi‑Fi yang offline). Rezure menyerah setelah 20 detik tanpa URL dan menampilkan bagian
akhir log `cloudflared`.

### Error menyebut `cloudflared exited immediately` {#an-error-mentions-cloudflared-exited-immediately}

Biasanya tidak ada rute ke internet, atau edge Cloudflare tidak bisa dijangkau dari jaringanmu.
Perbaiki koneksi lalu coba lagi.

### Pengunjung melihat "share proxy error … couldn't reach nginx" {#visitors-see-share-proxy-error-couldn-t-reach-nginx}

Nginx berhenti setelah berbagi dimulai. Jalankan lagi di halaman **Services**; link-nya kembali
berfungsi begitu Nginx menyala.

### Berbagi sudah dimulai tetapi link tidak termuat dari ponselku {#a-share-started-but-the-link-doesn-t-load-from-my-phone}

Tunggu sampai satu menit: URL Quick Tunnel kadang butuh waktu sebentar untuk tersebar. Pastikan
Nginx masih berjalan dan proyek masih termuat secara lokal lewat **Open**.

### Modal sudah kututup tetapi berbagi masih aktif {#i-closed-the-modal-but-sharing-is-still-on}

Itu memang begitu. Menutup modal hanya menyembunyikannya. Tunnel terus berjalan sampai kamu
mengklik **Stop sharing** atau keluar dari Rezure. Ikon Share yang terisi berarti tunnel masih
aktif; klik untuk membuka lagi link-nya atau menghentikannya.

### Halaman Projects kumuat ulang dan ikonnya masih terisi {#i-reloaded-the-projects-page-and-the-icon-is-still-filled}

Rezure memulihkan status berbagi yang aktif setelah reload, jadi kamu tidak kehilangan tunnel yang
sedang berjalan hanya karena UI diperbarui.

## Terkait {#related}

- [Pertama Kali Dijalankan](/id/guide/first-run): jalankan layanan dan sajikan proyek secara lokal dulu
- [Proyek](/id/guide/projects): semua aksi proyek lainnya
- [FAQ](/id/guide/faq): port, izin, dan apa saja yang dipasang Rezure

# Website Content Structure: Rezure

Dokumen ini merangkum struktur konten untuk `rezure-website`, situs resmi Rezure (marketing, download, docs, dan hub komunitas).

---

## 1. Homepage

- **Hero section**: nama "Rezure", tagline singkat, tombol utama **Download** + tombol sekunder **View on GitHub**
- **Screenshot/demo** aplikasi
- **Fitur unggulan**: 4-6 poin singkat dengan icon (one-click service manager, auto virtual host, PHP version switcher, dll)
- **Kenapa Rezure** (opsional): perbandingan singkat dengan Laragon, fokus ke perbedaan/nilai tambah tanpa terkesan menjelekkan
- **Social proof** (opsional): angka active users dari API, atau badge GitHub stars

---

## 2. Download

- Tombol download versi terbaru (data diambil dari `GET /api/v1/version/latest`)
- Requirement sistem (Windows 10/11, dll)
- Link ke versi-versi sebelumnya (untuk kebutuhan downgrade)
- Checksum/hash file installer (untuk verifikasi keamanan)

---

## 3. Docs / Documentation

- **Getting Started**: instalasi, first run
- **Guides**: cara pakai tiap fitur (service manager, virtual host, PHP switcher, quick app installer)
- **FAQ**: troubleshooting umum (port conflict, permission error, dll), versi end-user (bukan versi kontributor seperti `docs/setup-dev.md` di repo app)
- **Search**: fitur pencarian docs (built-in jika pakai VitePress)

---

## 4. Changelog

- Menampilkan data dari endpoint `GET /api/v1/changelog`
- Sinkron otomatis dengan changelog yang tampil di dalam aplikasi Rezure: satu sumber data, tidak perlu ditulis dua kali

---

## 5. Community / Contribute

- Link ke GitHub repo
- Ringkasan cara kontribusi, mengarahkan ke `CONTRIBUTING.md` di repo `rezure`
- Link Discord/Discussions (jika sudah tersedia)
- **Report a bug / Send feedback**: form web yang memanggil endpoint `POST /api/v1/support/tickets`, sehingga ticket dari website dan dari aplikasi masuk ke dashboard yang sama

---

## 6. About / Roadmap

- Cerita singkat latar belakang dibuatnya Rezure
- Highlight rencana ke depan: versi ringkas dari roadmap project, tanpa detail teknis internal

---

## Prioritas untuk v1 (Launch Awal)

Bagian yang wajib ada sejak awal:
1. Home
2. Download
3. Docs (minimal Getting Started)

Bagian yang bisa menyusul setelah backend (`rezure-dashboard`) v2 siap:
4. Changelog
5. Community (khususnya form Report Bug/Feedback)
6. About / Roadmap

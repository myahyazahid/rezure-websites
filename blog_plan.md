# Rezure Blog — Architecture & Concept

> Dokumen ini menjelaskan arsitektur, konsep, dan alur kerja blog pada website Rezure.
> Dibuat untuk referensi internal pengembangan.

---

## Konsep Utama

Blog Rezure adalah **fully static blog** yang di-generate saat build time oleh VitePress.
Website tidak pernah fetch API saat runtime — semua konten sudah jadi HTML statis.

**Prinsip dasar:**

- ✅ Website 100% static HTML — zero API dependency at runtime
- ✅ SEO top-tier — setiap post jadi halaman HTML lengkap dengan meta tags & JSON-LD
- ✅ Resilient — API mati tidak berdampak pada website yang sudah live
- ✅ Fast — static pages = excellent Core Web Vitals & page load

---

## Arsitektur

```
┌──────────────────────┐
│   Rezure Dashboard   │
│  api.redscale.my.id  │
│                      │
│  Admin membuat/edit/ │
│  hapus/unpublish     │
│  blog posts          │
└──────────┬───────────┘
           │
           │ POST /repos/.../dispatches
           │ (GitHub repository_dispatch)
           ▼
┌──────────────────────┐
│   GitHub Actions     │
│                      │
│ 1. Fetch published   │
│    posts dari API    │
│ 2. Simpan ke         │
│    blog-data.json    │
│ 3. npm run docs:build│
│ 4. Commit & push ke  │
│    branch deploy     │
└──────────┬───────────┘
           │
           │ auto pull / deploy
           ▼
┌──────────────────────┐
│  Production Server   │
│                      │
│  /blog/              │
│    index.html        │
│    posts/            │
│      getting-started │
│        .html         │
│      php-switching   │
│        .html         │
│      ...             │
│                      │
│  100% Static HTML    │
└──────────────────────┘
```

---

## Alur Kerja

### Membuat / Edit Post

1. Admin buat atau edit blog post di dashboard `api.redscale.my.id`
2. Dashboard memanggil GitHub API untuk trigger rebuild (`repository_dispatch`)
3. GitHub Actions workflow berjalan:
   - Fetch semua published posts dari API (`GET /api/v1/blogs?status=published`)
   - Simpan response sebagai `blog-data.json` di repo (cache/fallback)
   - Jalankan `npm run docs:build` — VitePress membaca `blog-data.json`
   - VitePress generate satu halaman `.html` per post via dynamic routes (`[slug].paths.ts`)
   - Commit & push hasil build ke branch deploy
4. Server production auto-pull branch deploy
5. Website ter-update dengan konten terbaru

### Menghapus Post

1. Admin hapus blog post di dashboard
2. Dashboard trigger rebuild ke GitHub Actions
3. GitHub Actions fetch published posts — post yang dihapus **tidak ada** di response
4. VitePress build — **tidak generate halaman** untuk post yang sudah dihapus
5. URL lama post tersebut otomatis return **404**

### Unpublish Post

1. Admin ubah status post menjadi "draft" di dashboard
2. Sama seperti delete — post draft **tidak muncul** di response `?status=published`
3. Halaman post tersebut hilang dari website, URL return **404**

### Re-publish Post

1. Admin ubah status post kembali menjadi "published"
2. Trigger rebuild — post muncul kembali di API response
3. Halaman post di-generate kembali di build berikutnya

> **Kesimpulan:** Semua operasi (create/edit/delete/unpublish/re-publish) menghasilkan
> flow yang sama — trigger rebuild. VitePress hanya generate halaman untuk posts yang
> ada di `blog-data.json`. Tidak perlu logic khusus untuk handle delete/unpublish.

---

## Post Lifecycle

| Operasi di Dashboard     | Apa yang terjadi di website                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **Create** (published)   | Halaman baru muncul di build berikutnya                                            |
| **Edit** post            | Konten halaman di-update di build berikutnya                                       |
| **Delete** post          | Post hilang dari API → halaman tidak di-generate → URL return 404                  |
| **Unpublish** (→ draft)  | Sama seperti delete — post tidak di response published → halaman hilang → URL 404  |
| **Re-publish** (→ live)  | Post muncul kembali di API → halaman di-generate lagi                              |

---

## Ketahanan (Resilience)

| Skenario                          | Apa yang terjadi                                                |
| --------------------------------- | --------------------------------------------------------------- |
| API hidup saat build              | Fetch fresh data, update cache `blog-data.json`, build normal   |
| API mati saat build               | Pakai `blog-data.json` cache terakhir, build tetap jalan        |
| API mati saat user buka website   | Tidak masalah — website 100% static HTML                        |
| Post dihapus di dashboard         | Rebuild → halaman hilang → URL return 404                       |
| Post di-unpublish di dashboard    | Sama — tidak ada di API response → halaman hilang               |

**Mekanisme cache:**

- File `blog-data.json` disimpan di root repo
- Setiap kali build berhasil fetch dari API, file ini di-update
- Jika fetch gagal (API down), build tetap jalan pakai data cache terakhir
- File ini di-commit ke repo, jadi selalu ada data yang tersedia

---

## SEO Strategy

Setiap halaman blog post di-generate sebagai static HTML dengan:

- `<title>` unik per post: `"Judul Post | Rezure Blog"`
- `<meta name="description">` dari excerpt post
- **Open Graph tags**: `og:title`, `og:description`, `og:image`, `og:type=article`,
  `og:article:published_time`, `og:article:tag`
- **Twitter Card**: `summary_large_image` dengan gambar post
- **JSON-LD `Article` schema**: author, datePublished, dateModified, headline, image, publisher
- **JSON-LD `BreadcrumbList`**: Home → Blog → Post Title
- **Canonical URL**: `<link rel="canonical">`
- **Sitemap**: Semua blog URL otomatis masuk `/sitemap.xml` oleh VitePress
- **Clean URLs**: `/blog/posts/getting-started` (tanpa `.html`)
- **Semantic HTML**: `<article>`, `<h1>`, `<time>`, `<nav>` untuk breadcrumb
- **Core Web Vitals**: Static HTML = instan load, excellent LCP/FID/CLS

---

## Struktur File

```
rezure_websites/
├── blog-data.json                          # Cache data blog dari API
├── blog/
│   ├── index.md                            # Blog listing page (layout: BlogList)
│   └── posts/
│       ├── [slug].md                       # Dynamic route template (layout: BlogPost)
│       └── [slug].paths.ts                 # Build-time: baca blog-data.json → generate paths
├── .vitepress/
│   ├── config.mts                          # Navbar + SEO config
│   └── theme/
│       ├── index.ts                        # Register BlogList & BlogPost components
│       ├── BlogList.vue                    # Blog listing layout
│       └── BlogPost.vue                    # Blog detail layout
├── .github/
│   └── workflows/
│       └── build-blog.yml                  # CI/CD workflow
├── blog.md                                 # API spec documentation
└── blog_plan.md                            # Dokumen ini
```

---

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/build-blog.yml`)

**Triggers:**

| Trigger                | Kapan                                      |
| ---------------------- | ------------------------------------------ |
| `repository_dispatch`  | Dashboard trigger setelah operasi blog      |
| `workflow_dispatch`    | Manual trigger dari GitHub UI               |
| `push` ke `main`       | Perubahan kode/konten di-push ke main       |

**Steps:**

1. Checkout repo
2. Fetch blog data dari API → simpan ke `blog-data.json`
3. Fallback ke cache jika fetch gagal
4. Setup Node.js
5. `npm ci`
6. `npm run docs:build`
7. Commit & push ke branch deploy

### Trigger dari Dashboard (Laravel)

Dashboard perlu memanggil GitHub API setelah setiap operasi blog (create/update/delete/publish/unpublish):

```php
private function triggerWebsiteRebuild(string $action, string $slug): void
{
    Http::withToken(config('services.github.token'))
        ->post('https://api.github.com/repos/myahyazahid/rezure-websites/dispatches', [
            'event_type' => 'blog-updated',
            'client_payload' => [
                'action' => $action,
                'slug'   => $slug,
            ],
        ]);
}
```

**Requires:** GitHub Personal Access Token dengan scope `repo` disimpan di config Laravel sebagai `services.github.token`.

---

## Tech Stack

| Layer          | Teknologi                      |
| -------------- | ------------------------------ |
| Static site    | VitePress (Vue 3 + Vite)       |
| Blog CMS       | Rezure Dashboard (Laravel)     |
| API            | Laravel REST API               |
| CI/CD          | GitHub Actions                 |
| Hosting        | Self-hosted (auto-pull branch) |

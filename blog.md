# Blog API Specification

> Dokumen ini mendefinisikan endpoint API yang dibutuhkan oleh website Rezure untuk menampilkan blog.
> Backend diimplementasikan di Rezure Dashboard (`api.redscale.my.id`).
>
> Untuk konsep dan arsitektur lengkap, lihat [blog_plan.md](./blog_plan.md).

---

## Base URL

```
https://api.redscale.my.id/api/v1
```

---

## Endpoints

### 1. List Published Blog Posts

Digunakan oleh VitePress saat build time untuk generate semua halaman blog.

```
GET /api/v1/blogs
```

**Query Parameters:**

| Parameter  | Type    | Default | Description                                      |
| ---------- | ------- | ------- | ------------------------------------------------ |
| `per_page` | integer | `100`   | Jumlah post per halaman. Untuk build, pakai `100` |
| `page`     | integer | `1`     | Halaman pagination                                |

> **Catatan:** Endpoint ini hanya mengembalikan post dengan `status = published`.
> Post draft, unpublished, atau deleted **tidak boleh** muncul di response ini.

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Rezure",
      "slug": "getting-started-with-rezure",
      "excerpt": "Learn how to set up your local development environment with Rezure in under five minutes.",
      "content": "<h2>Introduction</h2><p>Rezure makes it easy to...</p>",
      "tags": ["tutorial", "getting-started"],
      "featured_image": "https://api.redscale.my.id/storage/blog/getting-started-cover.jpg",
      "status": "published",
      "published_at": "2026-09-15T10:00:00Z",
      "updated_at": "2026-09-16T08:30:00Z",
      "author": {
        "name": "Muhammad Yahya Zahid",
        "avatar": "https://github.com/myahyazahid.png"
      }
    },
    {
      "id": 2,
      "title": "Switching PHP Versions Per Project",
      "slug": "switching-php-versions-per-project",
      "excerpt": "How to run different PHP versions for different projects simultaneously.",
      "content": "<h2>Why per-project PHP?</h2><p>...</p>",
      "tags": ["tutorial", "php"],
      "featured_image": null,
      "status": "published",
      "published_at": "2026-09-18T14:00:00Z",
      "updated_at": "2026-09-18T14:00:00Z",
      "author": {
        "name": "Muhammad Yahya Zahid",
        "avatar": "https://github.com/myahyazahid.png"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 100,
    "total": 2
  }
}
```

**Response saat tidak ada posts:**

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 100,
    "total": 0
  }
}
```

---

## Data Model

### BlogPost

| Field             | Type        | Nullable | Description                                                          |
| ----------------- | ----------- | -------- | -------------------------------------------------------------------- |
| `id`              | integer     | No       | Primary key, auto-increment                                         |
| `title`           | string      | No       | Judul blog post                                                      |
| `slug`            | string      | No       | URL-friendly identifier, unique. Contoh: `getting-started-with-rezure` |
| `excerpt`         | string      | No       | Ringkasan singkat post (1-2 kalimat), dipakai untuk meta description |
| `content`         | text (HTML) | No       | Konten lengkap post dalam format HTML                                |
| `tags`            | string[]    | Yes      | Array tag, contoh: `["tutorial", "php"]`. Boleh kosong `[]`         |
| `featured_image`  | string      | Yes      | URL gambar utama. `null` jika tidak ada                              |
| `status`          | enum        | No       | `"published"` atau `"draft"`                                        |
| `published_at`    | datetime    | Yes      | ISO 8601. `null` jika belum pernah dipublish                        |
| `updated_at`      | datetime    | No       | ISO 8601. Terakhir diupdate                                         |
| `author.name`     | string      | No       | Nama penulis                                                         |
| `author.avatar`   | string      | Yes      | URL avatar penulis. `null` jika tidak ada                            |

### Catatan Penting

- **`slug`** harus unique dan URL-safe (huruf kecil, angka, strip). Contoh: `my-first-post`
- **`content`** harus HTML yang sudah di-render (bukan raw markdown). VitePress akan menampilkan langsung sebagai `v-html`
- **`excerpt`** dipakai untuk:
  - `<meta name="description">` (SEO)
  - Card preview di halaman blog listing
  - Open Graph `og:description`
- **`featured_image`** dipakai untuk:
  - Card preview di listing
  - Open Graph `og:image`
  - Jika `null`, website akan pakai default OG image Rezure
- **`status`** — endpoint public **hanya return `published`**. Post `draft` hanya visible di dashboard admin

---

## Laravel Migration (Contoh)

```php
Schema::create('blog_posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('excerpt');
    $table->longText('content');
    $table->json('tags')->nullable();
    $table->string('featured_image')->nullable();
    $table->enum('status', ['published', 'draft'])->default('draft');
    $table->timestamp('published_at')->nullable();
    $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index('status');
    $table->index('published_at');
});
```

---

## Laravel API Resource (Contoh)

```php
// app/Http/Resources/BlogPostResource.php
class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'excerpt'        => $this->excerpt,
            'content'        => $this->content,
            'tags'           => $this->tags ?? [],
            'featured_image' => $this->featured_image
                ? Storage::url($this->featured_image)
                : null,
            'status'         => $this->status,
            'published_at'   => $this->published_at?->toIso8601String(),
            'updated_at'     => $this->updated_at->toIso8601String(),
            'author'         => [
                'name'   => $this->author->name,
                'avatar' => $this->author->avatar_url,
            ],
        ];
    }
}
```

---

## Laravel Controller (Contoh)

```php
// app/Http/Controllers/Api/BlogController.php
class BlogController extends Controller
{
    /**
     * Public endpoint — hanya return published posts.
     * Digunakan oleh VitePress saat build time.
     */
    public function index(Request $request)
    {
        $posts = BlogPost::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate($request->integer('per_page', 100));

        return BlogPostResource::collection($posts);
    }
}
```

---

## Webhook — Trigger Website Rebuild

Setelah **setiap operasi blog** di dashboard (create, update, delete, publish, unpublish),
panggil GitHub API untuk trigger rebuild website.

### Implementasi

```php
// app/Services/BlogWebhookService.php

class BlogWebhookService
{
    /**
     * Trigger VitePress rebuild via GitHub Actions repository_dispatch.
     *
     * @param string $action  'created' | 'updated' | 'deleted' | 'published' | 'unpublished'
     * @param string $slug    Slug post yang berubah
     */
    public function triggerWebsiteRebuild(string $action, string $slug): void
    {
        Http::withToken(config('services.github.token'))
            ->post('https://api.github.com/repos/myahyazahid/rezure-websites/dispatches', [
                'event_type'     => 'blog-updated',
                'client_payload' => [
                    'action' => $action,
                    'slug'   => $slug,
                ],
            ]);
    }
}
```

### Kapan Dipanggil

| Operasi di Dashboard          | Action string     | Efek di website                       |
| ----------------------------- | ----------------- | ------------------------------------- |
| Buat post baru (published)    | `'created'`       | Halaman baru di-generate              |
| Edit post                     | `'updated'`       | Konten halaman di-update              |
| Hapus post                    | `'deleted'`       | Halaman dihapus, URL return 404       |
| Ubah status → draft           | `'unpublished'`   | Halaman dihapus, URL return 404       |
| Ubah status → published       | `'published'`     | Halaman di-generate (kembali)         |

### Contoh Penggunaan di Controller

```php
// Dalam BlogController (admin)

public function store(StoreBlogRequest $request)
{
    $post = BlogPost::create($request->validated());

    if ($post->status === 'published') {
        app(BlogWebhookService::class)
            ->triggerWebsiteRebuild('created', $post->slug);
    }

    return new BlogPostResource($post);
}

public function update(UpdateBlogRequest $request, BlogPost $post)
{
    $post->update($request->validated());

    app(BlogWebhookService::class)
        ->triggerWebsiteRebuild('updated', $post->slug);

    return new BlogPostResource($post);
}

public function destroy(BlogPost $post)
{
    $slug = $post->slug;
    $post->delete();

    app(BlogWebhookService::class)
        ->triggerWebsiteRebuild('deleted', $slug);

    return response()->noContent();
}

public function togglePublish(BlogPost $post)
{
    $wasPublished = $post->status === 'published';

    $post->update([
        'status'       => $wasPublished ? 'draft' : 'published',
        'published_at' => $wasPublished ? $post->published_at : now(),
    ]);

    app(BlogWebhookService::class)
        ->triggerWebsiteRebuild(
            $wasPublished ? 'unpublished' : 'published',
            $post->slug
        );

    return new BlogPostResource($post);
}
```

### GitHub Token Setup

1. Buat GitHub Personal Access Token (fine-grained) dengan scope `Contents: Read and write` pada repo `myahyazahid/rezure-websites`
2. Simpan di Laravel config:

```env
# .env di Rezure Dashboard
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

```php
// config/services.php
'github' => [
    'token' => env('GITHUB_TOKEN'),
],
```

---

## Format `blog-data.json`

File ini disimpan di root repo website Rezure sebagai cache.
Di-update oleh GitHub Actions setiap kali build, berisi response dari `GET /api/v1/blogs`.

```json
[
  {
    "id": 1,
    "title": "Getting Started with Rezure",
    "slug": "getting-started-with-rezure",
    "excerpt": "Learn how to set up your local development environment with Rezure.",
    "content": "<h2>Introduction</h2><p>...</p>",
    "tags": ["tutorial", "getting-started"],
    "featured_image": null,
    "status": "published",
    "published_at": "2026-09-15T10:00:00Z",
    "updated_at": "2026-09-16T08:30:00Z",
    "author": {
      "name": "Muhammad Yahya Zahid",
      "avatar": "https://github.com/myahyazahid.png"
    }
  }
]
```

> **Catatan:** File ini adalah array langsung (bukan wrapped dalam `{ "data": [...] }`).
> GitHub Actions mengekstrak field `data` dari response API sebelum menyimpan ke file ini.

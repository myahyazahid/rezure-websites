import blogData from '../../blog-data.json'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  featured_image: string | null
  status: string
  published_at: string
  updated_at: string
  author: {
    name: string
    avatar: string | null
  }
}

export default {
  paths() {
    const posts: BlogPost[] = (blogData as BlogPost[]).filter(
      (p) => p.status === 'published'
    )

    return posts.map((post) => ({
      params: {
        slug: post.slug,
        post
      }
    }))
  }
}

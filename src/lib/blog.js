import matter from 'gray-matter'
import { parseISO, format } from 'date-fns'
import fs from 'fs'
import { join } from 'path'

const postsDirectory = join(process.cwd(), 'src', 'content', 'blog')

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const date = format(parseISO(data.date), 'MMMM dd, yyyy')

  if (fields.length === 0) {
    return {
      ...data,
      slug: realSlug,
      content,
      date,
    }
  }

  return fields.reduce((allFields, field) => {
    switch (field) {
      case 'slug':
        return { ...allFields, slug: realSlug }
      case 'content':
        return { ...allFields, content }
      case 'date':
        return { ...allFields, date }
      default:
        return { ...allFields, [field]: data[field] }
    }
  }, {})
}

export function getAllPosts(fields = []) {
  const slugs = fs.readdirSync(postsDirectory)
  const posts = slugs.map((slug) => getPostBySlug(slug, fields))

  return posts
}

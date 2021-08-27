import { remark } from 'remark'
import remarkHtml from 'remark-html'

import SEO from 'components/SEO'
import { getPostBySlug, getAllPosts } from 'lib/blog'

export default function BlogPage(props) {
  return (
    <>
      <SEO
        title={props.title}
        description="More to come"
      />
      <main>
        <article>
          <header>
            <h1>{props.title}</h1>
            <p>{props.date}</p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: props.content }} />
        </article>
      </main>
    </>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug)
  const markdown = await remark()
    .use(remarkHtml)
    .process(post.content || '')
  const content = markdown.toString()

  return {
    props: {
      ...post,
      content,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

import { remark } from 'remark'
import remarkHtml from 'remark-html'

import SEO from 'components/SEO'
import Layout from 'components/Layout'
import { getPostBySlug, getAllPosts } from 'lib/blog'

export default function BlogPage(props) {
  return (
    <>
      <SEO title={props.title} description="More to come" />
      <main>
        <article className="space-y-10">
          <header>
            <h1 className="text-4xl">{props.title}</h1>
            <p className="text-gray-500">{props.date}</p>
          </header>
          <div
            className="space-y-8"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </article>
      </main>
    </>
  )
}

BlogPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug)
  const markdown = await remark()
    .use(remarkHtml)
    .process(post.content ?? '')
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

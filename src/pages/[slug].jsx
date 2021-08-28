import Link from 'next/link'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkPrism from 'remark-prism'

import SEO from 'components/SEO'
import Bio from 'components/Bio'
import Layout from 'components/Layout'
import { getPostBySlug, getAllPosts } from 'lib/blog'

export default function BlogPage(props) {
  return (
    <>
      <SEO title={props.title} description="More to come" />
      <h3>
        <Link href="/">
          <a>Dan's Blog</a>
        </Link>
      </h3>
      <main className="mt-6 space-y-10">
        <article className="space-y-10">
          <header>
            <h1>{props.title}</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              {props.date}
            </p>
          </header>
          <div
            className="space-y-8"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </article>
        <hr />
        <footer>
          <Bio />
        </footer>
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
    .use(remarkPrism)
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

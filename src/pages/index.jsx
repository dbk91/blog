import Link from 'next/link'

import Layout from 'components/Layout'
import Bio from 'components/Bio'
import { getAllPosts } from 'lib/blog'
import config from 'config'

export default function Home(props) {
  return (
    <>
      <h1>
        <Link href="/">
          <a>{config.title}</a>
        </Link>
      </h1>
      <Bio />
      {props.posts.map((post) => (
        <article key={post.title}>
          <header>
            <h3 className="font-extrabold">
              <Link href={`/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </h3>
            <small className="text-md text-gray-500 dark:text-gray-300">
              {post.date}
            </small>
          </header>
        </article>
      ))}
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      <div className="space-y-8">{page}</div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts(['slug', 'title', 'date'])

  return {
    props: {
      posts,
    },
  }
}

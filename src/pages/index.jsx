import Link from 'next/link'

import Layout from 'components/Layout'
import Bio from 'components/Bio'
import { getAllPosts } from 'lib/blog'

export default function Home(props) {
  return (
    <>
      <Bio />
      {props.posts.map((post) => (
        <article key={post.title}>
          <header>
            <h3 className="text-2xl">
              <Link href={`/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </h3>
            <small className="text-md text-gray-500">{post.date}</small>
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

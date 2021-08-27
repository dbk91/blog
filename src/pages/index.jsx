import Link from 'next/link'

import { getAllPosts } from "lib/blog"

export default function Home(props) {
  return (
    <>
      {props.posts.map(post => (
        <article key={post.title}>
          <header>
            <h3>
              <Link href={`/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </h3>
            <small>
              {post.date}
            </small>
          </header>
        </article>
      ))}
    </>
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


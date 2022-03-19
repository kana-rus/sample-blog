import Head from 'next/head'
import Link from 'next/link'

import Date from '../components/date'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={utilStyles.headingMd}>
        <p>[My Introduntion Sentence]</p>
        <p>
          (This is a sample website - I'm building a site like this on{' '}
          <a href='https://nextjs.org/leaarn'>the Next.js' offitial tutrial</a>.)
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map( ({id, date, title}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              {' '}[<Date dateString={date} />]
            </li>
          ) )}
        </ul>
      </section>
    </Layout>
  )
}

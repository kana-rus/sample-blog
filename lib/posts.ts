import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostData() {
    // get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '')
        /**
         *   This syntax :     /regex/    deals with the regex expression
         * surrounded as an javascript object.
         *   Regex \ escapes one charactor just after this that can be used
         * as a regex expression.
         *   Regex $ make a regex expression just before this match only
         * if it puts at the end of a text.
         */

        const fullPath = path.join(postsDirectory, fileName)
        const fileContent = fs.readFileSync(fullPath, 'utf-8')
        const matterResult = matter(fileContent)
        /**
         *   matter returns following form of object:
         *     { data : { ~ : ~ , }, content : ' ~ ' }
         * "data" field has metadatas like
         *     { title : 'Home', date : 2003/7/18 }
         * and "content" has the content data as a string (buffer).
         */

        return {
            id,
            ...(matterResult.data as { date: string; title: string })
        }
    })

    return allPostData.sort( ({date:a},{date:b}) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })

}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map( fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    } )
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}
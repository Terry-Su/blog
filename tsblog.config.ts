import path from 'path'

import { Config } from '../tsblog/src/typings'
import getPages from './tsblog/getPages'
import setWebpack from './tsblog/setWebpack'

const { resolve } = path


const config: Config = {
  siteData: {
    title: "TSBLOG",
    remarkReprintingNote: `reprinting note`,
    remarkEndingWords: `remarkEndingWords`,
    remarkGithubIssuePageBase: `https://github.com/Terry-Su/TSBlogComments-En/issues/`,
    remarkGithubCommentBase: 'https://api.github.com/repos/terry-su/tsblogcomments-en/issues/',
    remarkDisqusComment: `https://terrysu.disqus.com/embed.js`,
  },
  entry: {
    contents    : resolve( __dirname, "./contents" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    reduxApp    : resolve( __dirname, "./src/state/app" ),
    getPages,
    setWebpack,
    tsconfigPath: resolve( __dirname, "tsconfig.json" )
  },
  port: 3602
}

export default config



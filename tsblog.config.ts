import path from 'path'
import showdown from 'showdown'

import parse from '../i18n-sync/src/parse'
import { Config } from '../tsblog/src/typings'
import getPages from './tsblog/getPages'
import setWebpack from './tsblog/setWebpack'

const remarkParser = text => {
  const newText = parse( text ).text
  const converter = new showdown.Converter( {metadata: true} )
  const html = converter.makeHtml( newText )
  return html
}

const { resolve } = path

const config: Config = {
  siteData: {
    title               : "tsblogConfig.siteData.title",
    remarkEndingWords   : ``,
    remarkReprintingNote: `Author all rights reserved, reprint please indicate
    the source, no commercial reprint`,
    remarkGithubIssuePageBase: `https://github.com/Terry-Su/TSBlogComments-En/issues/`,
    remarkGithubCommentBase  :
      "https://api.github.com/repos/terry-su/tsblogcomments-en/issues/",
    remarkDisqusComment: `https://terrysu.disqus.com/embed.js`,
    authorUrl          : "https://github.com/Terry-Su"
  },
  entry: {
    title               : "Terry Su Blog",
    contents    : resolve( __dirname, "./contents" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    reduxApp    : resolve( __dirname, "./src/state/app" ),
    getPages,
    setWebpack,
    tsconfigPath: resolve( __dirname, "tsconfig.json" ),
    dotDirectory: false,
  },
  parser: {
    ".md": remarkParser
  },
  port: 3600
}

export default config

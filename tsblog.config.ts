import path from 'path'
import showdown from 'showdown'

import parse from '../i18n-sync/src/parse'
import { Config } from '../tsblog/src/typings'
import getPages from './tsblog/getPages'
import setWebpack from './tsblog/setWebpack'

const remarkParser = text => {
  const newText = parse( text ).text
  const converter = new showdown.Converter( { metadata: true } )
  const html = converter.makeHtml( newText )
  return html
}

const { resolve } = path

export class SiteData {
  remarkDisqusComment: string = `https://terrysu.disqus.com/embed.js`
  authorUrl: string = "https://github.com/Terry-Su"
}

const config: Config = {
  siteData: new SiteData(),
  entry   : {
    contents    : resolve( __dirname, "./contents" ),
    // contents    : resolve( __dirname, "./contents-test" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    reduxApp    : resolve( __dirname, "./src/state/app" ),
    getPages,
    setWebpack,
    tsconfigPath: resolve( __dirname, "tsconfig.json" ),
    dotDirectory: false
  },
  parser: {
    ".md": remarkParser
  },
  port: 3600
}

export default config

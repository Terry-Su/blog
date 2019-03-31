import glob from 'glob'
import path from 'path'
import showdown from 'showdown'

import mdx from '@mdx-js/mdx'

import parse from '../i18n-sync/src/parse'
import { Config } from '../tsblog/src/typings'
import getPages from './tsblog/getPages'
import setWebpack from './tsblog/setWebpack'

const remarkPreParser = text => {
  const newText = parse( text ).text
  return newText
}

const remarkParser = text => {
  const YAML_REGEXP = new RegExp( `^---[\\s\\S]*?---\\n`, "m" )
  const removedYmlText = text.replace( YAML_REGEXP, "" )
  const jsx = mdx.sync( removedYmlText )

  // remove `export default`
  let newText = jsx.replace(
    "export default class MDXContent",
    "class MDXContent"
  )

  // insert react-live's render method
  newText = `${newText}
render( <MDXContent /> )
  `

  return newText
}

const { resolve } = path

const watching = [ ...glob.sync( `${path.resolve( __dirname, "locales" )}/**/*` ) ]

export class SiteData {
  remarkDisqusComment: string = `https://terrysu.disqus.com/embed.js`
  authorUrl: string = "https://github.com/Terry-Su"
}

const config: Config = {
  siteData: new SiteData(),
  entry   : {
    contents    : resolve( __dirname, "./build-contents" ),
    // contents    : resolve( __dirname, "./contents-test" ),
    home        : resolve( __dirname, "./src/pages/Home" ),
    reduxApp    : resolve( __dirname, "./src/state/app" ),
    getPages,
    setWebpack,
    tsconfigPath: resolve( __dirname, "tsconfig.json" ),
    dotDirectory: false,
    watching
  },
  preParser: {
    ".md": remarkPreParser
  },
  parser: {
    ".md": remarkParser
  },
  port: 3601
}

export default config

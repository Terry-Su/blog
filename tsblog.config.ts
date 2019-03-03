import path from 'path'

import { Config, PageInfo, TransformedData } from '../tsblog/src/typings'

const { resolve } = path

const config: Config = {
  siteData: {
    title: 'TSBLOG'
  },
  entry: {
    contents: resolve( __dirname, "./contents" ),
    home    : resolve( __dirname, "./src/pages/Home" ),
    getPages,
    setWebpack,
    tsconfigPath: resolve( __dirname, "tsconfig.json" )
  },
  port: 3602,
}

export default config

function getPages( transformedData: TransformedData ): PageInfo[] {
  const { remarks, siteData } = transformedData

  const homePageInfo = {
    path     : '/',
    component: resolve( __dirname, "./src/pages/Home" ),
    data     : {
      siteData
    },
  }
  const remarkPageInfos = remarks.map( ( { relativePath, metadata, text } ) => ( {
    path     : `/${ relativePath }`,
    component: resolve( __dirname, "./src/templates/RemarkTemplate" ),
    data     : {
      text,
      metadata
    }
  } ) )
  return [
    homePageInfo,
    ...remarkPageInfos,
  ]

}


function setWebpack( webpackConfig ) {
  webpackConfig.resolve.alias = {
    '@': path.resolve( __dirname, './src' ),
    '@tsblog': path.resolve( __dirname, '../tsblog/src' ),
  }
}
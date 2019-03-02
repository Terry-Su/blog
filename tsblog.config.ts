import path from 'path'

import { PageInfo, TransformedData } from '../tsblog/src/typings'

const { resolve } = path

export default {
  siteData: {
    title: 'TSBLOG'
  },
  entry: {
    contents: resolve( __dirname, "./contents" ),
    home    : resolve( __dirname, "./src/pages/Home" ),
    getPages,
    setWebpack,
  },
  port: 3602,
}

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
  
}
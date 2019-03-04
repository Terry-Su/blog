import cloneDeep from 'lodash/cloneDeep'
import path from 'path'

import { Config, PageInfo, TransformedData, TransformedMarkdownFile } from '../tsblog/src/typings'
import AbstractCategory from './src/__typings__/AbstractCategory'
import { PATH_ABOUT, PATH_HOW_IT_WORKS } from './src/constants/paths'

import console = require('console');

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

  const categories = getCategories( remarks )
  console.log( JSON.stringify( categories, null, '\t' ))

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
  const howItWorks = {
    path: PATH_HOW_IT_WORKS,
    component: resolve( __dirname, "./src/pages/HowItWorks" ),
  }
  const about = {
    path: PATH_ABOUT,
    component: resolve( __dirname, "./src/pages/About" ),
  }
  return [
    homePageInfo,
    ...remarkPageInfos,
    howItWorks,
    about,
  ]

}


function setWebpack( webpackConfig ) {
  webpackConfig.resolve.alias = {
    '@': path.resolve( __dirname, './src' ),
    '@tsblog': path.resolve( __dirname, '../tsblog/src' ),
  }
}

function getCategories( originalRemarks: TransformedMarkdownFile[] ) {
  let remarks = cloneDeep( originalRemarks )
  remarks = remarks.map( remark => ({
    ...remark,
    // The parent folder of markdown folder
    parentPath: ( () => {
      const { relativePath } = remark
      const names = relativePath.split('/')
      names.pop()
      names.pop()
      return names.join( '/' )
    } )()
  }) )

  const hasRemarks = (tmpNames: string[] ): boolean => {
    return remarks.some( ({ parentPath }) => {
      console.log(
        JSON.stringify( parentPath.split( '/' ) ),
        JSON.stringify( tmpNames )
      )
      return JSON.stringify( parentPath.split( '/' ) ) === JSON.stringify( tmpNames )
    } )
  }

  const setValue = ( root: AbstractCategory, remark: TransformedMarkdownFile  ) => {
    let tmp = root
    let tmpNames: string[] = []
    const names = remark.relativePath.split( '/' )
    names.map( name => {
      const { categories } = tmp
      let found = false
      tmpNames.push( name )
      root.categories.map( category => {
        if ( category.name === name ) {
          found = true
          tmp = category
        }
      } )
      if ( ! found ) {
        tmp = {
          name: name,
          categories: [],
          hasRemarks: hasRemarks( tmpNames ),
          expanded: true
        }
        categories.push( tmp )
      } 
    } )
  }

  let root:AbstractCategory = {
    name: 'root',
    categories: []
  }

  remarks.map( remark => {
    setValue( root, remark )
  } )


  return root.categories
}
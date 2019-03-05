import cloneDeep from 'lodash/cloneDeep'
import path from 'path'

import {
    Config, PageInfo, TransformedData, TransformedMarkdownFile
} from '../../tsblog/src/typings'
import AbstractCategory from '../src/__typings__/AbstractCategory'
import ClientRemark, { ClientListItemRemark } from '../src/__typings__/ClientRemark'
import { PATH_ABOUT, PATH_HOW_IT_WORKS } from '../src/constants/paths'

const { resolve } = path

export default function getPages( transformedData: TransformedData ): PageInfo[] {
  const { remarks, siteData } = transformedData

  const {
    remarkReprintingNote,
    remarkEndingWords,
    remarkGithubIssuePageBase,
    remarkGithubCommentBase,
    remarkDisqusComment,
  } = siteData

  const categories = getCategories( remarks )
  const category = {
    name    : "All",
    categories,
    expanded: true
  }

  const newestRemarks = remarks.map( getClientListItemRemark )

  const homePageInfo = {
    path     : "/",
    component: resolve( __dirname, "../src/pages/Home" ),
    data     : {
      siteData,
      category,
      newestRemarks
    }
  }

  const remarkPageInfos = remarks.map( remark => {
    const { relativePath, metadata, text } = remark
    const {
      postTime,
      comment,
    } = metadata
    const id = getRemarkId( remark )
    const title = getRemarkTitle( remark )
    const path = getRemarkPath( remark )
    const route = getRemarkRoute( remark )
    const remarkData: ClientRemark = {
      id,
      title,
      postTime,
      text,
      path,
      comment,
    }
    return {
      path     : `${ route }`,
      component: resolve( __dirname, "../src/templates/RemarkTemplate/RemarkTemplate" ),
      data: {
        ...remarkData,
        remarkReprintingNote,
        remarkEndingWords,
        remarkGithubCommentBase,
        remarkGithubIssuePageBase,
        remarkDisqusComment,
      } 
    }
  } )
  const howItWorks = {
    path     : PATH_HOW_IT_WORKS,
    component: resolve( __dirname, "../src/pages/HowItWorks" )
  }
  const about = {
    path     : PATH_ABOUT,
    component: resolve( __dirname, "../src/pages/About" )
  }
  return [ homePageInfo, ...remarkPageInfos, howItWorks, about ]
}



function getCategories( originalRemarks: TransformedMarkdownFile[] ) {
  let remarks = cloneDeep( originalRemarks )
  remarks = remarks.map( remark => ( {
    ...remark,
    currentFolder: ( () => {
      const { relativePath } = remark
      const names = relativePath.split( "/" )
      names.pop()
      return names.join( "/" )
    } )(),
    // The parent folder of markdown folder
    parentOfCurrentFolder: ( () => {
      const { relativePath } = remark
      const names = relativePath.split( "/" )
      names.pop()
      names.pop()
      return names.join( "/" )
    } )()
  } ) )

  const hasRemarks = ( tmpNames: string[] ): boolean => {
    return remarks.some(
      ( { parentOfCurrentFolder } ) =>
        parentOfCurrentFolder === tmpNames.join( "/" )
    )
  }

  const getRemarks = ( tmpNames: string[] ) => {
    return remarks
      .filter(
        ( { parentOfCurrentFolder } ) =>
          parentOfCurrentFolder === tmpNames.join( "/" )
      )
      .map( getClientListItemRemark )
  }

  const setValue = (
    root: AbstractCategory,
    remark: TransformedMarkdownFile
  ) => {
    let tmp = root
    let tmpNames: string[] = []
    const names = remark.relativePath.split( "/" )
    names.map( ( name, index ) => {
      // Only retrieve the parent folder of remark's folder
      if ( index >= names.length - 2 ) {
        return
      }

      const { categories } = tmp
      let found = false
      tmpNames.push( name )
      root.categories.map( category => {
        if ( category.name === name ) {
          found = true
          tmp = category
        }
      } )
      if ( !found ) {
        tmp = {
          name      : name,
          categories: [],
          hasRemarks: hasRemarks( tmpNames ),
          remarks   : getRemarks( tmpNames ),
          expanded  : index === names.length - 1 ? false : true
        }
        categories.push( tmp )
      }
    } )
  }

  let root: AbstractCategory = {
    name      : "root",
    categories: []
  }

  remarks.map( remark => {
    setValue( root, remark )
  } )

  return root.categories
}

function getClientListItemRemark( remark ): ClientListItemRemark {
  const { relativePath, text, metadata }: TransformedMarkdownFile = remark
  const { postTime, id } = metadata

  const title = getRemarkTitle( remark )
  const path = getRemarkPath( remark )
  const route = getRemarkRoute( remark )
  return {
    title,
    abstract: text,
    path,
    route,
    postTime
  }
}

function getRemarkTitle( remark: TransformedMarkdownFile ) {
  const { title } = remark.metadata
  return title || getRemarkFolderName( remark )
}

function getRemarkId( remark: TransformedMarkdownFile ) {
  const { id } = remark.metadata
  const folderName = getRemarkFolderName( remark )
  const fileName = getRemarkFilerName( remark )
  return id || `${
    fileName === 'en' ? 
    '' :
    `${fileName}/`
  }${folderName.replace( / /g, '-' )}`
}

// # e.g. foo/bar/articleName
function getRemarkPath( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names.slice( 0, names.length - 2 ).join( "/" )
}

function getRemarkFolderName( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names[ names.length - 2 ]
}

function getRemarkFilerName( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names[ names.length - 1 ]
}

function getRemarkRoute( remark: TransformedMarkdownFile ) {
  return `/${getRemarkId( remark )}`
}


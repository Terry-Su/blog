import cloneDeep from 'lodash/cloneDeep'
import path from 'path'

import {
    Config, PageInfo, TransformedData, TransformedMarkdownFile
} from '../../tsblog/src/typings'
import AbstractCategory from '../src/__typings__/AbstractCategory'
import ClientRemark, { ClientListItemRemark } from '../src/__typings__/ClientRemark'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '../src/constants/paths'

const { resolve } = path

export default function getPages( transformedData: TransformedData ): PageInfo[] {
  const { remarks, siteData } = transformedData

  const { authorUrl } = siteData
  const commonData = {
    authorUrl
  }

  const articleRemarks = remarks.filter(
    remark => remark.relativePath.split( "/" ).length > 2
  )

  const {
    remarkReprintingNote,
    remarkEndingWords,
    remarkGithubIssuePageBase,
    remarkGithubCommentBase,
    remarkDisqusComment,
  } = siteData

  const categories = getCategories( articleRemarks )
  const category = {
    name    : "All",
    categories,
    expanded: true
  }

  const newestRemarks = articleRemarks.map( getClientListItemRemark )

  // # home page
  const homePageInfo = {
    path     : "/",
    component: resolve( __dirname, "../src/pages/Home" ),
    data     : {
      ...commonData,
      category,
      newestRemarks,
    }
  }

  // # article pages
  const remarkPageInfos = articleRemarks.map( remark => {
    const remarkBasicData = getRemarkBasicData( remark )
    const route = getRemarkRoute( remark )
    return {
      path     : `${route}`,
      component: resolve(
        __dirname,
        "../src/templates/RemarkTemplate/RemarkTemplate"
      ),
      data: {
        ...commonData,
        ...remarkBasicData,
        remarkReprintingNote,
        remarkEndingWords,
        remarkGithubCommentBase,
        remarkGithubIssuePageBase,
        remarkDisqusComment
      }
    }
  } )

  // # how it works series page
  const howItWorks = {
    path     : PATH_HOW_IT_WORKS_SERIES,
    component: resolve( __dirname, "../src/pages/HowItWorks" ),
    data     : ( () => {
      const remark = remarks.find(
        remark => getRemarkFolderPath( remark ) === "how it works series"
      )
      return {
        ...commonData,
        ...getRemarkBasicData( remark )
      }
    } )()
  }

  // # about page
  const about = {
    path     : PATH_ABOUT,
    component: resolve( __dirname, "../src/pages/About" ),
    data     : ( () => {
      const remark = remarks.find(
        remark => getRemarkFolderPath( remark ) === "about"
      )
      return {
        ...commonData,
        ...getRemarkBasicData( remark ),
      }
    } )()
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
  const { relativePath, getText, getMetadata }: TransformedMarkdownFile = remark
  const { postTime, id } = getMetadata()

  const title = getRemarkTitle( remark )
  const path = getRemarkCategoryPath( remark )
  const route = getRemarkRoute( remark )
  return {
    title,
    abstract: getText(),
    path,
    route,
    postTime
  }
}

function getRemarkTitle( remark: TransformedMarkdownFile ) {
  const { title } = remark.getMetadata()
  return title || getRemarkFolderName( remark )
}

function getRemarkId( remark: TransformedMarkdownFile ) {
  const { id } = remark.getMetadata()
  const folderName = getRemarkFolderName( remark )
  const fileName = getRemarkFilerName( remark )
  return (
    id ||
    `${fileName === "en" ? "" : `${fileName}/`}${folderName.replace( / /g, "-" )}`
  )
}

// # e.g. foo/bar
function getRemarkCategoryPath( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names.slice( 0, names.length - 2 ).join( "/" )
}

// # e.g. foo/bar/articleName
function getRemarkFolderPath( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names.slice( 0, names.length - 1 ).join( "/" )
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

function getRemarkBasicData( remark: TransformedMarkdownFile ): ClientRemark {
  const { getText } = remark
  const { postTime, comment } = remark.getMetadata()
  const id = getRemarkId( remark )
  const title = getRemarkTitle( remark )
  const path = getRemarkCategoryPath( remark )
  const route = getRemarkRoute( remark )
  return {
    id,
    title,
    path,
    text: getText(),
    postTime,
    comment
  }
}

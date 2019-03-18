import htmlToText from 'html-to-text'
import cloneDeep from 'lodash/cloneDeep'
import path from 'path'

import {
    Config, PageInfo, TransformedData, TransformedMarkdownFile, TransformedYamlFile
} from '../../tsblog/src/typings'
import { EN, ZH_CN } from '../locale/names'
import specialNameMap, { CN, getSpeciaLocalelName } from '../locale/specialNameMap'
import t from '../locale/t'
import AbstractCategory from '../src/__typings__/AbstractCategory'
import CategoryProp from '../src/__typings__/CategoryProp'
import ClientRemark, {
    ClientListItemRemark, ClientRemarkMetadata
} from '../src/__typings__/ClientRemark'
import { PATH_ABOUT, PATH_HOW_IT_WORKS_SERIES } from '../src/constants/paths'
import { CATEGORY_PROPS_FILE_NAME } from './constants'

const { resolve } = path

export default function getPagesByLocale(
  transformedData: TransformedData,
  locale: string
): PageInfo[] {
  const { remarks, yamls, siteData } = transformedData

  const localeName = specialNameMap[ locale ]
  const root = locale === EN ? "/" : `/${localeName}/`
  const absoluteRoot = "/"
  const rootName = root.replace( /\/$/, "" )

  const { authorUrl, title } = siteData
  const commonData = {
    authorUrl,
    title: t( title, locale )
  }

  const articleRemarks = remarks.filter( remark => {
    const { relativePath } = remark
    // is article folder
    if ( relativePath.split( "/" ).length > 2 ) {
      const localeName = getRemarkFilerName( remark )
      return localeName === getSpeciaLocalelName( locale )
    }
  } )

  const {
    remarkReprintingNote,
    remarkEndingWords,
    remarkGithubIssuePageBase,
    remarkGithubCommentBase,
    remarkDisqusComment
  } = siteData

  const categoryProps: CategoryProp[] = getCategoryProps( yamls )
  const categories = getCategories(
    articleRemarks,
    categoryProps,
    locale,
    absoluteRoot
  )
  // console.log( JSON.stringify( categories, null, 2 ) )
  const category = {
    name    : "All",
    categories,
    expanded: true
  }

  const newestRemarks = articleRemarks.map( remark =>
    getClientListItemRemark( remark, absoluteRoot )
  )

  // # home page
  const homePageInfo = {
    path     : root,
    component: resolve( __dirname, "../src/pages/Home" ),
    data     : {
      ...commonData,
      category,
      newestRemarks
    }
  }

  // # article pages
  const remarkPageInfos = articleRemarks.map( remark => {
    const remarkBasicData = getRemarkBasicData( remark )
    const route = getRemarkRoute( remark, absoluteRoot )
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
    path     : `${rootName}${PATH_HOW_IT_WORKS_SERIES}`,
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
    path     : `${rootName}${PATH_ABOUT}`,
    component: resolve( __dirname, "../src/pages/About" ),
    data     : ( () => {
      const remark = remarks.find(
        remark => getRemarkFolderPath( remark ) === "about"
      )
      return {
        ...commonData,
        ...getRemarkBasicData( remark )
      }
    } )()
  }

  return [ homePageInfo, ...remarkPageInfos, howItWorks, about ]
}

function getCategoryProps( yamls: TransformedYamlFile[] ) {
  let res = yamls
    .filter(
      ( { relativePath } ) =>
        getFilerName( relativePath ) === CATEGORY_PROPS_FILE_NAME
    )
    .map( yaml => {
      const { relativePath, getData } = yaml
      const categoryPath = getFileFolderPath( relativePath )
      return {
        categoryPath,
        ...getData()
      }
    } )
  return res
}

function getCategories(
  originalRemarks: TransformedMarkdownFile[],
  categoryProps: CategoryProp[],
  locale: string,
  absoluteRoot: string
) {
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
      .map( remark => getClientListItemRemark( remark, absoluteRoot ) )
  }

  const setValue = (
    root: AbstractCategory,
    remark: TransformedMarkdownFile
  ) => {
    let tmp: AbstractCategory = root
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

      const localizedName = ( () => {
        const categoryProp = categoryProps.find(
          ( { categoryPath } ) => categoryPath === tmpNames.join( "/" )
        )
        if ( categoryProp ) {
          const { name: nameMap } = categoryProp
          const key = specialNameMap[ locale ] || locale
          return nameMap ? nameMap[ key ] || name : name
        }
        return name
      } )()

      root.categories.map( category => {
        if ( category.name === localizedName ) {
          found = true
          tmp = category
        }
      } )
      if ( !found ) {
        tmp = {
          name      : localizedName,
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

function getClientListItemRemark(
  remark,
  absoluteRoot: string
): ClientListItemRemark {
  const { relativePath, getText, getMetadata }: TransformedMarkdownFile = remark
  const { postTime, id, abstract }: ClientRemarkMetadata = getMetadata()

  const title = getRemarkTitle( remark )
  const path = getRemarkCategoryPath( remark )
  const route = getRemarkRoute( remark, absoluteRoot )
  const html = getText()
  const remarkAbstract =
    abstract ||
    htmlToText
      .fromString( html, {
        ignoreImage            : true,
        noLinkBrackets         : true,
        ignoreHref             : true,
        wordwrap               : false,
        unorderedListItemPrefix: " "
      } )
      .substring( 0, 100 ) + "..."
  const remarkPostTime = postTime && new Date( postTime ).getTime()
  return {
    title,
    abstract: remarkAbstract,
    path,
    route,
    postTime: remarkPostTime
  }
}

function getRemarkTitle( remark: TransformedMarkdownFile ) {
  const { title }: ClientRemarkMetadata = remark.getMetadata()
  return title || getRemarkFolderName( remark )
}

function getRemarkId( remark: TransformedMarkdownFile ) {
  const { id }: ClientRemarkMetadata = remark.getMetadata()
  const folderName = getRemarkFolderName( remark )
  const fileName = getRemarkFilerName( remark )
  return (
    id ||
    `${fileName === "en" ? "" : `${fileName}/`}${folderName.replace( / /g, "-" )}`
  )
}

function getFilerName( relativePath: string ) {
  const names = relativePath.split( "/" )
  return names[ names.length - 1 ]
}

// # e.g. foo/bar/fileName
function getFileFolderPath( relativePath: string ) {
  const names = relativePath.split( "/" )
  return names.slice( 0, names.length - 1 ).join( "/" )
}

// # e.g. foo/bar
function getRemarkCategoryPath( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names.slice( 0, names.length - 2 ).join( "/" )
}

// # e.g. foo/bar/articleName
function getRemarkFolderPath( remark: TransformedMarkdownFile ) {
  return getFileFolderPath( remark.relativePath )
}

function getRemarkFolderName( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names[ names.length - 2 ]
}

function getRemarkFilerName( remark: TransformedMarkdownFile ) {
  const names = remark.relativePath.split( "/" )
  return names[ names.length - 1 ]
}

function getRemarkRoute( remark: TransformedMarkdownFile, absoluteRoot: string ) {
  return `${absoluteRoot}${getRemarkId( remark )}`
}

function getRemarkBasicData( remark: TransformedMarkdownFile ): ClientRemark {
  const { getText } = remark
  const {
    postTime,
    comment,
    isAutoTranslated
  }: ClientRemarkMetadata = remark.getMetadata()
  const id = getRemarkId( remark )
  const title = getRemarkTitle( remark )
  const path = getRemarkCategoryPath( remark )
  const remarkPostTime = postTime && new Date( postTime ).getTime()
  const text = getText()
  return {
    id,
    title,
    path,
    text,
    postTime: remarkPostTime,
    comment,
    isAutoTranslated
  }
}

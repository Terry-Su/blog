import fs from 'fs-extra'
import path from 'path'

import AbstractCategory from '@/__typings__/AbstractCategory'
import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import { EN, ZH_CN } from '@locale/names'

import { formYearMonthDate } from '../shared/time'

const targetDirMap = {
  [ EN ]   : path.resolve( __dirname, "../blogs" ),
  [ ZH_CN ]: path.resolve( __dirname, "../blogs-cn" )
}

const home = "https://terry-su.github.io"
const README = "README.md"

export default function buildCategoriesForGithubRepo( config: {
  locale: string
  categories: AbstractCategory[]
  newestRemarks: ClientListItemRemark[]
  t: Function
} ) {
  const { locale, categories, newestRemarks, t } = config
  const targetDir = targetDirMap[ locale ]
  const targetReadmeFile = path.resolve( targetDir, README )
  const markdownText = getMarkdownText( locale, categories, newestRemarks, t )
  fs.outputFileSync( targetReadmeFile, markdownText, { encoding: "utf8" } )
}

function getMarkdownText(
  locale: string,
  categories: AbstractCategory[],
  newestRemarks: ClientListItemRemark[],
  t: Function
) {
  let res = ""

  // # locales note
  res = res + `${t( "forGithubRepo.markdownJumpNote" )}\n`

  // # subscription note
  res =
    res +
    `${t( "forGithubRepo.subscriptionNote" )}
`

  // # newest blogs
  res = res + `# ${t( "forGithubRepo.newest" )}\n`
  newestRemarks
    .filter( ( v, index ) => index <= 4 )
    .forEach( v => {
      let timeText = ""
      if ( v.postTime != null ) {
        const time = new Date( v.postTime )
        timeText = formYearMonthDate( time )
      }

      res = res + `* ${timeText} &nbsp; [${v.title}](${home}${v.route})\n`
    } )

  // # categorized blogs
  const getLevelText = level => {
    const levelTexts = [ "#", "##", "###", "####", "#####", "######" ]
    return levelTexts[ level - 1 ] || levelTexts[ levelTexts.length - 1 ]
  }
  const recur = ( category: AbstractCategory, level: number ) => {
    const { name = "", remarks = [] } = category

    // # Add category name
    const levelText = getLevelText( level )
    const lineText = `${levelText} ${name}\n`
    res = res + lineText

    // # Add blogs
    if ( remarks.length > 0 ) {
      remarks.forEach( v => {
        res = res + `* [${v.title}](${home}${v.route})\n`
      } )
    }

    // # Recur children categories
    category.categories.map( v => recur( v, level + 1 ) )
  }
  categories.forEach( v => recur( v, 1 ) )

  // # license

  return res
}

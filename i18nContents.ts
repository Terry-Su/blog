import chokidar from 'chokidar'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

import sync, { parse } from '../i18n-sync/src/index'

const locales = [ "en", "cn" ]
const EXTENSION = ".md"
const BACKUP_NAME = ".backup"

export default function i18nContents( source: string, output: string ) {
  const markdownDirs = ( () => {
    const files = glob.sync( `${source}/**/*${EXTENSION}` )
    let dirs = files
      .filter( file => locales.some( locale => path.parse( file ).name === locale ) )
      .map( file => path.dirname( file ) )
    dirs = [ ...new Set( dirs ) ]
    return dirs
  } )()

  markdownDirs.map( markdownDir => {
    const files = locales.map( name =>
      path.resolve( markdownDir, `${name}${EXTENSION}` )
    )
    const backup = path.resolve( markdownDir, BACKUP_NAME )
    sync( files, {
      backup,
      enableTranslation: true
    } )
  } )

  chokidar
    .watch( `${source}/**/*${EXTENSION}`, {
      ignored: new RegExp( BACKUP_NAME )
    } )
    .on( "change", filePath => {
      const relativePath = path.relative( source, filePath )
      const outputFilePath = path.resolve( output, relativePath )
      const sourceText = fs.readFileSync( filePath, { encoding: "utf8" } )
      const outputText = parse( sourceText ).text
      fs.outputFileSync( outputFilePath, outputText, { encoding: "utf8" } )
    } )
}

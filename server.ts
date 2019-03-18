import glob from 'glob'
import path from 'path'

import sync from '../i18n-sync/src/index'
import { run } from '../tsblog/src/index'
import config from './tsblog.config'

run( config )

// i18n sync
const locales = [ "en", "cn" ]
const EXTENSION = ".md"
export const BACKUP_NAME = ".backup"
const { contents } = config.entry

const remarkDirs = ( () => {
  const enFiles = glob.sync( `${contents}/**/en.md` )
  const dirs = enFiles.map( enFile => path.resolve( enFile, "../" ) )
  return dirs
} )()

// remarkDirs.map( remarkDir => {
//   const files = locales.map( name =>
//     path.resolve( remarkDir, `${name}${EXTENSION}` )
//   )
//   const backup = path.resolve( remarkDir, BACKUP_NAME )
//   sync( files, {
//     backup
//   } )
// } )

import path from 'path'

import { run } from '../tsblog/src/index'
import copySomeFiles from './copySomeFiles'
import { __DEV__ } from './scripts/global'
// import i18n from './scripts/i18n'
import config from './tsblog.config'

run( config )

if ( __DEV__ ) {
  // i18n sync
  const sourceI18nContent = path.resolve( __dirname, "contents" )
  copySomeFiles( sourceI18nContent, config.entry.contents )

  require( "./scripts/i18n" )
}

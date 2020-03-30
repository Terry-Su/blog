import path from 'path'
import ReactDOMServer from 'react-dom/server'

import { run } from '../tsblog/src/index'
import copySomeFiles from './copySomeFiles'
import { __DEV__, __SIMPLE_MODE__ } from './scripts/global'
// import i18n from './scripts/i18n'
import config from './tsblog.config'

run( config )

if ( __DEV__ && !__SIMPLE_MODE__ ) {
  // i18n sync
  const sourceI18nContent = path.resolve( __dirname, "contents" )
  copySomeFiles( sourceI18nContent, config.entry.contents )

  import( "./scripts/i18n" )
}

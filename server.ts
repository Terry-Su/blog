import path from 'path'

import { run } from '../tsblog/src/index'
import copySomeFiles from './copySomeFiles'
import i18n from './i18n'
import config from './tsblog.config'

run( config )

// i18n sync
const sourceI18nContent = path.resolve( __dirname, "contents" )
copySomeFiles( sourceI18nContent, config.entry.contents )

{
  i18n
}

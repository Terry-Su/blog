import path from 'path'

import { run } from '../tsblog/src/index'
import copySomeFiles from './copySomeFiles'
import i18nContents from './i18nContents'
import config from './tsblog.config'

run( config )

// i18n sync
const sourceI18nContent = path.resolve( __dirname, "contents" )
i18nContents( sourceI18nContent, config.entry.contents )
copySomeFiles( sourceI18nContent, config.entry.contents )

import chokidar from 'chokidar'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

import sync, { i18nContents, parse } from '../i18n-sync/src/index'

export default function i18n() {
  const locales = [ "en", "cn" ]
  const backupName = ".backup"
  const syncConfig = {
    enableTranslation: true
  }
  // # markdown
  {
    const source = path.resolve( __dirname, "contents" )
    const target = path.resolve( __dirname, "build-contents" )
    const extension = ".md"
    const config = {
      locales,
      extension,
      backupName,
      syncConfig
    }
    i18nContents( source, target, config )
  }

  // # locales
  {
    const extension = ".yml"
    const config = {
      locales,
      extension,
      backupName,
      syncConfig
    }
    const source = path.resolve( __dirname, "locales" )
    const target = path.resolve( __dirname, "build-locales" )
    i18nContents( source, target, config )
  }
}

i18n()

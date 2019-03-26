import fs from 'fs-extra'
import yaml from 'js-yaml'
import path from 'path'

import { EN, ZH_CN } from './names'

export default function translate( locale: string, key: string ): any {
  const getData = name => {
    const filePath = path.resolve( __dirname, `../build-locales/${name}.yml` )
    const text = fs.readFileSync( filePath, { encoding: "utf8" } )
    try {
      return yaml.safeLoad( text )
    } catch ( e ) {
      console.log( e )
      return {}
    }
  }

  const en = getData( "en" )
  const zh_CN = getData( "cn" )

  const localeMap = {
    [ EN ]   : en,
    [ ZH_CN ]: zh_CN
  }

  try {
    let res = localeMap[ locale ]
    key
      .split( "." )
      .filter( v => v !== "" )
      .forEach( str => {
        res = res[ str ]
      } )
    return res != null ? res : key
  } catch ( e ) {
    console.log( e )
    return key
  }
}

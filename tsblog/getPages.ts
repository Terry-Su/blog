import path from 'path'

import { Config, PageInfo, TransformedData } from '../../tsblog/src/typings'
import * as namesMap from '../locale/names'
import { __DEV__ } from '../scripts/global'
import getPagesByLocale from './getPagesByLocale'

export default function getPages(
  transformedData: TransformedData,
  config: Config
): PageInfo[] {
  let res = []
  Object.values( namesMap ).forEach( locale => {
    const data = getPagesByLocale( transformedData, locale ) || []
    res = [ ...res, ...data ]
  } )

  if ( __DEV__ ) {
    res.push( {
      path     : "/standalone",
      component: path.resolve(
        __dirname,
        "../src/components/Standalone/Standalone"
      )
    } )

    console.log(
      `Test standalone component at: http://localhost:${config.port}/standalone`
    )
  }

  return res
}

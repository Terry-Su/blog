import { locales } from '@locale/index'

import { PageInfo, TransformedData } from '../../tsblog/src/typings'
import getPagesByLocale from './getPagesByLocale'

export default function getPages( transformedData: TransformedData ): PageInfo[] {
  let res = []
  locales.forEach( locale => {
    const data = getPagesByLocale( transformedData, locale ) || []
    res = [
      ...res,
      ...data
    ]
  })
  return res
}
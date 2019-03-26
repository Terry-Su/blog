import { PageInfo, TransformedData } from '../../tsblog/src/typings'
import * as namesMap from '../locale/names'
import getPagesByLocale from './getPagesByLocale'

export default function getPages( transformedData: TransformedData ): PageInfo[] {
  let res = []
  Object.values( namesMap ).forEach( locale => {
    const data = getPagesByLocale( transformedData, locale ) || []
    res = [ ...res, ...data ]
  } )
  return res
}

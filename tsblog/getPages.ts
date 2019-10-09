import path from 'path'

import { Config, PageInfo, TransformedData } from '../../tsblog/src/typings'
import * as namesMap from '../locale/names'
import { __DEV__, __SIMPLE_MODE__ } from '../scripts/global'
import getPagesByLocale, { getRemarkFolderPath } from './getPagesByLocale'

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
    // # standalone page
    const standAlonepage = {
      path     : "/standalone",
      component: path.resolve(
        __dirname,
        "../src/components/Standalone/Standalone"
      )
    }
    res.push( standAlonepage )
    console.log(
      `Test standalone component at: http://localhost:${config.port}/standalone`
    )

    // # test page (useful when some blog contents have problems)
    const { remarks } = transformedData
    const remark = remarks.find(
      remark => getRemarkFolderPath( remark ) === "test"
    )
    const testPage = {
      path     : "/test",
      component: path.resolve(
        __dirname,
        "../src/templates/RemarkTemplate/RemarkTemplate"
      ),
      data: {
        title: "Test Blog",
        text            : remark && remark.getText(),
        importedCodes: `
const count = 1

class Foo extends React.Component {
    render() {
        console.log( count )
        return <h1>Test123</h1>
    }
}
      `
      }
    }
    res.push( testPage )
  }

  return res
}

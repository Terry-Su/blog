import fs from 'fs-extra'
import path from 'path'

publish()
export default function publish() {
  const publicPath = path.resolve( __dirname, "../public" )
  const sitePath = path.resolve( __dirname, "../Terry-Su.github.io" )
  fs.copySync( publicPath, sitePath )
}

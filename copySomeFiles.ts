import chokidar from 'chokidar'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

import { CATEGORY_PROPS_FILE_NAME } from './tsblog/constants'

export default function copySomeFiles( source: string, output: string ) {
  copyCategoryFiles( source, output )
}

function copyCategoryFiles( source: string, output: string ) {
  chokidar
    .watch( `${source}/**/${CATEGORY_PROPS_FILE_NAME}.yml` )
    .on( "change", filePath => {
      const relativePath = path.relative( source, filePath ).replace( /\\/g, '/' )
      const outputFilePath = path.resolve( output, relativePath )
      const text = fs.readFileSync( filePath, { encoding: "utf8" } )
      fs.outputFileSync( outputFilePath, text, { encoding: "utf8" } )
    } )
}

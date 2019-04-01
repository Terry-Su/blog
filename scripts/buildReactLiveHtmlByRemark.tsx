import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import ClientRemark from '@/__typings__/ClientRemark'
import ReactLiveComponent from '@/components/ReactLive/ReactLiveComponent'

import { PATH_PUBLIC } from '../shared/constants'

export default function buildReactLiveHtmlByRemark(
  file: string,
  remarkRoute: string,
  text: string
) {
  const domStr = ReactDOMServer.renderToString(
    <ReactLiveComponent code={text} />
  )
  const name = path.parse(file).name
  const htmlText = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${name}</title>
  </head>
  <body>
    ${domStr}
  </body>
  </html>`

  const fileName = `${name}.html`
  const outputPath = path.resolve(`${PATH_PUBLIC}${remarkRoute}`, fileName)
  console.log(PATH_PUBLIC, outputPath)

  fs.outputFileSync(outputPath, htmlText, { encoding: "utf8" })
}

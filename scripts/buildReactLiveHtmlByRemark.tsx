import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import ClientRemark from '@/__typings__/ClientRemark'
import ReactLiveComponent from '@/components/ReactLive/ReactLiveComponent'

import { PATH_PUBLIC } from '../shared/constants'
import getReactLiveComponentMap from '../shared/getReactLiveComponentMap'

export default function buildReactLiveHtmlByRemark(
  componentTextMap: any,
  remarkRoute: string,
  text: string
) {
  const componentMap = getReactLiveComponentMap(componentTextMap)

  const buildByComponent = (key, Component) => {
    const domStr = ReactDOMServer.renderToString(<Component standalone />)
    const name = key
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

    fs.outputFileSync(outputPath, htmlText, { encoding: "utf8" })
  }

  for (let key in componentMap) {
    const Component = componentMap[key]
    buildByComponent(key, Component)
  }
}

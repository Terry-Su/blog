import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled, { createGlobalStyle } from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import GlobalMarkdownStyle from '@/styles/GlobalMarkdownStyle'
import { MDXTag } from '@mdx-js/tag'

import getReactLiveComponentMap from '../../../shared/getReactLiveComponentMap'
import ReactLiveComponent from '../ReactLive/ReactLiveComponent'

class Props extends DefaultComponentProps {}

class State {}

const basicScope = {
  React,
  MDXTag,
  LiveProvider,
  LiveError,
  LivePreview,
  LiveEditor,
  styled,
  // For local scope
  scope: {}
}

export default class Markdown extends Component<Props, State> {
  get componentMap() {
    const { componentTextMap = {} } = getDefaultData()
    const res = getReactLiveComponentMap(componentTextMap)
    if (Object.keys(res).length > 0) {
      debugger
    }
    return res
  }

  transformedCode(code: string) {
    // const res = babel.transform(code, {
    //   presets: ["react"],
    // }).code
    return code
  }

  render() {
    const { text } = getDefaultData()
    const scope = {
      ...basicScope,
      ...this.componentMap
    }
    return (
      <React.Fragment>
        {/* <div
          className="markdown-body"
          style={{
            width: `100%`,
            height: `100%`
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div> */}
        <div
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <LiveProvider scope={scope} noInline={true} code={text}>
            <LiveError />
            <LivePreview
              className="markdown-body"
              style={{
                width: "100%",
                height: "100%"
              }}
            />
          </LiveProvider>
        </div>
        <GlobalMarkdownStyle />
      </React.Fragment>
    )
  }
}

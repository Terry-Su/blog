import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled, { createGlobalStyle } from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import GlobalMarkdownStyle from '@/styles/GlobalMarkdownStyle'
import { MDXTag } from '@mdx-js/tag'

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
  styled
}

export default class Markdown extends Component<Props, State> {
  get componentMap() {
    let res = {}
    const { componentTextMap = {} } = getDefaultData()
    for (let key in componentTextMap) {
      const componentText =
        componentTextMap[key] != null ? componentTextMap[key] : ""
      const Component = props => (
        <ReactLiveComponent {...props} code={componentText} />
      )
      res[key] = Component
    }
    return res
  }
  render() {
    const { text } = getDefaultData()

    // console.log(text)
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

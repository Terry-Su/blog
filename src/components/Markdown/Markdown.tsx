import Prism from 'prismjs'
import React, { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import GlobalMarkdownStyle from '@/styles/GlobalMarkdownStyle'
import { initMermaid } from '@/utils/mermaid'
import { MDXTag } from '@mdx-js/tag'

import Live from '../Live/Live'

// support jsx
require("prismjs/components/prism-jsx.min")

class Props extends DefaultComponentProps {}

class State {}

const basicScope = {
  Live,
  MDXTag,
  styled,
  // For local scope
  scope: {}
}

export default class Markdown extends Component<Props, State> {
  componentDidMount() {
    initMermaid()
    setTimeout( () => Prism.highlightAll(), 0 )
  }

  get liveCodes() { return `${getDefaultData().text}\n${getDefaultData().importedCodes}` }

  render() {
    const scope = {
      ...basicScope,
      // ...this.componentMap
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
        <StyledRoot className="markdown-body">
          <Live scope={ scope } code={this.liveCodes} />
        </StyledRoot>
        <GlobalMarkdownStyle />
      </React.Fragment>
    )
  }
}

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;

  .markdown-body {
    width: 100%;
    height: 100%;
  }
`

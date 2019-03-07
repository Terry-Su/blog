import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import GlobalMarkdownStyle from '@/styles/GlobalMarkdownStyle'

class Props extends DefaultComponentProps {}

class State {}

export default class Markdown extends Component<Props, State> {
  render() {
    const {
      title,
      text,
      postTime,
      path,
      remarkReprintingNote,
      remarkEndingWords
    } = getDefaultData()
    return (
      <React.Fragment>
        <div
          className="markdown-body"
          style={{
            width: `100%`,
            height: `100%`
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <GlobalMarkdownStyle />
      </React.Fragment>
    )
  }
}

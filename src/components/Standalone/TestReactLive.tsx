import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled from 'styled-components'

const scope = { styled }

export default class TestReactLive extends Component {
  render() {
    return (
      <div>
        <LiveProvider
          scope={scope}
          noInline={true}
          code={`
const StyledRoot = styled.div\`width:100px;height:100px;background: blue;\`
render( <StyledRoot>Test</StyledRoot> )
`}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      </div>
    )
  }
}

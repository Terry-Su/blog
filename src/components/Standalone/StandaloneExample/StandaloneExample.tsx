import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled from 'styled-components'

import * as codeMap from './codeMap'

const code: any = codeMap.SetStateUsingFunction
const scope = { styled }
export default class StandaloneExample extends Component {
  render() {
    return (
      <StyledRoot>
        <LiveProvider scope={scope} noInline={true} code={code}>
          {/* <LiveEditor /> */}
          <LiveError />
          <LivePreview
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </LiveProvider>
      </StyledRoot>
    )
  }
}

const StyledRoot = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
`

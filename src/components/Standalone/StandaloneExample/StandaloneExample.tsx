import React, { Component } from 'react'
import styled from 'styled-components'

import Live from '@/components/Live/Live'

import * as codeMap from './codeMap'

const code: any = codeMap.ModalApp
const scope = { styled }
export default class StandaloneExample extends Component {
  render() {
    return (
      <StyledRoot>
        <Live scope={ scope } code={code} />
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

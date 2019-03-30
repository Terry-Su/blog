import React, { Component } from 'react'
import styled from 'styled-components'

import StandaloneExample from './StandaloneExample/StandaloneExample'
import TestReactLive from './TestReactLive'

const Standalone = StandaloneExample
// const Standalone = getComponents().TestReactLive

export default class Template extends Component {
  render() {
    return (
      <StyledRoot>
        <Standalone />
      </StyledRoot>
    )
  }
}

function getComponents() {
  return {
    TestReactLive
  }
}

const StyledRoot = styled.div``
